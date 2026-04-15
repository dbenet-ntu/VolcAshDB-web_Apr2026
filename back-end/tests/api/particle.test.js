const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const { Particle } = require('../../models/particle');

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
    await Particle.deleteMany({});
    await Particle.insertMany([
        {
            "main_type": {
                "altered material": 0,
                "free crystal": 0,
                "juvenile": 0,
                "lithic": 0
            },
            "_id": "66c74c0ee59891041433235c",
            "imgURL": "VE-01-EXP_1_2_2_48_VHX_200_unsieved.png",
            "asm": 0.0441938093823742,
            "aspect_rat": 1.553177770844117,
            "blue_mean": 130.1064506995499,
            "blue_mode": 127,
            "blue_std": 40.16769573761673,
            "circ_elon": 3.359573075633458,
            "circ_rect": 1.683016996029108,
            "circularity_cioni": 0.4349887940952096,
            "circularity_dellino": 1.5162156166719056,
            "color": "",
            "comp_elon": 1.603583982935301,
            "compactness": 0.7237166815051326,
            "contrast": 6.658876337280545,
            "convexity": 0.7907451923431611,
            "correlation": 0.2459392192017424,
            "crystallinity": "",
            "dissimilarity": 1.845104290083536,
            "eccentricity_ellipse": 0.7651590529826682,
            "eccentricity_moments": 0.79036532510355,
            "edge": "",
            "elongation": 2.2157620846880097,
            "energy": 0.1994165318181153,
            "green_mean": 88.74339747908185,
            "green_mode": 79,
            "green_std": 35.37209610339032,
            "gsLow": "NA",
            "gsUp": "NA",
            "homogeneity": 0.4036425014393045,
            "hue_mean": 109.67998984404754,
            "hue_mode": 108,
            "hue_std": 5.4442992206507865,
            "hydro_alter_degree": "",
            "id": 48,
            "instrument": "VHX",
            "luster": "",
            "magnification": 200,
            "multi_focus": false,
            "rect_comp": 0.8033339466298955,
            "rectangularity": 1.110011648424603,
            "red_mean": 65.21717008955166,
            "red_mode": 57,
            "red_std": 31.914100570871383,
            "roundness": 0.5746282750904825,
            "saturation_mean": 129.9608823443252,
            "saturation_mode": 126,
            "saturation_std": 42.08630037834967,
            "shape": "",
            "solidity": 0.8327750223595414,
            "sub_type": "",
            "value_mean": 130.12636810091485,
            "value_mode": 127,
            "value_std": 40.18006605892715,
            "volc_name": "Vesuvius",
            "volc_num": 211020,
            "weathering_sign": "",
            "faulty_image": false,
            "requiresDetailedAnnotation": false,
            "ultrasound": true,
            "sample_code": "VE-01-EXP_1",
            "Bullvolc2024": null,
            "Bullvolc2024 (DOI)": null,
            "sdata2025": null,
            "sdata2025 (DOI)": "https://doi.org/10.1007/s00445-023-01695-4"
        },
        {
            "main_type": {
                "altered material": 0,
                "free crystal": 0,
                "juvenile": 0,
                "lithic": 0
            },
            "_id": "66c74c0ee59891041433237c",
            "imgURL": "VE-08-EXP_1_1_1_2_VHX_200_unsieved.png",
            "asm": 0.1338627157196923,
            "aspect_rat": 1.1201530112226987,
            "blue_mean": 60.26890073038732,
            "blue_mode": 57,
            "blue_std": 16.750739387557008,
            "circ_elon": 2.250616091676537,
            "circ_rect": 1.2947922203925053,
            "circularity_cioni": 0.5937368201479654,
            "circularity_dellino": 1.2977857730203173,
            "color": "",
            "comp_elon": 1.3100618841411704,
            "compactness": 0.7554285607849262,
            "contrast": 1.7543111994188,
            "convexity": 0.8925870095512122,
            "correlation": 0.2339523783047299,
            "crystallinity": "",
            "dissimilarity": 0.902530484032348,
            "eccentricity_ellipse": 0.4505817334868945,
            "eccentricity_moments": 0.4710644593672669,
            "edge": "",
            "elongation": 1.7341969209900587,
            "energy": 0.3511528614456218,
            "green_mean": 57.40765647403188,
            "green_mode": 53,
            "green_std": 16.616480759060725,
            "gsLow": "NA",
            "gsUp": "NA",
            "homogeneity": 0.5880815061258486,
            "hue_mean": 146.67863376015833,
            "hue_mode": 150,
            "hue_std": 41.59944192935047,
            "hydro_alter_degree": "",
            "id": 2,
            "instrument": "VHX",
            "luster": "",
            "magnification": 200,
            "multi_focus": false,
            "rect_comp": 0.7536860427204856,
            "rectangularity": 0.997693338384466,
            "red_mean": 62.802979853367255,
            "red_mode": 59,
            "red_std": 17.64279258421753,
            "roundness": 0.734195482257151,
            "saturation_mean": 25.92372084498737,
            "saturation_mode": 24,
            "saturation_std": 11.023975687234415,
            "shape": "",
            "solidity": 0.9173039700788777,
            "sub_type": "",
            "value_mean": 63.41696727634739,
            "value_mode": 59,
            "value_std": 17.423940808480896,
            "volc_name": "Vesuvius",
            "volc_num": 211020,
            "weathering_sign": "",
            "faulty_image": false,
            "requiresDetailedAnnotation": false,
            "ultrasound": true,
            "sample_code": "VE-08-EXP_1",
            "Bullvolc2024": null,
            "Bullvolc2024 (DOI)": null,
            "sdata2025": null,
            "sdata2025 (DOI)": "https://doi.org/10.1007/s00445-023-01695-4"
        },
        {
            "main_type": {
                "altered material": 0,
                "free crystal": 0,
                "juvenile": 100,
                "lithic": 0
            },
            "_id": "66c74c5de59891041434f411",
            "imgURL": "KEL-16-DB2_1_01_4_86_mf_5x_phi1phi2_JJtrlcp.png",
            "asm": 0.1613142465280208,
            "aspect_rat": 1.390873771559607,
            "blue_mean": 182.66319050499789,
            "blue_mode": 197,
            "blue_std": 33.472372662799884,
            "circ_elon": 2.2531559103856607,
            "circ_rect": 1.042434590606677,
            "circularity_cioni": 0.7348541825919999,
            "circularity_dellino": 1.16653940825753,
            "color": "transparent",
            "comp_elon": 1.4806401393285136,
            "compactness": 0.7665803613559042,
            "contrast": 1.6710799541743626,
            "convexity": 0.9664098298076432,
            "correlation": 0.2494249461283029,
            "crystallinity": "low crystallinity",
            "dissimilarity": 0.8460957127225072,
            "eccentricity_ellipse": 0.6950385145587993,
            "eccentricity_moments": 0.6886997749336934,
            "edge": "",
            "elongation": 1.931487178603952,
            "energy": 0.3828115007260378,
            "green_mean": 165.25785957713398,
            "green_mode": 180,
            "green_std": 30.40685618962634,
            "gsLow": "1",
            "gsUp": "2",
            "homogeneity": 0.6114411502421347,
            "hue_mean": 102.31340188425304,
            "hue_mode": 103,
            "hue_std": 6.918669185373132,
            "hydro_alter_degree": "",
            "id": 86,
            "instrument": "mf",
            "luster": "",
            "magnification": 5,
            "multi_focus": true,
            "rect_comp": 0.6850260518423444,
            "rectangularity": 0.8936128374469325,
            "red_mean": 142.24721580548422,
            "red_mode": 155,
            "red_std": 29.961871504170915,
            "roundness": 0.6592016549938683,
            "saturation_mean": 57.24671639091528,
            "saturation_mode": 57,
            "saturation_std": 18.62742283045406,
            "shape": "pumice",
            "solidity": 0.962209470936736,
            "sub_type": "standard juvenile",
            "value_mean": 182.88009179822475,
            "value_mode": 197,
            "value_std": 33.18387296787127,
            "volc_name": "Kelut",
            "volc_num": 263280,
            "weathering_sign": "",
            "faulty_image": false,
            "requiresDetailedAnnotation": false,
            "ultrasound": true,
            "sample_code": "KEL-16-DB2_1",
            "Bullvolc2024": "juvenile",
            "Bullvolc2024 (DOI)": "https://doi.org/10.1029/2023GC011224",
            "sdata2025": null,
            "sdata2025 (DOI)": null
        }
    ]);
});

