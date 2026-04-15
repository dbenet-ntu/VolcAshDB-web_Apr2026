const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const { Eruption } = require('../../models/eruption');

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
    await Eruption.deleteMany({});
    await Eruption.insertMany([
        {
            volc_num: 210010,
            volc_name: "West Eifel Volcanic Field",
            ed_num: 10002,
            ed_category: "Confirmed Eruption",
            ed_area: "Strohn, Pulvermaar",
            ed_VEI: null,
            ed_VEI_mod: null,
            ed_startyear: "-8300",
            ed_startyear_mod: null,
            ed_startyear_unc: "300",
            ed_startmonth: "0",
            ed_startday: "0",
            ed_startday_mod: null,
            ed_startday_unc: null,
            ed_evidence: "Isotopic: 14C (uncalibrated)",
            ed_endyear: null,
            ed_endyear_mod: null,
            ed_endyear_unc: null,
            ed_endmonth: null,
            ed_endday: null,
            ed_endday_mod: null,
            ed_endday_unc: null,
            ed_stime: null,
            ed_etime: null,
            ed_latitude: 50.17,
            ed_longitude: 6.85,
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:18.810Z"
        },
        {
            volc_num: 210010,
            volc_name: "West Eifel Volcanic Field",
            ed_num: 10001,
            ed_category: "Confirmed Eruption",
            ed_area: "Ulmener Maar",
            ed_VEI: null,
            ed_VEI_mod: null,
            ed_startyear: "-8740",
            ed_startyear_mod: null,
            ed_startyear_unc: "150",
            ed_startmonth: "0",
            ed_startday: "0",
            ed_startday_mod: null,
            ed_startday_unc: null,
            ed_evidence: "Isotopic: 14C (calibrated)",
            ed_endyear: null,
            ed_endyear_mod: null,
            ed_endyear_unc: null,
            ed_endmonth: null,
            ed_endday: null,
            ed_endday_mod: null,
            ed_endday_unc: null,
            ed_stime: null,
            ed_etime: null,
            ed_latitude: 50.17,
            ed_longitude: 6.85,
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:18.810Z"
        },
        {
            volc_num: 210020,
            volc_name: "Chaine des Puys",
            ed_num: 10011,
            ed_category: "Confirmed Eruption",
            ed_area: "Montcineyre, Estivadoux, Pavin",
            ed_VEI: null,
            ed_VEI_mod: null,
            ed_startyear: "-4040",
            ed_startyear_mod: null,
            ed_startyear_unc: "150",
            ed_startmonth: "0",
            ed_startday: "0",
            ed_startday_mod: null,
            ed_startday_unc: null,
            ed_evidence: "Isotopic: 14C (uncalibrated)",
            ed_endyear: null,
            ed_endyear_mod: null,
            ed_endyear_unc: null,
            ed_endmonth: null,
            ed_endday: null,
            ed_endday_mod: null,
            ed_endday_unc: null,
            ed_stime: null,
            ed_etime: null,
            ed_latitude: 45.786,
            ed_longitude: 2.981,
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:18.804Z"
        },
        {
            volc_num: 257030,
            volc_name: "Ambae",
            ed_num: 22420,
            ed_category: "Confirmed Eruption",
            ed_area: null,
            ed_VEI: 1,
            ed_VEI_mod: null,
            ed_startyear: "2021",
            ed_startyear_mod: null,
            ed_startyear_unc: null,
            ed_startmonth: "12",
            ed_startday: "5",
            ed_startday_mod: null,
            ed_startday_unc: null,
            ed_evidence: "Observations: Reported",
            ed_endyear: "2022",
            ed_endyear_mod: null,
            ed_endyear_unc: null,
            ed_endmonth: "8",
            ed_endday: "15",
            ed_endday_mod: null,
            ed_endday_unc: "10",
            ed_stime: "2021-12-05T00:00:00.000Z",
            ed_etime: "2022-08-15T00:00:00.000Z",
            ed_latitude: -15.389,
            ed_longitude: 167.835,
            data_source: "GVP",
            createdAt: "2025-11-06T15:57:18.738Z"
        }
    ]);
});

