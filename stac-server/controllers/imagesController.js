const { Particle } = require('../models/particle');

/**
 * Get particle images for a sample
 * Endpoint: GET /images/particles?sample_code=XXX
 */
const getParticleImages = async (req, res) => {
  try {
    const { sample_code, limit = 100 } = req.query;
    
    if (!sample_code) {
      return res.status(400).json({ 
        error: "Missing parameter",
        message: "sample_code query parameter is required" 
      });
    }
    
    const totalCount = await Particle.countDocuments({
      sample_code,
      faulty_image: { $ne: true }
    });
    
    const particles = await Particle.find({ 
      sample_code,
      faulty_image: { $ne: true }
    }).limit(Number.parseInt(limit));
    
    if (particles.length === 0) {
      return res.status(404).json({ 
        error: "No particles found",
        message: `No valid particle images found for sample '${sample_code}'`
      });
    }
    
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5001';
    
    const images = particles.map(p => ({
      particle_id: p.id,
      imgURL: p.imgURL,
      href: `${apiBaseUrl}/images/particles/${p.imgURL}`,
      main_type: p.main_type,
      sub_type: p.sub_type,
      volc_num: p.volc_num,
      volc_name: p.volc_name
    }));
    
    res.json({
      type: "ImageCollection",
      sample_code,
      total: totalCount,
      returned: images.length,
      images
    });
  } catch (error) {
    console.error('Error fetching particle images:', error);
    res.status(500).json({ 
      error: "Failed to fetch particle images",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getParticleImages };
