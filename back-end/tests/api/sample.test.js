const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const { Sample } = require('../../models/sample');

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
    await Sample.deleteMany({});
    await Sample.insertMany([
        {
            sample_date: "2021-10-20T00:00:00.000Z",
            sample_lat: "28.64",
            sample_lon: "-17.87",
            sample_nat: true,
            afe_code: "LAP-2-DB1",
            volc_num: 383010,
            volc_name: "La Palma",
            lab_procedure: ["cleaning", "sieving"],
            sample_code: "LAP-2-DB1_1"
        },
        {
            sample_date: "2014-02-14T00:00:00.000Z",
            sample_lat: "-7.26",
            sample_lon: "111.56",
            sample_nat: true,
            afe_code: "KEL-16-DB2",
            volc_num: 263280,
            volc_name: "Kelud",
            lab_procedure: ["cleaning", "sieving"],
            sample_code: "KEL-16-DB2_1"
        },
        {
            sample_date: null,
            sample_lat: "40.82",
            sample_lon: "14.43",
            sample_nat: false,
            afe_code: "VE-00-EXP",
            volc_num: 211020,
            volc_name: "Vesuvius",
            lab_procedure: ["cleaning", "sieving"],
            sample_code: "VE-00-EXP_1"
        }
    ]);
});