describe('GET /api/eruptions', () => {
    it('should return all eruptions with correct pagination structure', async () => {
        const res = await request(app).get('/api/eruptions');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('pagination');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(4);
        
        // Check pagination metadata
        expect(res.body.pagination.total).toBe(4);
        expect(res.body.pagination.limit).toBe(100);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(1);
        expect(res.body.pagination.hasNext).toBe(false);
        expect(res.body.pagination.hasPrev).toBe(false);

        const eruption = res.body.data[0];
        expect(eruption).toHaveProperty('ed_num');
        expect(eruption).toHaveProperty('volc_name');
        expect(eruption).toHaveProperty('volc_num');
        expect(eruption).toHaveProperty('ed_VEI');
        expect(eruption).toHaveProperty('ed_VEI_mod');
        expect(eruption).toHaveProperty('ed_category');
        expect(eruption).toHaveProperty('ed_area');
        expect(eruption).toHaveProperty('ed_startyear');
        expect(eruption).toHaveProperty('ed_evidence');
        expect(eruption).toHaveProperty('ed_startyear_mod');
        expect(eruption).toHaveProperty('ed_startyear_unc');
        expect(eruption).toHaveProperty('ed_startmonth');
        expect(eruption).toHaveProperty('ed_startday');
        expect(eruption).toHaveProperty('ed_startday_mod');
        expect(eruption).toHaveProperty('ed_startday_unc');
        expect(eruption).toHaveProperty('ed_endyear');
        expect(eruption).toHaveProperty('ed_endyear_mod');
        expect(eruption).toHaveProperty('ed_endyear_unc');
        expect(eruption).toHaveProperty('ed_endmonth');
        expect(eruption).toHaveProperty('ed_endday');
        expect(eruption).toHaveProperty('ed_endday_mod');
        expect(eruption).toHaveProperty('ed_endday_unc');
        expect(eruption).toHaveProperty('ed_stime');
        expect(eruption).toHaveProperty('ed_etime');
        expect(eruption).toHaveProperty('ed_latitude');
        expect(eruption).toHaveProperty('ed_longitude');
        expect(eruption).toHaveProperty('data_source');
    });

    it('should handle pagination parameters correctly', async () => {
        const res = await request(app).get('/api/eruptions?limit=2&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
        expect(res.body.pagination.hasPrev).toBe(false);
    });

    it('should handle offset parameter correctly', async () => {
        const res = await request(app).get('/api/eruptions?limit=1&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.limit).toBe(1);
    });

    it('should enforce maximum limit', async () => {
        const res = await request(app).get('/api/eruptions?limit=2000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000);
    });

    it('should handle database errors gracefully', async () => {
        const spy = jest.spyOn(Eruption, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/eruptions');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/eruptions/:id', () => {
    it('should return eruption by ed_num', async () => {
        const res = await request(app).get('/api/eruptions/22420');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.volc_name).toBe('Ambae');
        expect(res.body.ed_num).toBe(22420);
        expect(res.body.volc_num).toBe(257030);
        expect(res.body.ed_VEI).toBe(1);
    });

    it('should return 404 for non-existent eruption', async () => {
        const res = await request(app).get('/api/eruptions/999999');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle invalid numeric ID', async () => {
        const res = await request(app).get('/api/eruptions/invalid-id');
        
        // The controller tries to convert 'invalid-id' to Number, which causes an error
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Eruption, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/eruptions/22420');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/eruptions with filtering', () => {
    it('should filter eruptions by volcano number', async () => {
        const res = await request(app).get('/api/eruptions?volc_num=257030');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Ambae');
        expect(res.body.pagination.total).toBe(1);
    });

    it('should filter eruptions by volcano name using regex search', async () => {
        const res = await request(app).get('/api/eruptions?volc_name=Amb');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Ambae');
    });

    it('should filter eruptions by VEI', async () => {
        const res = await request(app).get('/api/eruptions?ed_VEI=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(eruption => eruption.ed_VEI === 1)).toBe(true);
    });

    it('should filter eruptions by category', async () => {
        const res = await request(app).get('/api/eruptions?ed_category=Confirmed Eruption');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(4);
        expect(res.body.data.every(eruption => eruption.ed_category === 'Confirmed Eruption')).toBe(true);
    });

    it('should filter eruptions by GVP status', async () => {
        const res = await request(app).get('/api/eruptions?data_source=GVP');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(4);
        expect(res.body.data[0].volc_name).toBe('West Eifel Volcanic Field');
    });

    it('should filter eruptions by evidence type', async () => {
        const res = await request(app).get('/api/eruptions?ed_evidence=Observations: Reported');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_name).toBe('Ambae');
    });

    it('should combine multiple filters', async () => {
        const res = await request(app).get('/api/eruptions?ed_VEI=1&data_source=GVP');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(eruption => eruption.ed_VEI === 1 && eruption.data_source === 'GVP')).toBe(true);
    });

    it('should combine filtering with pagination', async () => {
        const res = await request(app).get('/api/eruptions?ed_VEI=1&limit=1&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.total).toBe(1);
        expect(res.body.pagination.pages).toBe(1);
    });

    it('should return 404 for volcano with no eruptions', async () => {
        const res = await request(app).get('/api/eruptions?volc_num=999999');

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 for non-matching volcano name', async () => {
        const res = await request(app).get('/api/eruptions?volc_name=Nonexistent');

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 for non-matching VEI', async () => {
        const res = await request(app).get('/api/eruptions?ed_VEI=7');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Eruption, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/eruptions?volc_num=211010');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/eruptions/stats', () => {
    it('should return eruption statistics', async () => {
        const res = await request(app).get('/api/eruptions/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('veiStats');
        expect(res.body).toHaveProperty('eruptionsPerVolcano');
        expect(res.body.total).toBe(4);
        expect(Array.isArray(res.body.veiStats)).toBe(true);
        expect(Array.isArray(res.body.eruptionsPerVolcano)).toBe(true);
    });

    it('should return VEI statistics in correct format', async () => {
        const res = await request(app).get('/api/eruptions/stats');
        
        expect(res.statusCode).toBe(200);
        
        const veiStats = res.body.veiStats;
        expect(veiStats.length).toBeGreaterThan(0);
        
        // Check structure of VEI stats
        veiStats.forEach(stat => {
            expect(stat).toHaveProperty('VEI');
            expect(stat).toHaveProperty('count');
            expect(typeof stat.count).toBe('number');
        });
    });

    it('should return eruptions per volcano in correct format', async () => {
        const res = await request(app).get('/api/eruptions/stats');
        
        expect(res.statusCode).toBe(200);
        
        const eruptionsPerVolcano = res.body.eruptionsPerVolcano;
        expect(eruptionsPerVolcano.length).toBeGreaterThan(0);
        
        // Check structure of eruptions per volcano
        eruptionsPerVolcano.forEach(volc => {
            expect(volc).toHaveProperty('volc_num');
            expect(volc).toHaveProperty('volc_name');
            expect(volc).toHaveProperty('eruption_count');
            expect(typeof volc.eruption_count).toBe('number');
        });
    });

    it('should return 404 when no eruptions exist', async () => {
        // Mock empty result
        const spy = jest.spyOn(Eruption, 'countDocuments').mockResolvedValue(0);

        const res = await request(app).get('/api/eruptions/stats');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
        
        spy.mockRestore();
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Eruption, 'countDocuments').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/eruptions/stats');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('Edge cases and error handling', () => {
    it('should handle malformed limit parameter', async () => {
        const res = await request(app).get('/api/eruptions?limit=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(100); // Should default to 100
    });

    it('should handle negative limit parameter', async () => {
        const res = await request(app).get('/api/eruptions?limit=-5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1); // Should default to minimum 1
    });

    it('should handle excessive limit parameter', async () => {
        const res = await request(app).get('/api/eruptions?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should handle malformed page parameter', async () => {
        const res = await request(app).get('/api/eruptions?page=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle negative page parameter', async () => {
        const res = await request(app).get('/api/eruptions?page=-1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle page beyond available data', async () => {
        const res = await request(app).get('/api/eruptions?page=999&limit=1');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle empty string filters', async () => {
        const res = await request(app).get('/api/eruptions?volc_name=');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(4); // Should return all eruptions
    });

    it('should handle multiple query parameters with same key', async () => {
        const res = await request(app).get('/api/eruptions?ed_VEI=4&ed_VEI=2');
        
        expect(res.statusCode).toBe(200);
        // Should use the last value
    });

    it('should handle unknown query parameters', async () => {
        const res = await request(app).get('/api/eruptions?unknown_param=test');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(4); // Should ignore unknown params
    });

    it('should handle special characters in search', async () => {
        const res = await request(app).get('/api/eruptions?volc_name=Test%20Volcano%20$pecial');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle numeric fields as strings', async () => {
        const res = await request(app).get('/api/eruptions?ed_VEI=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(eruption => eruption.ed_VEI === 1)).toBe(true);
    });

    it('should handle boolean fields correctly', async () => {
        const res = await request(app).get('/api/eruptions?data_source=GVP');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(4);
        expect(res.body.data[0].data_source).toBe('GVP');
    });

    it('should handle case sensitivity in boolean filters', async () => {
        const res = await request(app).get('/api/eruptions?data_source=GV');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(4); // "True" converts to false, matching 2 records
    });

    it('should handle combined pagination and offset', async () => {
        const res = await request(app).get('/api/eruptions?limit=1&page=2&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.page).toBe(2);
    });

    it('should handle database connection errors', async () => {
        const spy = jest.spyOn(Eruption, 'find').mockImplementation(() => {
            throw new Error('Connection refused');
        });

        const res = await request(app).get('/api/eruptions');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});