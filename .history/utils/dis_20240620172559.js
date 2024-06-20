const geolib = require('geolib');

const centerPoint = { latitude:16.5431572, longitude:  81.4938162};

// Allowable distance (e.g., 50 meters)
const allowableDistance = 5; // in meters

// Calculate bounding coordinates
const bounds = geolib.getBoundsOfDistance(centerPoint, allowableDistance);

console.log('Bounding Box:', bounds);