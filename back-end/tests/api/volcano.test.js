const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const { Volcano } = require('../../models/volcano');
const e = require('express');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Volcano.deleteMany({});
    await Volcano.insertMany([
        {
            volc_num: 210010,
            volc_name: "West Eifel Volcanic Field",
            volc_country: "Germany",
            volc_mcont: "European Volcanic Regions",
            volc_subreg: "Central European Volcanic Province",
            volc_loc: "Cluster",
            volc_type: "Volcanic field",
            volc_status: "Eruption Dated",
            volc_last_eruption: "8300 BCE",
            volc_slat: "50.17",
            volc_slon: "6.85",
            volc_selev: "600",
            tectonic_settings: "Rift zone / Continental crust (>25 km)",
            volc_rtype: "Foidite",
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:15.216Z",
            imgURL: null
        },
        {
            volc_num: 210020,
            volc_name: "Chaine des Puys",
            volc_country: "France",
            volc_mcont: "European Volcanic Regions",
            volc_subreg: "Western European Volcanic Province",
            volc_loc: "Cluster",
            volc_type: "Lava dome(s)",
            volc_status: "Eruption Dated",
            volc_last_eruption: "4040 BCE",
            volc_slat: "45.786",
            volc_slon: "2.981",
            volc_selev: "1464",
            tectonic_settings: "Rift zone / Continental crust (>25 km)",
            volc_rtype: "Basalt / Picro-Basalt",
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:15.216Z",
            imgURL: null
        },
        {
            volc_num: 211010,
            volc_name: "Campi Flegrei",
            volc_country: "Italy",
            volc_mcont: "European Volcanic Regions",
            volc_subreg: "Italian Peninsula Volcanic Provinces",
            volc_loc: "Caldera",
            volc_type: "Caldera",
            volc_status: "Eruption Observed",
            volc_last_eruption: "1538 CE",
            volc_slat: "40.827",
            volc_slon: "14.139",
            volc_selev: "458",
            tectonic_settings: "Subduction zone / Continental crust (>25 km)",
            volc_rtype: "Trachyte / Trachydacite",
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:15.216Z",
            imgURL: null
        }
    ]);
});