describe('GET /api/particles', () => {
    it('should return all particles with correct pagination structure', async () => {
        const res = await request(app).get('/api/particles');
        
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

        // Check particle data structure
        const particle = res.body.data[0];
        expect(particle).toHaveProperty('main_type');
        expect(particle).toHaveProperty('imgURL');
        expect(particle).toHaveProperty('volc_name');
        expect(particle).toHaveProperty('sample_code');
    });

    it('should handle pagination parameters correctly', async () => {
        const res = await request(app).get('/api/particles?limit=2&page=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
        expect(res.body.pagination.hasPrev).toBe(false);
    });

    it('should handle offset parameter correctly', async () => {
        const res = await request(app).get('/api/particles?limit=1&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.offset).toBe(1);
        expect(res.body.pagination.hasNext).toBe(true);
    });

    it('should enforce maximum limit', async () => {
        const res = await request(app).get('/api/particles?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should handle database errors gracefully', async () => {
        const spy = jest.spyOn(Particle, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/particles');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});


describe('GET /api/particles/:id', () => {
    it('should return particle by imgURL with detailed validation', async () => {
        const res = await request(app).get('/api/particles/KEL-16-DB2_1_01_4_86_mf_5x_phi1phi2_JJtrlcp.png');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.sample_code).toBe('KEL-16-DB2_1');
        expect(res.body.volc_num).toBe(263280);
        expect(res.body.volc_name).toBe('Kelut');
        expect(res.body.imgURL).toBe('KEL-16-DB2_1_01_4_86_mf_5x_phi1phi2_JJtrlcp.png');
        expect(res.body.id).toBe(86);
        expect(res.body.main_type.juvenile).toBe(100);
    });

    it('should return 404 for non-existent particle', async () => {
        const res = await request(app).get('/api/particles/NONEXISTENT_PARTICLE.png');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not found');
    });

    it('should handle invalid imgURL format', async () => {
        const res = await request(app).get('/api/particles/12345');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not found');
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Particle, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/particles/KEL-16-DB2_1_01_4_86_mf_5x_phi1phi2_JJtrlcp.png');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('GET /api/particles with filtering', () => {
    it('should filter particles by sample code', async () => {
        const res = await request(app).get('/api/particles?sample_code=KEL-16-DB2_1');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].sample_code).toBe('KEL-16-DB2_1');
        expect(res.body.pagination.total).toBe(1);
    });

    it('should filter particles by volcano number', async () => {
        const res = await request(app).get('/api/particles?volc_num=211020');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.volc_num === 211020)).toBe(true);
    });

    it('should filter particles by volcano name using regex search', async () => {
        const res = await request(app).get('/api/particles?volc_name=Vesu');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.volc_name.includes('Vesu'))).toBe(true);
    });

    it('should filter particles by imgURL using regex search', async () => {
        const res = await request(app).get('/api/particles?imgURL=EXP');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.imgURL.includes('EXP'))).toBe(true);
    });

    it('should filter particles by main_type within valid range', async () => {
        const res = await request(app).get('/api/particles?main_type=juvenile');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data.every(p => p.main_type.juvenile >= 80)).toBe(true);
    });

    it('should filter particles by instrument', async () => {
        const res = await request(app).get('/api/particles?instrument=VHX');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.instrument === 'VHX')).toBe(true);
    });

    it('should filter particles by magnification', async () => {
        const res = await request(app).get('/api/particles?magnification=200');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.magnification === 200)).toBe(true);
    });

    it('should filter particles by color', async () => {
        const res = await request(app).get('/api/particles?color=transparent');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].color).toBe('transparent');
    });

    it('should filter particles by shape', async () => {
        const res = await request(app).get('/api/particles?shape=pumice');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].shape).toBe('pumice');
    });

    it('should filter particles by crystallinity', async () => {
        const res = await request(app).get('/api/particles?crystallinity=low crystallinity');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].crystallinity).toBe('low crystallinity');
    });

    it('should combine multiple filters', async () => {
        const res = await request(app).get('/api/particles?volc_num=211020&instrument=VHX');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.volc_num === 211020 && p.instrument === 'VHX')).toBe(true);
    });

    it('should combine filtering with pagination', async () => {
        const res = await request(app).get('/api/particles?volc_num=211020&limit=1&page=1');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.total).toBe(2);
        expect(res.body.pagination.pages).toBe(2);
        expect(res.body.pagination.hasNext).toBe(true);
    });

    it('should return 400 for invalid main_type', async () => {
        const res = await request(app).get('/api/particles?main_type=invalid');

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Bad Request");
    });

    it('should return 404 for non-existent sample code', async () => {
        const res = await request(app).get('/api/particles?sample_code=NONEXISTENT');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should return 404 for non-existent volcano', async () => {
        const res = await request(app).get('/api/particles?volc_num=999999');

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should return 404 for non-matching imgURL', async () => {
        const res = await request(app).get('/api/particles?imgURL=NONEXISTENT');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should return 404 for no main_type matches', async () => {
        const res = await request(app).get('/api/particles?main_type=altered material');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Particle, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/particles?sample_code=TEST');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('GET /api/particles/stats', () => {
    it('should return particle statistics', async () => {
        const res = await request(app).get('/api/particles/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('main_types');
        expect(res.body).toHaveProperty('volcanoes');
        expect(res.body.total).toBe(3);
        expect(Array.isArray(res.body.main_types)).toBe(true);
        expect(Array.isArray(res.body.volcanoes)).toBe(true);
    });

    it('should return main type statistics in correct format', async () => {
        const res = await request(app).get('/api/particles/stats');
        
        expect(res.statusCode).toBe(200);
        
        const main_types = res.body.main_types;
        expect(main_types.length).toBeGreaterThan(0);
        
        // Check structure of main type stats
        main_types.forEach(mt => {
            expect(mt).toHaveProperty('main_type');
            expect(mt).toHaveProperty('count');
            expect(typeof mt.count).toBe('number');
        });
    });

    it('should return volcano statistics in correct format', async () => {
        const res = await request(app).get('/api/particles/stats');
        
        expect(res.statusCode).toBe(200);
        
        const volcanoes = res.body.volcanoes;
        expect(volcanoes.length).toBeGreaterThan(0);
        
        // Check structure of volcano stats
        volcanoes.forEach(volcano => {
            expect(volcano).toHaveProperty('volc_num');
            expect(volcano).toHaveProperty('volc_name');
            expect(volcano).toHaveProperty('count');
            expect(typeof volcano.count).toBe('number');
        });
    });

    it('should return 404 when no particles exist', async () => {
        // Mock empty result
        const spy = jest.spyOn(Particle, 'countDocuments').mockResolvedValue(0);

        const res = await request(app).get('/api/particles/stats');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
        
        spy.mockRestore();
    });

    it('should handle database errors', async () => {
        const spy = jest.spyOn(Particle, 'countDocuments').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/particles/stats');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Internal Server Error");
        
        spy.mockRestore();
    });
});

describe('Edge cases and error handling', () => {
    it('should handle malformed limit parameter', async () => {
        const res = await request(app).get('/api/particles?limit=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(100); // Should default to 100
    });

    it('should handle negative limit parameter', async () => {
        const res = await request(app).get('/api/particles?limit=-5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1); // Should default to minimum 1
    });

    it('should handle excessive limit parameter', async () => {
        const res = await request(app).get('/api/particles?limit=5000');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.limit).toBe(1000); // Should cap at 1000
    });

    it('should handle malformed page parameter', async () => {
        const res = await request(app).get('/api/particles?page=abc');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle negative page parameter', async () => {
        const res = await request(app).get('/api/particles?page=-1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1); // Should default to 1
    });

    it('should handle page beyond available data', async () => {
        const res = await request(app).get('/api/particles?page=999&limit=1');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle empty string filters', async () => {
        const res = await request(app).get('/api/particles?sample_code=');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should return all particles
    });

    it('should handle multiple query parameters with same key', async () => {
        const res = await request(app).get('/api/particles?volc_num=211020&volc_num=263280');
        
        expect(res.statusCode).toBe(200);
        // Should use the last value
    });

    it('should handle unknown query parameters', async () => {
        const res = await request(app).get('/api/particles?unknown_param=test');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Should ignore unknown params
    });

    it('should handle special characters in search', async () => {
        const res = await request(app).get('/api/particles?imgURL=Test%20Particle%20$pecial');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
    });

    it('should handle numeric fields as strings', async () => {
        const res = await request(app).get('/api/particles?volc_num=211020');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.volc_num === 211020)).toBe(true);
    });

    it('should handle exact match fields correctly', async () => {
        const res = await request(app).get('/api/particles?color=transparent');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].color).toBe('transparent');
    });

    it('should handle text search fields with regex', async () => {
        const res = await request(app).get('/api/particles?instrument=VH');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.instrument.includes('VH'))).toBe(true);
    });

    it('should handle combined pagination and offset', async () => {
        const res = await request(app).get('/api/particles?limit=1&page=2&offset=1');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination.page).toBe(2);
    });

    it('should handle numeric range filters', async () => {
        const res = await request(app).get('/api/particles?magnification=200');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(p => p.magnification === 200)).toBe(true);
    });

    it('should handle boolean field filtering', async () => {
        const res = await request(app).get('/api/particles?multi_focus=true');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].multi_focus).toBe(true);
    });

    it('should handle invalid main_type gracefully', async () => {
        const res = await request(app).get('/api/particles?main_type=nonexistent_type');
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Bad Request');
    });

    it('should handle database connection errors', async () => {
        const spy = jest.spyOn(Particle, 'find').mockImplementation(() => {
            throw new Error('Connection refused');
        });

        const res = await request(app).get('/api/particles');
        
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
        
        spy.mockRestore();
    });
});