# VolcAshDB STAC API Server

STAC (SpatioTemporal Asset Catalog) API server for the VolcAshDB volcanic ash database, providing standardized access to 22 natural volcanic ash samples with ~11,808 particle images according to OGC standards.

## Overview

**Architecture:** Particle-Centric
- **22 Collections** - Each natural sample is a STAC Collection
- **~11,808 Items** - Each particle is a STAC Item (GeoJSON Feature)
- **STAC Version:** 1.0.0
- **Extensions:** Scientific v1.0.0
- **Port:** 5004 (default)
- **Database:** VolcAshDB-STAC (MongoDB Atlas)

### What's a Particle-Centric Architecture?

Instead of having one collection with 22 sample items, we have:
- **22 Collections**: Each sample becomes a STAC Collection
- **~11,808 Items**: Each particle becomes a STAC Item (searchable, filterable)
- **Benefits**: Every particle is individually addressable and can be queried with STAC-compliant tools

### STAC Hierarchy

```
Catalog (Root)
  │
  ├─ Collection: STH-12post-DB1_1 (Mt St Helens, 1980-05-18)
  │   ├─ Item: particle_63 (juvenile, vitric)
  │   ├─ Item: particle_36 (juvenile, vitric)
  │   └─ ... (~251 particles total)
  │
  ├─ Collection: LAP-2-DB1_1 (Laacher See, Germany)
  │   ├─ Item: particle_1 (free crystal)
  │   ├─ Item: particle_2 (juvenile)
  │   └─ ... (~1074 particles total)
  │
  └─ ... (20 other natural samples)
```

### Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Infrastructure                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Front-end (React)      Existing API (Express)          │
│  Port: 5002             Port: 5002                      │
│  volcashdb.ipgp.fr      volcashdb.ipgp.fr/api          │
│                                                          │
│                                                          │
│               STAC API Server (This Service)            │
│               Port: 5004                                │
│               volcashdb.ipgp.fr/stac                   │
│               (Node.js/Express)                         │
│                                                          │
│  STAC STRUCTURE:                                        │
│  ┌──────────────────────────────────────────┐          │
│  │ Catalog: "volcashdb-stac"                │          │
│  │   └─ Collections (22): One per sample   │          │
│  │       ├─ Collection: "STH-12post-DB1_1" │          │
│  │       │   ├─ Item: particle_63          │          │
│  │       │   ├─ Item: particle_36          │          │
│  │       │   └─ ... (~251 particles)       │          │
│  │       ├─ Collection: "LAP-2-DB1_1"      │          │
│  │       │   └─ ... (~1074 particles)      │          │
│  │       └─ ... (20 other collections)     │          │
│  └──────────────────────────────────────────┘          │
│                     ↓                                    │
│          MongoDB Atlas (VolcAshDB-STAC)                 │
│          - samples collection (22 natural samples)      │
│          - particles collection (~11,808 particles)     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Why Particle-Centric?

**Advantages:**

1. **Granular Search** - Filter and query individual particles by type, morphology, texture
2. **STAC Compliance** - Each particle image becomes a standard STAC asset
3. **Tool Integration** - Works seamlessly with STAC Browser, PySTAC Client, QGIS STAC plugin
4. **Spatial Analysis** - Each particle inherits geolocation from its parent sample
5. **Scalability** - Easy to add new samples and particles over time
6. **Scientific Workflow** - Matches how researchers analyze volcanic ash (particle by particle)

**Use Cases:**

- Search all juvenile particles across multiple eruptions
- Find particles with specific morphological characteristics
- Analyze spatial distribution of particle types
- Download particle images for machine learning training
- Cross-reference particles with scientific publications

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas connection (credentials required)
- Access to existing VolcAshDB backend models

### Installation & First Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MongoDB Atlas connection:**
   ```bash
   # Edit .env and add your MongoDB Atlas credentials
   nano .env
   # Set ATLAS_URI with your credentials
   ```

3. **Create MongoDB Indexes (IMPORTANT - Run once):**
   ```bash
   node scripts/create-indexes.js
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Verify it's working:**
   ```bash
   curl http://localhost:5004/health
   curl http://localhost:5004/ | jq
   ```

### Quick Test Queries

```bash
# Get all 22 collections (samples)
curl http://localhost:5004/collections | jq '.collections | length'

