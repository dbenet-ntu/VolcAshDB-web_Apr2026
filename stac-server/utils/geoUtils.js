/**
 * Validate bounding box coordinates
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @returns {Boolean}
 */
const isValidBbox = (bbox) => {
  if (!Array.isArray(bbox) || bbox.length !== 4) {
    return false;
  }
  
  const [minLon, minLat, maxLon, maxLat] = bbox;
  
  return (
    minLon >= -180 && maxLon <= 180 &&
    minLat >= -90 && maxLat <= 90 &&
    minLon <= maxLon &&
    minLat <= maxLat
  );
};

/**
 * Calculate bounding box from array of coordinates
 * @param {Array} coordinates - Array of [lon, lat] pairs
 * @returns {Array} [minLon, minLat, maxLon, maxLat]
 */
const calculateBbox = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return [-180, -90, 180, 90];
  }
  
  const lons = coordinates.map(c => c[0]).filter(v => !isNaN(v));
  const lats = coordinates.map(c => c[1]).filter(v => !isNaN(v));
  
  if (lons.length === 0 || lats.length === 0) {
    return [-180, -90, 180, 90];
  }
  
  return [
    Math.min(...lons),
    Math.min(...lats),
    Math.max(...lons),
    Math.max(...lats)
  ];
};

/**
 * Check if point is within bounding box
 * @param {Array} point - [lon, lat]
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @returns {Boolean}
 */
const isPointInBbox = (point, bbox) => {
  const [lon, lat] = point;
  const [minLon, minLat, maxLon, maxLat] = bbox;
  
  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
};

module.exports = {
  isValidBbox,
  calculateBbox,
  isPointInBbox
};
