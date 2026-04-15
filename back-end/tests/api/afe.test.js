const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const { AFE } = require('../../models/afe');

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
    await AFE.deleteMany({});
    await AFE.insertMany([
        {
            afe_code: "VE-02-EXP",
            volc_num: 211020,
            afe_date: "0079-01-01T00:00:00.000Z",
            eruptive_style: "Strombolian",
            afe_lat: "40.821",
            afe_lon: "14.426",
            afe_end_date: "0472-01-01T00:00:00.000Z"
        },
        {
            afe_code: "VE-04-EXP",
            volc_num: 211020,
            afe_date: "0079-01-01T00:00:00.000Z",
            eruptive_style: "Strombolian",
            afe_lat: "40.821",
            afe_lon: "14.426",
            afe_end_date: "0472-01-01T00:00:00.000Z"
        },
        {
            afe_code: "ET-00-EXP",
            volc_num: 211060,
            afe_date: "1990-01-05T00:00:00.000Z",
            eruptive_style: "Lava fountaining",
            afe_lat: "37.748",
            afe_lon: "14.999"
        }
    ]);
});

describe('GET /api/afes', () => {
    it('should return all AFEs with correct pagination structure', async () => {
        const res = await request(app).get('/api/afes');
        
        expect(res.statusCode).toBe(200);
        
        // Check main response structure
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('pagination');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(3);

        // Check pagination metadata
        expect(res.body.pagination).toHaveProperty('total', 3);
        expect(res.body.pagination).toHaveProperty('limit', 100);
        expect(res.body.pagination).toHaveProperty('page', 1);
        expect(res.body.pagination).toHaveProperty('pages', 1);
        expect(res.body.pagination).toHaveProperty('hasNext', false);
        expect(res.body.pagination).toHaveProperty('hasPrev', false);

        // Check AFE data structure
        const afe = res.body.data[0];
        expect(afe).toHaveProperty('afe_code');
        expect(afe).toHaveProperty('volc_num');
        expect(afe).toHaveProperty('eruptive_style');
    });

    it('should handle pagination parameters correctly', async () => {
        const res = await request(app).get('/api/afes?limit=2&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
        expect(res.body.pagination.hasPrev).toBe(false);
    });

    it('should handle offset parameter correctly', async () => {
        const res = await request(app).get('/api/afes?limit=1&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.offset).toBe(1);
        expect(res.body.pagination.hasNext).toBe(true);
    });

    it('should enforce maximum limit', async () => {
        const res = await request(app).get('/api/afes?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should include stats when requested', async () => {
        const res = await request(app).get('/api/afes?include_stats=true');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('stats');
        expect(res.body.stats).toHaveProperty('total');
        expect(res.body.stats).toHaveProperty('eruptiveStyles');
        expect(res.body.stats).toHaveProperty('volcanoStats');
    });

    it('should handle database errors gracefully', async () => {
        const spy = jest.spyOn(AFE, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/afes');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/afes with filtering', () => {
    it('should filter AFEs by afe_code', async () => {
        const res = await request(app).get('/api/afes?afe_code=VE-02-EXP');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].afe_code).toBe('VE-02-EXP');
        expect(res.body.pagination.total).toBe(1);
    });

    it('should filter AFEs by afe_code using regex search', async () => {
        const res = await request(app).get('/api/afes?afe_code=VE');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.afe_code.includes('VE'))).toBe(true);
    });

    it('should filter AFEs by volc_num', async () => {
        const res = await request(app).get('/api/afes?volc_num=211020');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.volc_num === 211020)).toBe(true);
    });

    it('should filter AFEs by eruptive_style using regex search', async () => {
        const res = await request(app).get('/api/afes?eruptive_style=Strombolian');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.eruptive_style.includes('Strombolian'))).toBe(true);
    });

    it('should filter AFEs by latitude coordinate', async () => {
        const res = await request(app).get('/api/afes?afe_lat=40.821');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.afe_lat === "40.821")).toBe(true);
    });

    it('should filter AFEs by longitude coordinate', async () => {
        const res = await request(app).get('/api/afes?afe_lon=14.426');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.afe_lon === "14.426")).toBe(true);
    });

    it('should filter AFEs by date', async () => {
        const res = await request(app).get('/api/afes?afe_date=0079-01-01T00:00:00.000Z');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.afe_date === '0079-01-01T00:00:00.000Z')).toBe(true);
    });

    it('should combine multiple filters', async () => {
        const res = await request(app).get('/api/afes?volc_num=211020&eruptive_style=Strombolian');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.volc_num === 211020 && afe.eruptive_style === 'Strombolian')).toBe(true);
    });

    it('should combine filtering with pagination', async () => {
        const res = await request(app).get('/api/afes?volc_num=211020&limit=1&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.total).toBe(2);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
    });

    it('should return 404 for invalid volc_num', async () => {
        const res = await request(app).get('/api/afes?volc_num=20');

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 when no AFEs match criteria', async () => {
        const res = await request(app).get('/api/afes?afe_code=NONEXISTENT');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 for non-matching eruptive style', async () => {
        const res = await request(app).get('/api/afes?eruptive_style=Hawaiian');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(AFE, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/afes?volc_num=211020');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/afes/:id', () => {
    it('should return AFE by afe_code with detailed validation', async () => {
        const res = await request(app).get('/api/afes/VE-02-EXP');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.afe_code).toBe('VE-02-EXP');
        expect(res.body.volc_num).toBe(211020);
        expect(res.body.eruptive_style).toBe('Strombolian');
        expect(res.body.afe_lat).toBe("40.821");
        expect(res.body.afe_lon).toBe("14.426");
        expect(res.body.afe_date).toBe('0079-01-01T00:00:00.000Z');
    });

    it('should return 404 for non-existent AFE', async () => {
        const res = await request(app).get('/api/afes/NONEXISTENT');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 for empty AFE code', async () => {
        const res = await request(app).get('/api/afes/%20');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle invalid AFE code format', async () => {
        const res = await request(app).get('/api/afes/12345');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(AFE, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/afes/VE-02-EXP');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/afes/stats', () => {
    it('should return AFE statistics', async () => {
        const res = await request(app).get('/api/afes/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('eruptiveStyles');
        expect(res.body).toHaveProperty('volcanoStats');
        expect(res.body.total).toBe(3);
        expect(Array.isArray(res.body.eruptiveStyles)).toBe(true);
        expect(Array.isArray(res.body.volcanoStats)).toBe(true);
    });

    it('should return eruptive style statistics in correct format', async () => {
        const res = await request(app).get('/api/afes/stats');
        
        expect(res.statusCode).toBe(200);
        
        const eruptiveStyles = res.body.eruptiveStyles;
        expect(eruptiveStyles.length).toBeGreaterThan(0);
        
        // Check structure of eruptive style stats
        eruptiveStyles.forEach(style => {
            expect(style).toHaveProperty('eruptive_style');
            expect(style).toHaveProperty('count');
            expect(typeof style.count).toBe('number');
        });
        
        // Verify specific data
        const strombolianStyle = eruptiveStyles.find(
            style => style.eruptive_style === 'Strombolian'
        );
        expect(strombolianStyle.count).toBe(2);
    });

    it('should return volcano statistics in correct format', async () => {
        const res = await request(app).get('/api/afes/stats');
        
        expect(res.statusCode).toBe(200);
        
        const volcanoStats = res.body.volcanoStats;
        expect(volcanoStats.length).toBeGreaterThan(0);
        
        // Check structure of volcano stats
        volcanoStats.forEach(volcano => {
            expect(volcano).toHaveProperty('volc_num');
            expect(volcano).toHaveProperty('count');
            expect(typeof volcano.count).toBe('number');
        });
    });

    it('should return 404 when no AFE data exists', async () => {
        await AFE.deleteMany({});
        
        const res = await request(app).get('/api/afes/stats');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(AFE, 'countDocuments').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/afes/stats');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('Edge cases and error handling', () => {
    it('should handle malformed limit parameter', async () => {
        const res = await request(app).get('/api/afes?limit=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(100); // Should default to 100
    });

    it('should handle negative limit parameter', async () => {
        const res = await request(app).get('/api/afes?limit=-5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1); // Should default to minimum 1
    });

    it('should handle excessive limit parameter', async () => {
        const res = await request(app).get('/api/afes?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should handle malformed page parameter', async () => {
        const res = await request(app).get('/api/afes?page=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle negative page parameter', async () => {
        const res = await request(app).get('/api/afes?page=-1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle page beyond available data', async () => {
        const res = await request(app).get('/api/afes?page=999&limit=1');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle empty string filters', async () => {
        const res = await request(app).get('/api/afes?afe_code=');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should return all AFEs
    });

    it('should handle multiple query parameters with same key', async () => {
        const res = await request(app).get('/api/afes?volc_num=211060');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_num).toBe(211060);
    });

    it('should handle unknown query parameters', async () => {
        const res = await request(app).get('/api/afes?unknown_param=test');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should ignore unknown params
    });

    it('should handle special characters in search', async () => {
        const res = await request(app).get('/api/afes?afe_code=Test%20AFE%20$pecial');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle numeric fields as strings', async () => {
        const res = await request(app).get('/api/afes?volc_num=211020');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.volc_num === 211020)).toBe(true);
    });

    it('should handle coordinate field filtering', async () => {
        const res = await request(app).get('/api/afes?afe_lat=40.821');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.afe_lat === "40.821")).toBe(true);
    });

    it('should handle date field filtering correctly', async () => {
        const res = await request(app).get('/api/afes?afe_date=0079-01-01T00:00:00.000Z');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(afe => afe.afe_date === '0079-01-01T00:00:00.000Z')).toBe(true);
    });

    it('should handle regex search in text fields', async () => {
        const res = await request(app).get('/api/afes?eruptive_style=Lava');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].eruptive_style).toContain('Lava');
    });

    it('should handle combined pagination and offset', async () => {
        const res = await request(app).get('/api/afes?limit=1&page=2&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.page).toBe(2);
    });

    it('should handle invalid date format gracefully', async () => {
        const res = await request(app).get('/api/afes?afe_date=invalid-date');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should return all AFEs when date is invalid
    });

    it('should handle stats request with empty database', async () => {
        await AFE.deleteMany({});
        
        const res = await request(app).get('/api/afes?include_stats=true');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database connection errors', async () => {
        const spy = jest.spyOn(AFE, 'find').mockImplementation(() => {
            throw new Error('Connection refused');
        });

        const res = await request(app).get('/api/afes');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});