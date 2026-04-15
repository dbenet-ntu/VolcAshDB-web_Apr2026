const { Sample } = require('../models/sample');
const { Particle } = require('../models/particle');
const { buildParticleItem } = require('../utils/stacBuilder');
const { isValidBbox } = require('../utils/geoUtils');

/**
 * STAC Search endpoint (POST /search)
 * Cross-collection search with filters for bbox, datetime, collections, etc.
 * Follows STAC API - Item Search specification
 * @route POST /search
 */
const searchItems = async (req, res) => {
  try {
    const {
      bbox,
      datetime,
      collections,
      limit,
      max_items, // PySTAC Client uses max_items
      page = 1,
      ids,
      intersects
    } = req.body;

    // Use max_items if provided (PySTAC Client), otherwise limit (STAC spec), default 100
    const requestedLimit = max_items || limit || 100;
    const itemLimit = Math.min(Math.max(1, Number.parseInt(requestedLimit, 10)), 1000);
    const pageNum = Math.max(1, Number.parseInt(page, 10));
    const skip = (pageNum - 1) * itemLimit;

    // Build MongoDB query for samples
    const sampleQuery = { sample_nat: 1 };

    // Filter by collection IDs (sample codes)
    if (collections && Array.isArray(collections) && collections.length > 0) {
      sampleQuery.sample_code = { $in: collections };
    }

    // Filter by bounding box
    let bboxFilter = null;
    if (bbox) {
      if (!isValidBbox(bbox)) {
        return res.status(400).json({
          code: 'InvalidBbox',
          description: 'Bounding box must be [minLon, minLat, maxLon, maxLat] with valid coordinates'
        });
      }

      const [minLon, minLat, maxLon, maxLat] = bbox;
      
      // Store bbox for later filtering since coordinates are strings
      bboxFilter = { minLon, minLat, maxLon, maxLat };
    }

    // Filter by geometry intersection (GeoJSON)
    let intersectsFilter = null;
    if (intersects && intersects.type && intersects.coordinates) {
      // Store intersects for later filtering since coordinates are strings
      intersectsFilter = intersects;
    }

    // Filter by datetime
    if (datetime) {
      const dateQuery = parseDatetime(datetime);
      if (dateQuery) {
        sampleQuery.sample_date = dateQuery;
      }
    }

    // Find matching samples
    let samples = await Sample.find(sampleQuery).lean();
    
    // Filter by bbox if specified (coordinates are stored as strings, need JS filtering)
    if (bboxFilter) {
      samples = samples.filter(sample => {
        const lon = parseFloat(sample.sample_lon);
        const lat = parseFloat(sample.sample_lat);
        return !isNaN(lon) && !isNaN(lat) &&
               lon >= bboxFilter.minLon && lon <= bboxFilter.maxLon &&
               lat >= bboxFilter.minLat && lat <= bboxFilter.maxLat;
      });
    }
    
    // Filter by intersects if specified
    if (intersectsFilter) {
      samples = samples.filter(sample => {
        const lon = parseFloat(sample.sample_lon);
        const lat = parseFloat(sample.sample_lat);
        if (isNaN(lon) || isNaN(lat)) return false;
        
        if (intersectsFilter.type === 'Point') {
          const [targetLon, targetLat] = intersectsFilter.coordinates;
          const buffer = 0.1; // ~10km buffer
          return Math.abs(lon - targetLon) <= buffer && Math.abs(lat - targetLat) <= buffer;
        } else if (intersectsFilter.type === 'Polygon') {
          // Get bounding box from polygon
          const coords = intersectsFilter.coordinates[0];
          const lons = coords.map(c => c[0]);
          const lats = coords.map(c => c[1]);
          return lon >= Math.min(...lons) && lon <= Math.max(...lons) &&
                 lat >= Math.min(...lats) && lat <= Math.max(...lats);
        }
        return false;
      });
    }
    
    if (samples.length === 0) {
      return res.json({
        type: "FeatureCollection",
        stac_version: "1.0.0",
        features: [],
        links: [
          {
            rel: "self",
            type: "application/geo+json",
            href: `${process.env.BASE_URL}/search`,
            method: "POST",
            body: req.body
          },
          {
            rel: "root",
            type: "application/json",
            href: `${process.env.BASE_URL}/`
          }
        ],
        context: {
          returned: 0,
          limit: itemLimit,
          matched: 0
        }
      });
    }

    const sampleCodes = samples.map(s => s.sample_code);

    // Build particle query
    const particleQuery = {
      sample_code: { $in: sampleCodes },
      faulty_image: { $ne: true }
    };

    // Filter by specific item IDs
    if (ids && Array.isArray(ids) && ids.length > 0) {
      particleQuery.imgURL = { 
        $in: ids.map(id => id.includes('.png') ? id : `${id}.png`)
      };
    }

    // Count total matching particles
    const totalCount = await Particle.countDocuments(particleQuery);

    // Get paginated particles
    const particles = await Particle.find(particleQuery)
      .sort({ sample_code: 1, imgURL: 1 })
      .skip(skip)
      .limit(itemLimit)
      .lean();

    // Build STAC Items
    const features = [];
    for (const particle of particles) {
      const sample = samples.find(s => s.sample_code === particle.sample_code);
      if (sample) {
        try {
          const item = buildParticleItem(particle, sample);
          features.push(item);
        } catch (error) {
          console.error(`Error building item for particle ${particle.imgURL}:`, error.message);
        }
      }
    }

    // Build links
    const baseUrl = process.env.BASE_URL || 'http://localhost:5004';
    const links = [
      {
        rel: "self",
        type: "application/geo+json",
        href: `${baseUrl}/search`,
        method: "POST",
        body: req.body
      },
      {
        rel: "root",
        type: "application/json",
        href: `${baseUrl}/`
      }
    ];

    // Add pagination links
    if (totalCount > skip + itemLimit) {
      links.push({
        rel: "next",
        type: "application/geo+json",
        href: `${baseUrl}/search`,
        method: "POST",
        body: { ...req.body, page: pageNum + 1 }
      });
    }

    if (pageNum > 1) {
      links.push({
        rel: "prev",
        type: "application/geo+json",
        href: `${baseUrl}/search`,
        method: "POST",
        body: { ...req.body, page: pageNum - 1 }
      });
    }

    // Return FeatureCollection
    res.json({
      type: "FeatureCollection",
      stac_version: "1.0.0",
      features,
      links,
      context: {
        returned: features.length,
        limit: itemLimit,
        matched: totalCount
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      code: 'InternalServerError',
      description: error.message
    });
  }
};

/**
 * STAC Search endpoint (GET /search)
 * Query parameter version of search
 * @route GET /search
 */
const searchItemsGet = async (req, res) => {
  try {
    // Convert GET query parameters to POST body format
    const body = {};

    if (req.query.bbox) {
      body.bbox = req.query.bbox.split(',').map(Number);
    }

    if (req.query.datetime) {
      body.datetime = req.query.datetime;
    }

    if (req.query.collections) {
      body.collections = req.query.collections.split(',');
    }

    if (req.query.ids) {
      body.ids = req.query.ids.split(',');
    }

    if (req.query.limit) {
      body.limit = Number.parseInt(req.query.limit, 10);
    }

    // PySTAC Client uses max_items
    if (req.query.max_items) {
      body.max_items = Number.parseInt(req.query.max_items, 10);
    }

    if (req.query.page) {
      body.page = Number.parseInt(req.query.page, 10);
    }

    // Reuse POST search logic
    req.body = body;
    return searchItems(req, res);

  } catch (error) {
    console.error('Search GET error:', error);
    res.status(500).json({
      code: 'InternalServerError',
      description: error.message
    });
  }
};

/**
 * Parse datetime parameter into MongoDB query
 * Supports:
 * - Single datetime: "2018-02-12T00:00:00Z"
 * - Range: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
 * - Open start: "../2018-03-18T12:31:12Z"
 * - Open end: "2018-02-12T00:00:00Z/.."
 * @param {string} datetime - Datetime string
 * @returns {Object|null} MongoDB date query
 */
function parseDatetime(datetime) {
  if (!datetime) return null;

  try {
    // Range with separator "/"
    if (datetime.includes('/')) {
      const [start, end] = datetime.split('/');
      const query = {};

      if (start && start !== '..') {
        query.$gte = new Date(start);
      }

      if (end && end !== '..') {
        query.$lte = new Date(end);
      }

      return Object.keys(query).length > 0 ? query : null;
    }

    // Single datetime
    return new Date(datetime);

  } catch (error) {
    console.error('Invalid datetime format:', datetime);
    return null;
  }
}

module.exports = {
  searchItems,
  searchItemsGet
};
