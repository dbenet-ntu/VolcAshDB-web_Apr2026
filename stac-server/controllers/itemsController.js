const { Sample } = require('../models/sample');
const { Particle } = require('../models/particle');
const { buildParticleItem } = require('../utils/stacBuilder');

/**
 * Get all items in a collection (= all particles in a sample)
 * Endpoint: GET /collections/:collectionId/items?limit=100&page=1
 */
const getItems = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { limit = 100, page = 1 } = req.query;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5004';
    
    const limitNum = Math.min(Number.parseInt(limit, 10), 1000); // Max 1000 items per page
    const pageNum = Math.max(Number.parseInt(page, 10), 1);
    const skip = (pageNum - 1) * limitNum;
    
    // Vérifier que la collection (sample) existe
    const sample = await Sample.findOne({ 
      sample_code: collectionId,
      sample_nat: true 
    });
    
    if (!sample) {
      return res.status(404).json({ 
        error: "Collection not found",
        message: `No collection found with id '${collectionId}'`
      });
    }
    
    // Compter le total de particles
    const totalCount = await Particle.countDocuments({
      sample_code: collectionId,
      faulty_image: { $ne: true }
    });
    
    // Récupérer les particles avec pagination
    const particles = await Particle.find({ 
      sample_code: collectionId,
      faulty_image: { $ne: true }
    })
    .skip(skip)
    .limit(limitNum)
    .sort({ id: 1 });
    
    // Construire les Items STAC
    const features = particles.map(particle => buildParticleItem(particle, sample));
    
    // Construire les liens de pagination
    const links = [
      {
        rel: "self",
        type: "application/geo+json",
        href: `${baseUrl}/collections/${collectionId}/items?limit=${limitNum}&page=${pageNum}`
      },
      {
        rel: "root",
        type: "application/json",
        href: `${baseUrl}/`
      },
      {
        rel: "parent",
        type: "application/json",
        href: `${baseUrl}/collections/${collectionId}`
      },
      {
        rel: "collection",
        type: "application/json",
        href: `${baseUrl}/collections/${collectionId}`
      }
    ];
    
    // Lien "next" si il y a d'autres pages
    if (skip + limitNum < totalCount) {
      links.push({
        rel: "next",
        type: "application/geo+json",
        href: `${baseUrl}/collections/${collectionId}/items?limit=${limitNum}&page=${pageNum + 1}`
      });
    }
    
    // Lien "prev" si on n'est pas sur la première page
    if (pageNum > 1) {
      links.push({
        rel: "prev",
        type: "application/geo+json",
        href: `${baseUrl}/collections/${collectionId}/items?limit=${limitNum}&page=${pageNum - 1}`
      });
    }
    
    res.json({
      type: "FeatureCollection",
      stac_version: "1.0.0",
      stac_extensions: [],
      context: {
        returned: features.length,
        limit: limitNum,
        matched: totalCount
      },
      numberMatched: totalCount,
      numberReturned: features.length,
      features,
      links
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ 
      error: "Failed to fetch items",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single item (= a specific particle)
 * Endpoint: GET /collections/:collectionId/items/:itemId
 */
const getItem = async (req, res) => {
  try {
    const { collectionId, itemId } = req.params;
    
    // Vérifier que la collection (sample) existe
    const sample = await Sample.findOne({ 
      sample_code: collectionId,
      sample_nat: true 
    });
    
    if (!sample) {
      return res.status(404).json({ 
        error: "Collection not found",
        message: `No collection found with id '${collectionId}'`
      });
    }
    
    // Trouver la particle par imgURL (sans extension) ou par ID
    const particle = await Particle.findOne({
      sample_code: collectionId,
      faulty_image: { $ne: true },
      $or: [
        { imgURL: { $regex: new RegExp(`^${itemId}`) } },
        { id: itemId }
      ]
    });
    
    if (!particle) {
      return res.status(404).json({ 
        error: "Item not found",
        message: `No particle found with id '${itemId}' in collection '${collectionId}'`
      });
    }
    
    const stacItem = buildParticleItem(particle, sample);
    res.json(stacItem);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ 
      error: "Failed to fetch item",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getItems, getItem };