# Get a specific collection (sample) with summaries
curl http://localhost:5004/collections/STH-12post-DB1_1 | jq

# Get particles from a collection (with pagination)
curl "http://localhost:5004/collections/STH-12post-DB1_1/items?limit=5" | jq

# Get a specific particle
curl http://localhost:5004/collections/STH-12post-DB1_1/items/{particle_id} | jq

# Filter by bounding box (Pacific Northwest - Mt. St. Helens region)
curl "http://localhost:5004/collections/STH-12post-DB1_1/items?bbox=-125,45,-120,48" | jq

# Search across all collections (POST)
curl -X POST http://localhost:5004/search \
  -H "Content-Type: application/json" \
  -d '{"limit": 10, "collections": ["STH-12post-DB1_1"]}' | jq

# Search with GET (query parameters)
curl "http://localhost:5004/search?limit=10&bbox=-125,45,-120,48" | jq

# Search by datetime range
curl -X POST http://localhost:5004/search \
  -H "Content-Type: application/json" \
  -d '{"datetime": "1980-01-01T00:00:00Z/2020-12-31T23:59:59Z", "limit": 10}' | jq
```

## API Endpoints

### Core STAC Endpoints (Particle-Centric)

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /` | Catalog landing page | Catalog with 22 collections info |
| `GET /conformance` | Conformance classes | STAC 1.0.0 + OGC compliance |
| `GET /collections` | List all collections | 22 sample collections |
| `GET /collections/:collectionId` | Get collection detail | Sample metadata + extent + summaries |
| `GET /collections/:collectionId/items` | Get items (particles) | FeatureCollection with particles |
| `GET /collections/:collectionId/items/:itemId` | Single item (particle) | GeoJSON Feature (particle) |
| `POST /search` | Cross-collection search | FeatureCollection matching filters |
| `GET /search` | Cross-collection search (query params) | FeatureCollection matching filters |
| `GET /health` | Health check | Server status |

### STAC Search Endpoint

