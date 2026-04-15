const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('STAC API Endpoints - Particle-Centric Architecture', () => {
  
  let sampleCollectionId;
  let particleItemId;

  beforeAll(async () => {
    // Get a sample collection ID for testing
    const collections = await request(app).get('/collections');
    if (collections.body.collections && collections.body.collections.length > 0) {
      sampleCollectionId = collections.body.collections[0].id;
      
      // Get a particle item ID for testing
      const items = await request(app).get(`/collections/${sampleCollectionId}/items?limit=1`);
      if (items.body.features && items.body.features.length > 0) {
        particleItemId = items.body.features[0].id;
      }
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /', () => {
    it('should return landing page (Catalog)', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.stac_version).toBe('1.0.0');
      expect(res.body.type).toBe('Catalog');
      expect(res.body.id).toBe('volcashdb-stac');
      expect(res.body.description).toContain('sample collections');
    });

    it('should include conformance declarations', async () => {
      const res = await request(app).get('/');
      expect(res.body.conformsTo).toContain('https://api.stacspec.org/v1.0.0/core');
      expect(res.body.conformsTo).toContain('https://api.stacspec.org/v1.0.0/collections');
    });
  });

  describe('GET /conformance', () => {
    it('should return conformance classes', async () => {
      const res = await request(app).get('/conformance');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.conformsTo)).toBe(true);
      expect(res.body.conformsTo).toContain('https://api.stacspec.org/v1.0.0/core');
    });
  });

  describe('GET /collections', () => {
    it('should return 22 collections (samples)', async () => {
      const res = await request(app).get('/collections');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.collections)).toBe(true);
      expect(res.body.collections.length).toBe(22);
    });

    it('should return collections with required fields', async () => {
      const res = await request(app).get('/collections');
      const collection = res.body.collections[0];
      expect(collection.type).toBe('Collection');
      expect(collection.id).toBeDefined();
      expect(collection.stac_version).toBe('1.0.0');
      expect(collection.extent).toBeDefined();
      expect(collection.extent.spatial).toBeDefined();
      expect(collection.extent.temporal).toBeDefined();
      expect(collection.license).toBeDefined();
    });

    it('should include scientific extension', async () => {
      const res = await request(app).get('/collections');
      const collection = res.body.collections[0];
      expect(collection.stac_extensions).toContain('https://stac-extensions.github.io/scientific/v1.0.0/schema.json');
      expect(collection['sci:doi']).toBeDefined();
    });

    it('should include custom volcash properties', async () => {
      const res = await request(app).get('/collections');
      const collection = res.body.collections[0];
      expect(collection['volcash:particle_count']).toBeDefined();
      expect(collection['volcash:volcano_number']).toBeDefined();
    });
  });

  describe('GET /collections/:collectionId', () => {
    it('should return a specific collection', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(sampleCollectionId);
      expect(res.body.type).toBe('Collection');
    });

    it('should return 404 for non-existent collection', async () => {
      const res = await request(app).get('/collections/non-existent-id');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /collections/:collectionId/items', () => {
    it('should return particle items as FeatureCollection', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items`);
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
      expect(Array.isArray(res.body.features)).toBe(true);
    });

    it('should include context with pagination info', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=10`);
      expect(res.body.context).toBeDefined();
      expect(res.body.context.returned).toBeDefined();
      expect(res.body.context.limit).toBe(10);
      expect(res.body.context.matched).toBeDefined();
    });

    it('should support pagination with limit parameter', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=5`);
      expect(res.body.features.length).toBeLessThanOrEqual(5);
    });

    it('should return particle items with required fields', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=1`);
      const item = res.body.features[0];
      expect(item.type).toBe('Feature');
      expect(item.id).toBeDefined();
      expect(item.geometry).toBeDefined();
      expect(item.properties).toBeDefined();
      expect(item.properties.datetime).toBeDefined();
      expect(item.assets).toBeDefined();
      expect(item.links).toBeDefined();
    });

    it('should include volcash:main_type as object', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=1`);
      const item = res.body.features[0];
      expect(item.properties['volcash:main_type']).toBeDefined();
      expect(typeof item.properties['volcash:main_type']).toBe('object');
      expect(item.properties['volcash:main_type'].juvenile).toBeDefined();
    });

    it('should include image asset', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=1`);
      const item = res.body.features[0];
      expect(item.assets.image).toBeDefined();
      expect(item.assets.image.href).toContain('.png');
      expect(item.assets.image.type).toBe('image/png');
    });
  });

  describe('GET /collections/:collectionId/items/:itemId', () => {
    it('should return a specific particle item', async () => {
      if (!sampleCollectionId || !particleItemId) {
        console.warn('Skipping: no particle item found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items/${particleItemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('Feature');
      expect(res.body.id).toBe(particleItemId);
    });

    it('should return 404 for non-existent item', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }
      
      const res = await request(app).get(`/collections/${sampleCollectionId}/items/non-existent-id`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('POST /search', () => {
    it('should search items across collections', async () => {
      const res = await request(app)
        .post('/search')
        .send({ limit: 10 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
      expect(Array.isArray(res.body.features)).toBe(true);
      expect(res.body.context).toBeDefined();
      expect(res.body.context.returned).toBeDefined();
      expect(res.body.context.matched).toBeDefined();
    });

    it('should filter by bbox', async () => {
      const res = await request(app)
        .post('/search')
        .send({ 
          bbox: [-125, 45, -120, 48],
          limit: 10
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
    });

    it('should filter by collections', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }

      const res = await request(app)
        .post('/search')
        .send({ 
          collections: [sampleCollectionId],
          limit: 10
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
      if (res.body.features.length > 0) {
        expect(res.body.features[0].collection).toBe(sampleCollectionId);
      }
    });

    it('should filter by datetime range', async () => {
      const res = await request(app)
        .post('/search')
        .send({ 
          datetime: '1980-01-01T00:00:00Z/2020-12-31T23:59:59Z',
          limit: 10
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .post('/search')
        .send({ 
          limit: 5,
          page: 1
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.features.length).toBeLessThanOrEqual(5);
      expect(res.body.context.limit).toBe(5);
    });

    it('should return 400 for invalid bbox', async () => {
      const res = await request(app)
        .post('/search')
        .send({ bbox: [1, 2] }); // Invalid bbox (needs 4 coordinates)
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /search', () => {
    it('should search items with query parameters', async () => {
      const res = await request(app)
        .get('/search?limit=10');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
    });

    it('should filter by bbox via query string', async () => {
      const res = await request(app)
        .get('/search?bbox=-125,45,-120,48&limit=10');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
    });

    it('should filter by collections via query string', async () => {
      if (!sampleCollectionId) {
        console.warn('Skipping: no sample collection found');
        return;
      }

      const res = await request(app)
        .get(`/search?collections=${sampleCollectionId}&limit=10`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.type).toBe('FeatureCollection');
    });
  });

  describe('Scientific Extension Validation (v1.0.0)', () => {
    describe('Collection Level', () => {
      it('should declare scientific extension in stac_extensions', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.stac_extensions).toBeDefined();
        expect(res.body.stac_extensions).toContain('https://stac-extensions.github.io/scientific/v1.0.0/schema.json');
      });

      it('should have sci:doi property', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body['sci:doi']).toBeDefined();
        expect(typeof res.body['sci:doi']).toBe('string');
        expect(res.body['sci:doi']).toBe('10.18715/ipgp.2024.lx32oxw9');
      });

      it('should have sci:citation property', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body['sci:citation']).toBeDefined();
        expect(typeof res.body['sci:citation']).toBe('string');
        expect(res.body['sci:citation']).toContain('Version 0.1 of Dataset published 2024');
      });

      it('should have sci:publications property as array', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body['sci:publications']).toBeDefined();
        expect(Array.isArray(res.body['sci:publications'])).toBe(true);
        expect(res.body['sci:publications'].length).toBeGreaterThan(0);
      });

      it('should have valid publication objects with doi and citation', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}`);
        expect(res.statusCode).toBe(200);
        
        const publications = res.body['sci:publications'];
        expect(publications).toBeDefined();
        
        publications.forEach(pub => {
          expect(pub.doi).toBeDefined();
          expect(typeof pub.doi).toBe('string');
          expect(pub.doi).toMatch(/^10\.\d+\//); // DOI format check
          
          expect(pub.citation).toBeDefined();
          expect(typeof pub.citation).toBe('string');
          expect(pub.citation.length).toBeGreaterThan(0);
        });
      });

      it('should have at least one of sci:doi, sci:citation, or sci:publications', async () => {
        const res = await request(app).get('/collections');
        expect(res.statusCode).toBe(200);
        
        res.body.collections.forEach(collection => {
          const hasDoi = collection['sci:doi'] !== undefined;
          const hasCitation = collection['sci:citation'] !== undefined;
          const hasPublications = collection['sci:publications'] !== undefined;
          
          expect(hasDoi || hasCitation || hasPublications).toBe(true);
        });
      });
    });

    describe('Item Level', () => {
      it('should declare scientific extension in stac_extensions', async () => {
        if (!sampleCollectionId || !particleItemId) {
          console.warn('Skipping: no particle item found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}/items/${particleItemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.stac_extensions).toBeDefined();
        expect(res.body.stac_extensions).toContain('https://stac-extensions.github.io/scientific/v1.0.0/schema.json');
      });

      it('should have sci:doi in properties', async () => {
        if (!sampleCollectionId || !particleItemId) {
          console.warn('Skipping: no particle item found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}/items/${particleItemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.properties).toBeDefined();
        expect(res.body.properties['sci:doi']).toBeDefined();
        expect(typeof res.body.properties['sci:doi']).toBe('string');
      });

      it('should have sci:citation in properties', async () => {
        if (!sampleCollectionId || !particleItemId) {
          console.warn('Skipping: no particle item found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}/items/${particleItemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.properties).toBeDefined();
        expect(res.body.properties['sci:citation']).toBeDefined();
        expect(typeof res.body.properties['sci:citation']).toBe('string');
      });

      it('should have sci:publications in properties', async () => {
        if (!sampleCollectionId || !particleItemId) {
          console.warn('Skipping: no particle item found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}/items/${particleItemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.properties).toBeDefined();
        expect(res.body.properties['sci:publications']).toBeDefined();
        expect(Array.isArray(res.body.properties['sci:publications'])).toBe(true);
      });

      it('should inherit scientific properties from collection', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const collectionRes = await request(app).get(`/collections/${sampleCollectionId}`);
        const itemsRes = await request(app).get(`/collections/${sampleCollectionId}/items?limit=1`);
        
        if (itemsRes.body.features.length === 0) {
          console.warn('Skipping: no items in collection');
          return;
        }
        
        const collection = collectionRes.body;
        const item = itemsRes.body.features[0];
        
        expect(item.properties['sci:doi']).toBe(collection['sci:doi']);
        expect(item.properties['sci:citation']).toBe(collection['sci:citation']);
        expect(item.properties['sci:publications']).toEqual(collection['sci:publications']);
      });

      it('all items should have required datetime property', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=10`);
        expect(res.statusCode).toBe(200);
        
        res.body.features.forEach(item => {
          expect(item.properties).toBeDefined();
          expect(item.properties.datetime).toBeDefined();
        });
      });
    });

    describe('Extension Compliance', () => {
      it('should validate extension URL format', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}`);
        const scientificExtension = res.body.stac_extensions.find(ext => 
          ext.includes('scientific')
        );
        
        expect(scientificExtension).toBeDefined();
        expect(scientificExtension).toMatch(/^https:\/\//);
        expect(scientificExtension).toContain('v1.0.0');
        expect(scientificExtension).toContain('schema.json');
      });

      it('should have consistent extension across all collections', async () => {
        const res = await request(app).get('/collections');
        expect(res.statusCode).toBe(200);
        
        const scientificExtensionUrl = 'https://stac-extensions.github.io/scientific/v1.0.0/schema.json';
        
        res.body.collections.forEach(collection => {
          expect(collection.stac_extensions).toContain(scientificExtensionUrl);
        });
      });

      it('should have consistent extension across all items in a collection', async () => {
        if (!sampleCollectionId) {
          console.warn('Skipping: no sample collection found');
          return;
        }
        
        const res = await request(app).get(`/collections/${sampleCollectionId}/items?limit=10`);
        expect(res.statusCode).toBe(200);
        
        const scientificExtensionUrl = 'https://stac-extensions.github.io/scientific/v1.0.0/schema.json';
        
        res.body.features.forEach(item => {
          expect(item.stac_extensions).toContain(scientificExtensionUrl);
        });
      });
    });
  });
});