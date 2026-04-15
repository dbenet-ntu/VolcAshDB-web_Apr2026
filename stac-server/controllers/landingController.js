const { Sample } = require('../models/sample');
const { Particle } = require('../models/particle');

/**
 * Get the landing page (STAC Catalog root)
 * Endpoint: GET /
 */
const getLandingPage = async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5004';
    
    // Compter les collections (samples) et items (particles)
    const collectionCount = await Sample.countDocuments({ sample_nat: true });
    const itemCount = await Particle.countDocuments({ faulty_image: { $ne: true } });
    
    res.json({
      type: "Catalog",
      stac_version: "1.0.0",
      stac_extensions: [],
      id: "volcashdb-stac",
      title: "VolcAshDB STAC Catalog",
      description: `STAC API for the VolcAshDB volcanic ash database. This catalog provides access to ${collectionCount} sample collections, each containing volcanic ash particles as STAC Items. Total: ${itemCount} particles available.`,
      conformsTo: [
        "https://api.stacspec.org/v1.0.0/core",
        "https://api.stacspec.org/v1.0.0/collections",
        "https://api.stacspec.org/v1.0.0/ogcapi-features",
        "https://api.stacspec.org/v1.0.0/item-search",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson"
      ],
      links: [
        {
          rel: "self",
          type: "application/json",
          href: `${baseUrl}/`
        },
        {
          rel: "root",
          type: "application/json",
          href: `${baseUrl}/`
        },
        {
          rel: "data",
          type: "application/json",
          href: `${baseUrl}/collections`,
          title: "Collections"
        },
        {
          rel: "conformance",
          type: "application/json",
          href: `${baseUrl}/conformance`,
          title: "Conformance Classes"
        },
        {
          rel: "search",
          type: "application/geo+json",
          href: `${baseUrl}/search`,
          title: "STAC Search",
          method: "GET"
        },
        {
          rel: "search",
          type: "application/geo+json",
          href: `${baseUrl}/search`,
          title: "STAC Search",
          method: "POST"
        },
        {
          rel: "service-desc",
          type: "application/vnd.oai.openapi+json;version=3.0",
          href: `${baseUrl}/api`,
          title: "OpenAPI Service Description"
        },
        {
          rel: "license",
          href: "https://creativecommons.org/licenses/by/4.0/",
          type: "text/html",
          title: "CC BY 4.0"
        },
        {
          rel: "license",
          href: "https://spdx.org/licenses/ODbL-1.0.html",
          type: "text/html",
          title: "Open Data Commons Open Database License v1.0"
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    res.status(500).json({ 
      error: "Failed to fetch landing page",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getLandingPage };
