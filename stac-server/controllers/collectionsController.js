const { Sample } = require('../models/sample');
const { buildStacCollection } = require('../utils/stacBuilder');

/**
 * Get all collections (= all samples)
 * Endpoint: GET /collections
 */
const getCollections = async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5004';
    
    // Récupérer tous les samples naturels
    const samples = await Sample.find({ sample_nat: true }).sort({ sample_date: -1 });
    
    // Construire les collections STAC
    const collections = await Promise.all(
      samples.map(sample => buildStacCollection(sample))
    );
    
    res.json({
      collections,
      links: [
        {
          rel: "self",
          type: "application/json",
          href: `${baseUrl}/collections`
        },
        {
          rel: "root",
          type: "application/json",
          href: `${baseUrl}/`
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ 
      error: "Failed to fetch collections",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a specific collection (= a specific sample)
 * Endpoint: GET /collections/:collectionId
 */
const getCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    
    // collectionId = sample_code
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
    
    const collection = await buildStacCollection(sample);
    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ 
      error: "Failed to fetch collection",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getCollections, getCollection };