describe('GET /api/samples', () => {
    it('should return all samples with correct pagination structure', async () => {
        const res = await request(app).get('/api/samples');
        
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

        // Check sample data structure
        const sample = res.body.data[0];
        expect(sample).toHaveProperty('sample_code');
        expect(sample).toHaveProperty('sample_date');
        expect(sample).toHaveProperty('sample_lat');
        expect(sample).toHaveProperty('sample_lon');
        expect(sample).toHaveProperty('volc_num');
        expect(sample).toHaveProperty('afe_code');
        expect(sample).toHaveProperty('sample_nat');
    });

    it('should handle pagination parameters correctly', async () => {
        const res = await request(app).get('/api/samples?limit=2&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
        expect(res.body.pagination.hasPrev).toBe(false);
    });

    it('should handle offset parameter correctly', async () => {
        const res = await request(app).get('/api/samples?limit=1&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.offset).toBe(1);
        expect(res.body.pagination.hasNext).toBe(true);
    });

    it('should enforce maximum limit', async () => {
        const res = await request(app).get('/api/samples?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should handle database errors gracefully', async () => {
        const spy = jest.spyOn(Sample, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/samples');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});

describe('GET /api/samples/:id', () => {
    it('should return sample by sample_code with detailed validation', async () => {
        const res = await request(app).get('/api/samples/KEL-16-DB2_1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.sample_code).toBe('KEL-16-DB2_1');
        expect(res.body.volc_num).toBe(263280);
        expect(res.body.afe_code).toBe('KEL-16-DB2');
        expect(res.body.sample_nat).toBe(true);
        expect(res.body.sample_lat).toBe('-7.26');
        expect(res.body.sample_lon).toBe('111.56');
    });

    it('should return 404 for non-existent sample', async () => {
        const res = await request(app).get('/api/samples/NONEXISTENT_SAMPLE');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle invalid sample code format', async () => {
        const res = await request(app).get('/api/samples/12345');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Sample, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/samples/KEL-16-DB2_1');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('GET /api/samples with filtering', () => {
    it('should filter samples by volcano number', async () => {
        const res = await request(app).get('/api/samples?volc_num=263280');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].sample_code).toBe('KEL-16-DB2_1');
        expect(res.body.data[0].volc_num).toBe(263280);
        expect(res.body.pagination.total).toBe(1);
    });

    it('should filter samples by sample_code using regex search', async () => {
        const res = await request(app).get('/api/samples?sample_code=KEL');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].sample_code).toContain('KEL');
    });

    it('should filter samples by AFE code', async () => {
        const res = await request(app).get('/api/samples?afe_code=LAP-2-DB1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].afe_code).toBe('LAP-2-DB1');
    });

    it('should filter samples by natural status', async () => {
        const res = await request(app).get('/api/samples?sample_nat=true');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(sample => sample.sample_nat === true)).toBe(true);
    });

    it('should filter samples by lab procedure', async () => {
        const res = await request(app).get('/api/samples?lab_procedure=cleaning');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // All samples have cleaning procedure
        expect(res.body.data.every(sample => sample.lab_procedure.includes('cleaning'))).toBe(true);
    });

    it('should filter samples by sample latitude', async () => {
        const res = await request(app).get('/api/samples?sample_lat=28.64');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].sample_lat).toBe('28.64');
    });

    it('should combine multiple filters', async () => {
        const res = await request(app).get('/api/samples?sample_nat=true&volc_num=263280');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].sample_nat).toBe(true);
        expect(res.body.data[0].volc_num).toBe(263280);
    });

    it('should combine filtering with pagination', async () => {
        const res = await request(app).get('/api/samples?sample_nat=true&limit=1&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.total).toBe(2);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
    });

    it('should return 404 for volcano with no samples', async () => {
        const res = await request(app).get('/api/samples?volc_num=999999');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should return 404 for non-matching sample code', async () => {
        const res = await request(app).get('/api/samples?sample_code=NONEXISTENT');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should return 404 for non-matching AFE code', async () => {
        const res = await request(app).get('/api/samples?afe_code=FAKE-CODE');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Sample, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/samples?volc_num=263280');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});


describe('GET /api/samples/stats', () => {
    it('should return sample statistics', async () => {
        const res = await request(app).get('/api/samples/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('byVolcano');
        expect(res.body).toHaveProperty('byAFECode');
        expect(res.body.total).toBe(3);
        expect(Array.isArray(res.body.byVolcano)).toBe(true);
        expect(Array.isArray(res.body.byAFECode)).toBe(true);
    });

    it('should return volcano statistics in correct format', async () => {
        const res = await request(app).get('/api/samples/stats');
        
        expect(res.statusCode).toBe(200);
        
        const byVolcano = res.body.byVolcano;
        expect(byVolcano.length).toBeGreaterThan(0);
        
        // Check structure of volcano stats
        byVolcano.forEach(volcano => {
            expect(volcano).toHaveProperty('volc_num');
            expect(volcano).toHaveProperty('count');
            expect(typeof volcano.count).toBe('number');
        });
    });

    it('should return AFE code statistics in correct format', async () => {
        const res = await request(app).get('/api/samples/stats');
        
        expect(res.statusCode).toBe(200);
        
        const byAFECode = res.body.byAFECode;
        expect(byAFECode.length).toBe(3);
        
        // Check structure of AFE code stats
        byAFECode.forEach(afe => {
            expect(afe).toHaveProperty('afe_code');
            expect(afe).toHaveProperty('count');
            expect(typeof afe.count).toBe('number');
        });
    });

    it('should return 404 when no samples exist', async () => {
        // Mock empty result
        const spy = jest.spyOn(Sample, 'countDocuments').mockResolvedValue(0);

        const res = await request(app).get('/api/samples/stats');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
        
        spy.mockRestore();
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Sample, 'countDocuments').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/samples/stats');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('Edge cases and error handling', () => {
    it('should handle malformed limit parameter', async () => {
        const res = await request(app).get('/api/samples?limit=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(100); // Should default to 100
    });

    it('should handle negative limit parameter', async () => {
        const res = await request(app).get('/api/samples?limit=-5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1); // Should default to minimum 1
    });

    it('should handle excessive limit parameter', async () => {
        const res = await request(app).get('/api/samples?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should handle malformed page parameter', async () => {
        const res = await request(app).get('/api/samples?page=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle negative page parameter', async () => {
        const res = await request(app).get('/api/samples?page=-1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle page beyond available data', async () => {
        const res = await request(app).get('/api/samples?page=999&limit=1');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle empty string filters', async () => {
        const res = await request(app).get('/api/samples?sample_code=');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should return all samples
    });

    it('should handle multiple query parameters with same key', async () => {
        const res = await request(app).get('/api/samples?volc_num=263280&volc_num=383010');
        
        expect(res.statusCode).toBe(200);
        // Should use the last value
    });

    it('should handle unknown query parameters', async () => {
        const res = await request(app).get('/api/samples?unknown_param=test');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should ignore unknown params
    });

    it('should handle special characters in search', async () => {
        const res = await request(app).get('/api/samples?sample_code=Test%20Sample%20$pecial');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle numeric fields as strings', async () => {
        const res = await request(app).get('/api/samples?volc_num=263280');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].volc_num).toBe(263280);
    });

    it('should handle boolean fields correctly', async () => {
        const res = await request(app).get('/api/samples?sample_nat=true');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(sample => sample.sample_nat === true)).toBe(true);
    });

    it('should handle case sensitivity in boolean filters', async () => {
        const res = await request(app).get('/api/samples?sample_nat=True');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1); // "True" converts to false, matching 1 record
    });

    it('should handle array field filtering', async () => {
        const res = await request(app).get('/api/samples?lab_procedure=sieving');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // All samples have sieving procedure
    });

    it('should handle combined pagination and offset', async () => {
        const res = await request(app).get('/api/samples?limit=1&page=2&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.page).toBe(2);
    });

    it('should handle date field filtering', async () => {
        const res = await request(app).get('/api/samples?sample_date=2021-10-20T00:00:00.000Z');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].afe_code).toBe('LAP-2-DB1');
    });

    it('should handle database connection errors', async () => {
        const spy = jest.spyOn(Sample, 'find').mockImplementation(() => {
            throw new Error('Connection refused');
        });

        const res = await request(app).get('/api/samples');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});