describe('GET /api/volcanoes', () => {
    it('should return all volcanoes with correct pagination structure', async () => {
        const res = await request(app).get('/api/volcanoes');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('pagination');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(3);
        
        // Check pagination metadata
        expect(res.body.pagination.total).toBe(3);
        expect(res.body.pagination.limit).toBe(100);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(1);
        expect(res.body.pagination.hasNext).toBe(false);
        expect(res.body.pagination.hasPrev).toBe(false);

        const volcano = res.body.data[0];
        expect(volcano).toHaveProperty('volc_num');
        expect(volcano).toHaveProperty('volc_name');
        expect(volcano).toHaveProperty('volc_country');
        expect(volcano).toHaveProperty('volc_mcont');
        expect(volcano).toHaveProperty('volc_subreg');
        expect(volcano).toHaveProperty('volc_loc');
        expect(volcano).toHaveProperty('volc_type');
        expect(volcano).toHaveProperty('volc_status');
        expect(volcano).toHaveProperty('volc_last_eruption');
        expect(volcano).toHaveProperty('volc_slat');
        expect(volcano).toHaveProperty('volc_slon');
        expect(volcano).toHaveProperty('volc_selev');
        expect(volcano).toHaveProperty('tectonic_settings');
        expect(volcano).toHaveProperty('volc_rtype');
        expect(volcano).toHaveProperty('data_source');
    });

    it('should handle pagination parameters correctly', async () => {
        const res = await request(app).get('/api/volcanoes?limit=2&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
        expect(res.body.pagination.hasPrev).toBe(false);
    });

    it('should handle offset parameter correctly', async () => {
        const res = await request(app).get('/api/volcanoes?limit=1&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.limit).toBe(1);
    });

    it('should enforce maximum limit', async () => {
        const res = await request(app).get('/api/volcanoes?limit=2000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000);
    });

    it('should handle database errors gracefully', async () => {
        const spy = jest.spyOn(Volcano, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/volcanoes');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/volcanoes/:id', () => {
    it('should return volcano by volc_num', async () => {
        const res = await request(app).get('/api/volcanoes/211010');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.volc_name).toBe('Campi Flegrei');
        expect(res.body.volc_num).toBe(211010);
        expect(res.body.volc_country).toBe('Italy');
        expect(res.body.tectonic_settings).toBe('Subduction zone / Continental crust (>25 km)');
    });

    it('should return 404 for non-existent volcano number', async () => {
        const res = await request(app).get('/api/volcanoes/999999');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle invalid numeric ID', async () => {
        const res = await request(app).get('/api/volcanoes/invalid-id');
        
        // The controller tries to convert 'invalid-id' to Number, which causes an error
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Volcano, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/volcanoes/211010');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/volcanoes/stats', () => {
    it('should return comprehensive volcano statistics', async () => {
        const res = await request(app).get('/api/volcanoes/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.total_volcanoes).toBe(3);
        
        // Check all required statistical arrays
        expect(Array.isArray(res.body.countries)).toBe(true);
        expect(Array.isArray(res.body.tectonic_settings)).toBe(true);
        expect(Array.isArray(res.body.rock_types)).toBe(true);
        expect(Array.isArray(res.body.volcano_types)).toBe(true);

        // Verify specific values from our test data
        expect(res.body.countries).toContain('Italy');
        expect(res.body.tectonic_settings).toContain('Subduction zone / Continental crust (>25 km)');
        expect(res.body.rock_types).toContain('Foidite');
        expect(res.body.volcano_types).toContain('Caldera');
    });

    it('should handle database errors gracefully', async () => {
        const spy = jest.spyOn(Volcano, 'countDocuments').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/volcanoes/stats');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('API Edge Cases and Error Handling', () => {
    it('should handle invalid pagination parameters gracefully', async () => {
        const res = await request(app).get('/api/volcanoes?limit=abc&page=xyz');
        
        expect(res.statusCode).toBe(200);
        // Should use default values when invalid parameters are provided
        expect(res.body.pagination.limit).toBe(100);
        expect(res.body.pagination.page).toBe(1);
    });

    it('should handle negative pagination parameters', async () => {
        const res = await request(app).get('/api/volcanoes?limit=-5&page=-2');
        
        expect(res.statusCode).toBe(200);
        // Should use default/minimum values for negative inputs
        expect(res.body.pagination.limit).toBeGreaterThan(0);
        expect(res.body.pagination.page).toBeGreaterThan(0);
    });

    it('should handle zero values in pagination', async () => {
        const res = await request(app).get('/api/volcanoes?limit=0&page=0');
        
        expect(res.statusCode).toBe(200);
        // Should handle zero values appropriately
        expect(res.body.pagination.limit).toBeGreaterThan(0);
        expect(res.body.pagination.page).toBeGreaterThan(0);
    });

    it('should return 404 for special characters in search queries', async () => {
        const res = await request(app).get('/api/volcanoes?volc_name=' + encodeURIComponent('Test@#$%'));
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 for empty database', async () => {
        await Volcano.deleteMany({});
        
        const res = await request(app).get('/api/volcanoes');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });
});

describe('GET /api/volcanoes with filtering', () => {
    it('should filter volcanoes by country', async () => {
        const res = await request(app).get('/api/volcanoes?volc_country=Italy');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(v => v.volc_country === 'Italy')).toBe(true);
        expect(res.body.pagination.total).toBe(1);
    });

    it('should filter volcanoes by tectonic_settings', async () => {
        const encoded = encodeURIComponent('Subduction zone / Continental crust (>25 km)');
        const res = await request(app).get(`/api/volcanoes?tectonic_settings=${encoded}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(v => v.tectonic_settings === 'Subduction zone / Continental crust (>25 km)')).toBe(true);
    });

    it('should filter volcanoes by name using regex search', async () => {
        const res = await request(app).get('/api/volcanoes?volc_name=Campi');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Campi Flegrei');
    });

    it('should filter volcanoes by volcano type', async () => {
        const res = await request(app).get('/api/volcanoes?volc_type=Caldera');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Campi Flegrei');
    });

    it('should filter volcanoes by rock type', async () => {
        const res = await request(app).get('/api/volcanoes?volc_rtype=Foidite');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(v => v.volc_rtype === 'Foidite')).toBe(true);
    });

    it('should filter volcanoes by elevation range', async () => {
        const res = await request(app).get('/api/volcanoes?volc_selev=458');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Campi Flegrei');
    });

    it('should combine multiple filters', async () => {
        const res = await request(app).get('/api/volcanoes?volc_country=Italy&volc_type=Caldera');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Campi Flegrei');
    });

    it('should combine filtering with pagination', async () => {
        const res = await request(app).get('/api/volcanoes?volc_country=Italy&limit=2&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.total).toBe(1);
        expect(res.body.pagination.pages).toBe(1);
    });

    it('should return 404 for non-existent filters', async () => {
        const res = await request(app).get('/api/volcanoes?volc_country=NonExistentCountry');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database errors in filtering', async () => {
        const spy = jest.spyOn(Volcano, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/volcanoes?volc_country=Italy');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('GET /api/volcanoes/stats', () => {
    it('should return comprehensive volcano statistics', async () => {
        const res = await request(app).get('/api/volcanoes/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.total_volcanoes).toBe(3);
        expect(Array.isArray(res.body.countries)).toBe(true);
        expect(Array.isArray(res.body.tectonic_settings)).toBe(true);
        expect(Array.isArray(res.body.rock_types)).toBe(true);
        expect(Array.isArray(res.body.volcano_types)).toBe(true);

        expect(res.body.countries).toContain('Italy');
        expect(res.body.tectonic_settings).toContain('Subduction zone / Continental crust (>25 km)');
        expect(res.body.rock_types).toContain('Foidite');
        expect(res.body.volcano_types).toContain('Caldera');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Volcano, 'countDocuments').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/volcanoes/stats');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});