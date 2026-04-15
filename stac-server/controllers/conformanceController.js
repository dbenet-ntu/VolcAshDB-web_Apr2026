/**
 * STAC Conformance Declaration
 * Endpoint: GET /conformance
 */
const getConformance = (req, res) => {
  res.json({
    conformsTo: [
      // STAC API Core
      "https://api.stacspec.org/v1.0.0/core",
      
      // STAC API Collections
      "https://api.stacspec.org/v1.0.0/collections",
      
      // STAC API Item Search
      "https://api.stacspec.org/v1.0.0/item-search",
      
      // OGC API - Features
      "https://api.stacspec.org/v1.0.0/ogcapi-features",
      "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
      "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
      
      // OGC API - Common
      "http://www.opengis.net/spec/ogcapi-common-1/1.0/conf/core",
      "http://www.opengis.net/spec/ogcapi-common-2/1.0/conf/collections"
    ]
  });
};

module.exports = { getConformance };