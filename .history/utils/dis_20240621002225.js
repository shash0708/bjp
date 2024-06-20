// distanceUtils.js
const geolib = require('geolib');

function getDistance(location1, location2) {
  return geolib.getDistance(
    { latitude: location1.latitude, longitude: location1.longitude },
    { latitude: location2.latitude, longitude: location2.longitude }
  );
}

async function calculateAndCheckDistance(adminLocation, userLocation, maxRadius) {
  const distance = getDistance(userLocation, adminLocation);
  console.log(dis)
  if (distance > maxRadius) {
    throw new Error('Distance exceeds maximum radius');
  }
  return distance;
}

module.exports = {
  getDistance,
  calculateAndCheckDistance
};