The `/search` endpoint enables cross-collection queries across all samples and particles, following the [STAC API - Item Search](https://github.com/radiantearth/stac-api-spec/tree/main/item-search) specification.

**Supported Methods:**
- `POST /search` - Search with JSON body (recommended for complex queries)
- `GET /search` - Search with query parameters (simpler queries)

**Search Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `collections` | array | Filter by collection IDs (sample codes) | `["STH-12post-DB1_1", "LAP-2-DB1_1"]` |
| `bbox` | array | Spatial filter [minLon, minLat, maxLon, maxLat] | `[-125, 45, -120, 48]` |
| `datetime` | string | Temporal filter (ISO 8601) | `"1980-05-18T00:00:00Z/2020-12-31T23:59:59Z"` |
| `limit` | integer | Max items per page (default: 100, max: 1000) | `50` |
| `page` | integer | Page number (default: 1) | `2` |
| `ids` | array | Filter by specific item IDs | `["particle_id_1", "particle_id_2"]` |
| `intersects` | GeoJSON | Spatial filter with GeoJSON geometry | `{"type": "Point", "coordinates": [-122, 46]}` |

**POST /search Example:**
```bash
curl -X POST https://volcashdb.ipgp.fr/stac/search \
  -H "Content-Type: application/json" \
  -d '{
    "collections": ["STH-12post-DB1_1"],
    "bbox": [-125, 45, -120, 48],
    "limit": 10
  }'
```

**GET /search Example:**
```bash
curl "https://volcashdb.ipgp.fr/stac/search?collections=STH-12post-DB1_1&bbox=-125,45,-120,48&limit=10"
```

### Query Parameters (Collection Items)

- **limit**: Max items per page (default: 100, max: 1000)
- **page**: Page number for pagination (default: 1)
- **bbox**: Spatial filter `minLon,minLat,maxLon,maxLat`

### Response Format Examples

#### Collection Response (Sample)

```json
{
  "id": "STH-12post-DB1_1",
  "type": "Collection",
  "stac_version": "1.0.0",
  "title": "Mount St. Helens 1980 Eruption - Sample STH-12post-DB1_1",
  "description": "Natural volcanic ash sample from Mount St. Helens eruption",
  "license": "ODbL-1.0 AND CC-BY-4.0",
  "extent": {
    "spatial": {
      "bbox": [[-122.1944, 46.1914, -122.1944, 46.1914]]
    },
    "temporal": {
      "interval": [["1980-05-18T00:00:00Z", "1980-05-18T23:59:59Z"]]
    }
  },
  "summaries": {
    "volcash:particle_count": 251,
    "volcash:main_type": ["juvenile", "lithic"],
    "volcash:sub_type": ["vitric", "crystallo-vitric", "pumiceous"],
    "volcash:volcano_number": ["321050"],
    "volcash:volcano_name": ["St. Helens"],
    "volcash:sample_code": ["STH-12post-DB1_1"]
  },
  "stac_extensions": [
    "https://stac-extensions.github.io/scientific/v1.0.0/schema.json"
  ],
  "sci:doi": "10.1234/volcashdb.sample.STH-12post-DB1_1",
  "sci:publications": [
    {
      "doi": "10.1234/example",
      "citation": "Smith et al. (2020). Volcanic ash analysis."
    }
  ],
  "links": [
    {"rel": "self", "href": "http://localhost:5004/collections/STH-12post-DB1_1"},
    {"rel": "items", "href": "http://localhost:5004/collections/STH-12post-DB1_1/items"},
    {"rel": "parent", "href": "http://localhost:5004/"},
    {"rel": "root", "href": "http://localhost:5004/"}
  ]
}
```

#### Item Response (Particle)

```json
{
  "type": "Feature",
  "stac_version": "1.0.0",
  "id": "STH-12post-DB1_1_01_5_63",
  "collection": "STH-12post-DB1_1",
  "geometry": {
    "type": "Point",
    "coordinates": [-122.1944, 46.1914]
  },
  "properties": {
    "datetime": "1980-05-18T00:00:00Z",
    "volcash:main_type": {
      "juvenile": 100,
      "lithic": 0,
      "free crystal": 0,
      "altered material": 0
    },
    "volcash:sub_type": "vitric",
    "volcash:color": "#8B7355",
    "volcash:shape": "subrounded",
    "volcash:luster": "vitreous",
    "volcash:GS_phi": 2.5,
    "volcash:GS_mm": 0.177
  },
  "assets": {
    "image": {
      "href": "http://localhost:5002/images/particles/STH-12post-DB1_1_01_5_63.png",
      "type": "image/png",
      "title": "Particle Image",
      "roles": ["visual", "data"]
    },
    "metadata": {
      "href": "http://localhost:5002/api/particles/STH-12post-DB1_1_01_5_63",
      "type": "application/json",
      "title": "Full Particle Metadata"
    },
    "sample": {
      "href": "http://localhost:5002/api/samples/STH-12post-DB1_1",
      "type": "application/json",
      "title": "Parent Sample Metadata"
    }
  },
  "links": [
    {"rel": "self", "href": "http://localhost:5004/collections/STH-12post-DB1_1/items/STH-12post-DB1_1_01_5_63"},
    {"rel": "collection", "href": "http://localhost:5004/collections/STH-12post-DB1_1"},
    {"rel": "parent", "href": "http://localhost:5004/collections/STH-12post-DB1_1"},
    {"rel": "root", "href": "http://localhost:5004/"}
  ]
}
```

#### Items Collection Response (with Pagination)

```json
{
  "type": "FeatureCollection",
  "stac_version": "1.0.0",
  "context": {
    "returned": 100,
    "limit": 100,
    "matched": 251
  },
  "features": [
    {
      "type": "Feature",
      "id": "STH-12post-DB1_1_01_5_63",
      "...": "..."
    }
  ],
  "links": [
    {"rel": "self", "href": "http://localhost:5004/collections/STH-12post-DB1_1/items?page=1&limit=100"},
    {"rel": "next", "href": "http://localhost:5004/collections/STH-12post-DB1_1/items?page=2&limit=100"},
    {"rel": "root", "href": "http://localhost:5004/"},
    {"rel": "collection", "href": "http://localhost:5004/collections/STH-12post-DB1_1"}
  ]
}
```

### STAC Properties Reference

**Collections (Samples)** include:
- `volcash:particle_count` - Number of particles in sample
- `volcash:volcano_number`, `volcash:volcano_name` - Volcano metadata
- `volcash:sample_code` - Sample collection code
- `volcash:technique`, `volcash:collector`, `volcash:surface` - Sampling metadata
- `volcash:laboratory_procedure` - Lab processing information
- `sci:doi`, `sci:publications` - Scientific references
- Spatial extent (bbox) and temporal extent (sample date)
- **Summaries** - Statistical overview of all particles in the collection:
  - `volcash:particle_count` - Total particle count
  - `volcash:main_type` - Array of distinct main types found (e.g., ["juvenile", "lithic"])
  - `volcash:sub_type` - Array of distinct sub types found (e.g., ["vitric", "crystallo-vitric"])
  - `volcash:volcano_number`, `volcash:volcano_name`, `volcash:sample_code` - Constant values across items

**Items (Particles)** include:
- `volcash:main_type` - Classification as object (juvenile, lithic, free crystal, altered material percentages)
- `volcash:sub_type` - Sub-classification (e.g., vitric, crystallo-vitric)
- Morphology properties (hydro_alter_degre, roundness, sphericity, etc.)
- Texture properties (luster, edge, angularity, etc.)
- Optical properties (color_b, color_g, color_r, transparence)
- Grain size metrics (GS_min, GS_max, GS_phi, etc.)
- Assets: `image` (PNG), `metadata` (API), `sample` (parent)

## Project Structure

```
stac-server/
├── server.js                      # Main Express application
├── package.json                   # Dependencies and scripts
├── .env                          # Environment configuration
├── ecosystem.config.js           # PM2 configuration
├── config/
│   └── database.js              # MongoDB connection
├── controllers/                 # Request handlers
│   ├── landingController.js     # GET /
│   ├── conformanceController.js # GET /conformance
│   ├── collectionsController.js # GET /collections
│   ├── itemsController.js       # GET /collections/:id/items
│   └── imagesController.js      # Custom image endpoints
├── routes/
│   └── stac.js                  # Route definitions
├── utils/
│   ├── stacBuilder.js           # Transform models to STAC structures
│   └── geoUtils.js              # Geospatial utilities
├── models/                      # Symlinks to backend models
│   ├── sample.js -> ../../back-end/models/sample.js
│   └── particle.js -> ../../back-end/models/particle.js
├── scripts/
│   ├── create-indexes.js        # MongoDB index creation
│   ├── validate-stac.js         # STAC validation script
│   └── health-check.sh          # Health monitoring
└── tests/
    └── stac.test.js             # API tests (18 tests)
```

## Testing & Validation

### Run Tests

```bash
# Run all Jest tests (27 tests covering all endpoints)
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Coverage:**
- Core STAC endpoints (catalog, conformance, collections, items)
- STAC Search endpoint (POST and GET)
- Pagination and filtering (bbox, datetime, collections)
- Error handling (invalid bbox, missing resources)
- Response validation (STAC 1.0.0 compliance)

### Validate STAC Compliance

```bash
# Run STAC validation script
node scripts/validate-stac.js
```

Expected output:
```
✅ Catalog: VALID
✅ Collections: 3/3 sampled VALID
✅ Particles: 3/3 sampled VALID
🎉 All STAC resources are VALID!
```

### Validation Checks

The validation script verifies:
- ✅ STAC 1.0.0 structure (Catalog, Collections, Items)
- ✅ Required fields (id, type, geometry, properties, assets, links)
- ✅ Scientific extension properties (sci:doi, sci:publications)
- ✅ Custom volcash:* namespace properties
- ✅ volcash:main_type as object with percentages
- ✅ Image assets for particles
- ✅ Pagination links (next, prev)

## Integration with VolcAshDB

The STAC server is part of the complete VolcAshDB deployment with 4 services:

```
┌─────────────────────────────────────────────────────────┐
│           VolcAshDB Production Architecture             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  nginx (Port 443) - volcashdb.ipgp.fr                  │
│  ├─ /              → Frontend (5002)                   │
│  ├─ /api/          → Backend API (5001)                │
│  ├─ /stac/         → STAC API (5004) ← This service   │
│  ├─ /classifier/   → ML Classifier (5003)              │
│  ├─ /images/       → Static particle images            │
│  └─ /api-docs      → Swagger documentation             │
│                                                          │
│  All services managed by PM2                            │
│  └─ pm2 start ecosystem.config.js (from root)          │
│                                                          │
│  MongoDB Atlas                                          │
│  └─ VolcAshDB database (shared with backend)           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Service Dependencies

The STAC server:
- **Shares** MongoDB database with the backend API
- **Reuses** backend Mongoose models (sample.js, particle.js via symlinks)
- **Generates** asset URLs pointing to backend `/images/` and `/api/` endpoints
- **Runs independently** on port 5004, can be started/stopped without affecting other services

### Cross-Service Communication

STAC Items reference backend resources:

```json
{
  "assets": {
    "image": {
      "href": "https://volcashdb.ipgp.fr/images/particles/STH-12post-DB1_1_01_5_63.png"
    },
    "metadata": {
      "href": "https://volcashdb.ipgp.fr/api/particles/STH-12post-DB1_1_01_5_63"
    },
    "sample": {
      "href": "https://volcashdb.ipgp.fr/api/samples/STH-12post-DB1_1"
    }
  }
}
```

## Development

### Start Development Server

```bash
# Start with auto-reload (nodemon)
npm run dev

# Start production mode
npm start
```

### Development as Part of Full Stack

When developing alongside other VolcAshDB services:

```bash
# From main repository
cd /root/VolcAshDB_IPGP

# Start all services
pm2 start ecosystem.config.js

# Or start STAC only
pm2 start ecosystem.config.js --only volcashdb-stac

# Watch STAC logs
pm2 logs volcashdb-stac --lines 100
```

### Environment Variables

Edit `.env`:

**Development:**
```properties
# MongoDB Atlas connection
ATLAS_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/VolcAshDB

# Server configuration
STAC_PORT=5004
NODE_ENV=development
BASE_URL=http://localhost:5004
API_BASE_URL=http://localhost:5001/api
BACK_END_URL=https://localhost:5001
```

**Production:**
```properties
# MongoDB Atlas connection
ATLAS_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/VolcAshDB?retryWrites=true&w=majority

# Server configuration
STAC_PORT=5004
NODE_ENV=production
BASE_URL=https://volcashdb.ipgp.fr/stac
API_BASE_URL=https://volcashdb.ipgp.fr/api
BACK_END_URL=https://volcashdb.ipgp.fr/back-end
```

**Important Notes:**
- Production MongoDB URI should include database name and query parameters
- BASE_URL should match your nginx reverse proxy configuration
- API_BASE_URL is used to generate asset URLs in STAC Items
- BACK_END_URL is used to generate asset URL in STAC Items 

## Deployment

### Production Deployment (volcashdb.ipgp.fr)

The STAC server is deployed as part of the VolcAshDB production environment using PM2 and nginx reverse proxy.

**1. Start with PM2 (from main repository):**

```bash
# Navigate to main VolcAshDB directory
cd /root/VolcAshDB_IPGP

# Start all services including STAC
pm2 start ecosystem.config.js

# Or start only STAC service
pm2 start ecosystem.config.js --only volcashdb-stac

# View STAC logs
pm2 logs volcashdb-stac

# Restart after changes
pm2 restart volcashdb-stac

# Stop STAC service
pm2 stop volcashdb-stac
```

**2. Production nginx configuration:**

The STAC server is proxied through nginx at `/stac/` path:

```nginx
# STAC Geospatial API
location /stac/ {
    proxy_pass http://localhost:5004/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**3. Production URLs:**

- **STAC Catalog:** `https://volcashdb.ipgp.fr/stac/`
- **Collections:** `https://volcashdb.ipgp.fr/stac/collections`
- **Specific Collection:** `https://volcashdb.ipgp.fr/stac/collections/{sample_code}`
- **Collection Items:** `https://volcashdb.ipgp.fr/stac/collections/{sample_code}/items`
- **Health Check:** `https://volcashdb.ipgp.fr/stac/health`

**4. PM2 Configuration:**

The STAC server is configured in the main `ecosystem.config.js`:

```javascript
{
  name: 'volcashdb-stac',
  cwd: './stac-server',
  script: 'server.js',
  instances: 1,
  exec_mode: 'fork',
  watch: false,
  env: {
    NODE_ENV: 'development',
    PORT: 5004
  },
  env_production: {
    NODE_ENV: 'production',
    PORT: 5004
  },
  error_file: './logs/stac-error.log',
  out_file: './logs/stac-out.log',
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  merge_logs: true,
  autorestart: true,
  max_restarts: 10,
  min_uptime: '10s'
}
```

**5. Save PM2 configuration for persistence:**

```bash
# Save current PM2 process list
pm2 save

# Set up PM2 to start on system boot (if not already configured)
pm2 startup systemd -u root --hp /root
# Copy and execute the command it outputs
```

### Development Deployment

**Option 1: PM2 (from stac-server directory):**

```bash
# Start with local PM2 config
pm2 start ecosystem.config.js

# View logs
pm2 logs volcashdb-stac

# Restart after changes
pm2 restart volcashdb-stac

# Stop
pm2 stop volcashdb-stac
```

**Option 2: Docker:**

```bash
# Build image
docker build -t volcashdb-stac .

# Run container
docker run -p 5004:5004 --env-file .env volcashdb-stac
```

### Verification

After deployment, verify the STAC server is running:

```bash
# Check PM2 status
pm2 list

# Test health endpoint
curl -k https://volcashdb.ipgp.fr/stac/health

# Test catalog endpoint
curl -k https://volcashdb.ipgp.fr/stac/ | jq

# Test collections endpoint
curl -k https://volcashdb.ipgp.fr/stac/collections | jq '.collections | length'

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/volcashdb_access.log
```

Expected responses:
- Health: `{"status":"ok","timestamp":"..."}`
- Catalog: STAC Catalog JSON with links to collections
- Collections: Array with 22 collections (natural samples)

## Performance & Optimization

### MongoDB Indexes

Created by `scripts/create-indexes.js`:

**Samples Collection:**
- `idx_sample_code` - Unique index for fast lookups
- `idx_sample_nat` - Filter natural samples
- `idx_location_2dsphere` - Geospatial queries (bbox filtering)
- `idx_sample_date` - Temporal filtering
- `idx_volc_num` - Volcano joins

**Particles Collection:**
- `idx_particle_sample_code` - Sample lookups
- `idx_sample_faulty` - Valid image filtering (faulty_image ≠ true)
- `idx_imgURL` - Direct image access
- `idx_particle_type` - Type filtering

### Pagination

Default: 100 items per page
Maximum: 1000 items per page

Response includes:
```json
{
  "context": {
    "returned": 100,
    "limit": 100,
    "matched": 251
  },
  "links": [
    {"rel": "next", "href": "...?page=2"},
    {"rel": "prev", "href": "...?page=1"}
  ]
}
```

## STAC Compliance

### Conformance Classes

- ✅ `https://api.stacspec.org/v1.0.0/core`
- ✅ `https://api.stacspec.org/v1.0.0/collections`
- ✅ `https://api.stacspec.org/v1.0.0/ogcapi-features`
- ✅ `https://api.stacspec.org/v1.0.0/item-search` - Cross-collection search
- ✅ `http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core`
- ✅ `http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson`

### Extensions

#### Scientific Extension v1.0.0

Applied at the **Collection** level to provide scientific context:

- `sci:doi` - Digital Object Identifier for the sample
- `sci:citation` - Formatted citation for the dataset
- `sci:publications` - Array of related publications with DOIs

Example:
```json
{
  "sci:doi": "10.1234/volcashdb.sample.STH-12post-DB1_1",
  "sci:publications": [
    {
      "doi": "10.1234/example",
      "citation": "Smith et al. (2020). Analysis of volcanic ash particles."
    }
  ]
}
```

#### Custom Namespace: volcash:*

Domain-specific properties for volcanic ash characterization:

**Collection-level properties:**
- `volcash:particle_count` - Total number of particles in sample
- `volcash:volcano_number` - GVP (Global Volcanism Program) volcano number
- `volcash:volcano_name` - Name of source volcano
- `volcash:sample_code` - Code of sample collection
- `volcash:technique` - Technique used for sampling
- `volcash:collector` - Collector used for sampling
- `volcash:surface` - Surface where the sample has been collected
- `volcash:laboratory_procedure` - Procedure used in laboratory on the sample

**Collection summaries (statistical overview):**
- `volcash:particle_count` - Total particle count (integer)
- `volcash:main_type` - Array of distinct main particle types found in collection
- `volcash:sub_type` - Array of distinct sub-types found in collection
- `volcash:volcano_number`, `volcash:volcano_name`, `volcash:sample_code` - Constant metadata (arrays with single value)

**Item-level properties (Particles):**

*Classification:*
- `volcash:main_type` - Primary classification as percentages object:
  - `juvenile` - Fresh magmatic material (%)
  - `lithic` - Pre-existing rock fragments (%)
  - `free crystal` - Individual crystals (%)
  - `altered material` - Hydrothermally altered material (%)
- `volcash:sub_type` - Secondary classification (e.g., "vitric", "crystallo-vitric")
- `volcash:sample_code` - Code of sample collection
- `volcash:volcano_number` -  Code of source volcano
- `volcash:volcano_name` -  Name of source volcano

### GeoJSON Compliance

All items are valid GeoJSON Features:
```json
{
  "type": "Feature",
  "id": "particle-id",
  "collection": "sample-id",
  "geometry": {
    "type": "Point",
    "coordinates": [lat, lon]
  },
  "bbox": [lat lon, lat lon],
  "properties": {
    "datetime": "2012-05-18T00:00:00Z",
    "volcash:main_type": {
      "juvenile": 100,
      "lithic": 0,
      "free crystal": 0,
      "altered material": 0
    },
    "volcash:sub_type": "standard lithic",
    "volcash:sample_code": "sample-id",
    "volcash:volcano_number": "261140",
    "volcash:volcano_name": "Marapi"
  },
  "assets": {
    "image": {
      "href": "http://localhost:5001/images/particles/particle.png",
      "type": "image/png",
      "title": "Particle Microscope Image",
      "description": "High-resolution microscope image of volcanic ash particle",
      "roles": [
        "data",
        "visual"
      ]
    },
    "metadata": {
      "href": "http://localhost:5001/api/particles/particle.png",
      "type": "application/json",
      "title": "Complete Particle Metadata",
      "description": "Full morphological, textural, and optical analysis data",
      "roles": [
        "metadata"
      ]
    },
    "sample": {
      "href": "http://localhost:5001/api/samples/sample-id",
      "type": "application/json",
      "title": "Parent Sample Metadata",
      "description": "Complete metadata of the parent sample including eruption and volcano information",
      "roles": [
        "metadata"
      ]
    }
  }
}
```

## Data Model & Relationships

### MongoDB Collections

The STAC server relies on two main MongoDB collections from VolcAshDB:

**1. `samples` Collection**
- Represents volcanic ash samples collected from eruptions
- Each document becomes a STAC Collection
- Contains sample metadata, location, eruption date, volcano info
- Filtered to only include natural samples (`sample_nat === 1`)

**2. `particles` Collection**
- Represents individual ash particles analyzed from each sample
- Each document becomes a STAC Item (GeoJSON Feature)
- Contains particle images, classifications, morphology, texture data
- Filtered to exclude faulty images (`faulty_image !== true`)

### Relationships

```
Volcano (GVP Database)
    ↓
Eruption (VolcAshDB)
    ↓
Sample (STAC Collection)
    ├─ location: Point geometry
    ├─ date: Temporal extent
    ├─ metadata: Scientific properties
    └─ Particles (STAC Items)
        ├─ Particle 1: Image + properties
        ├─ Particle 2: Image + properties
        └─ Particle N: Image + properties
```

### Data Flow

```
MongoDB Atlas (VolcAshDB)
    ↓
Mongoose Models (sample.js, particle.js)
    ↓
STAC Controllers (collectionsController, itemsController)
    ↓
STAC Builders (stacBuilder.js)
    ↓
STAC-compliant JSON responses
    ↓
STAC Clients (PySTAC, QGIS, Browser)
```

### Key Transformations

**Sample → Collection:**
1. Sample code becomes Collection ID
2. Location becomes spatial extent (bbox)
3. Date becomes temporal extent
4. Particle count added to summaries
5. Scientific references added via sci:* extension

**Particle → Item:**
1. Particle ID becomes Feature ID
2. Parent sample location inherited as geometry
3. Image URL becomes asset
4. Classifications become volcash:* properties
5. Main type converted to percentage object

## Integration with STAC Ecosystem

### PySTAC Client

```python
from pystac_client import Client

# Connect to API
catalog = Client.open('http://localhost:5004/')

# Search collections
collections = list(catalog.get_collections())
print(f"Found {len(collections)} collections")

# Get items from a collection
collection = catalog.get_collection('STH-12post-DB1_1')
items = list(collection.get_items())
print(f"Found {len(items)} particles")
```

### STAC Browser

View in browser: [https://radiantearth.github.io/stac-browser/](https://radiantearth.github.io/stac-browser/#/external/localhost:5004)

## Production URLs

- **Development**: `http://localhost:5004`
- **Production**: `https://volcashdb.ipgp.fr/stac`

### Production Access

The STAC API is deployed and accessible at:

- **Catalog Landing:** `https://volcashdb.ipgp.fr/stac/`
- **Conformance:** `https://volcashdb.ipgp.fr/stac/conformance`
- **Collections List:** `https://volcashdb.ipgp.fr/stac/collections`
- **Single Collection:** `https://volcashdb.ipgp.fr/stac/collections/{sample_code}`
- **Collection Items:** `https://volcashdb.ipgp.fr/stac/collections/{sample_code}/items`
- **Single Item:** `https://volcashdb.ipgp.fr/stac/collections/{sample_code}/items/{particle_id}`
- **Search (POST):** `https://volcashdb.ipgp.fr/stac/search`
- **Search (GET):** `https://volcashdb.ipgp.fr/stac/search?{params}`
- **Health Check:** `https://volcashdb.ipgp.fr/stac/health`

### Example Production Queries

```bash
# Get catalog
curl -k https://volcashdb.ipgp.fr/stac/ | jq

# Get all collections (22 natural samples)
curl -k https://volcashdb.ipgp.fr/stac/collections | jq '.collections | length'

# Get Mt. St. Helens collection with summaries
curl -k https://volcashdb.ipgp.fr/stac/collections/STH-12post-DB1_1 | jq '.summaries'

# Get particles from Mt. St. Helens (first page)
curl -k "https://volcashdb.ipgp.fr/stac/collections/STH-12post-DB1_1/items?limit=10" | jq

# Filter by bounding box
curl -k "https://volcashdb.ipgp.fr/stac/collections/STH-12post-DB1_1/items?bbox=-125,45,-120,48" | jq

# Search across all collections (POST)
curl -k -X POST https://volcashdb.ipgp.fr/stac/search \
  -H "Content-Type: application/json" \
  -d '{"collections": ["STH-12post-DB1_1"], "limit": 10}' | jq

# Search with GET (query parameters)
curl -k "https://volcashdb.ipgp.fr/stac/search?limit=10&bbox=-125,45,-120,48" | jq

# Search by datetime range
curl -k -X POST https://volcashdb.ipgp.fr/stac/search \
  -H "Content-Type: application/json" \
  -d '{"datetime": "1980-05-01T00:00:00Z/1980-05-31T23:59:59Z", "limit": 10}' | jq

# Search for specific particle types across all samples
curl -k -X POST https://volcashdb.ipgp.fr/stac/search \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}' | jq '.features[] | select(.properties."volcash:main_type".juvenile > 50)'
```

## License

- **Database**: ODbL-1.0 + CC-BY-4.0
- **Code**: MIT

## 👥 Authors

VolcAshDB Team - IPGP, EOS, NTU

## Resources

- [STAC Specification](https://stacspec.org/)
- [STAC API Spec](https://github.com/radiantearth/stac-api-spec)
- [Scientific Extension](https://github.com/stac-extensions/scientific)
- [PySTAC Client](https://pystac-client.readthedocs.io/)
- [STAC Browser](https://github.com/radiantearth/stac-browser)

## Troubleshooting

### Server won't start

1. Check MongoDB connection:
   ```bash
   node scripts/list-databases.js
   ```

2. Verify indexes exist:
   ```bash
   node scripts/create-indexes.js
   ```

### Tests failing

```bash
# Check server is running
curl http://localhost:5004/health

# Run validation
node scripts/validate-stac.js
```

### Low performance

- Ensure MongoDB indexes are created (`scripts/create-indexes.js`)
- Check database connection latency
- Consider increasing pagination limit for batch operations
- Use bbox filtering to reduce result set size

## Status

✅ **Fully Operational**
- 27/27 tests passing
- STAC 1.0.0 compliant with Item Search extension
- Cross-collection search with POST and GET methods
- Collection summaries for particle statistics
- All endpoints validated
- Deployed in production at volcashdb.ipgp.fr
