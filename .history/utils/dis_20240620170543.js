const geolib = require('geolib');

// Central point (e.g., classroom location)
const centerPoint = { latitude: 34.090166, longitude: -118.276736555556 };

// Allowable distance (e.g., 50 meters)
const allowableDistance = 50; // in meters

// Calculate bounding coordinates
const bounds = geolib.getBoundsOfDistance(centerPoint, allowableDistance);

console.log('Bounding Box:', bounds);
/*
{
  minLat: 34.0897,
  minLng: -118.2773,
  maxLat: 34.0906,
  maxLng: -118.2762
}
*/

// Function to check if a student's location is within the bounding box
function isWithinBounds(studentLocation, bounds) {
  return (
    studentLocation.latitude >= bounds.minLat &&
    studentLocation.latitude <= bounds.maxLat &&
    studentLocation.longitude >= bounds.minLng &&
    studentLocation.longitude <= bounds.maxLng
  );
}

// Example student locations
const students = [
  { id: 1, location: { latitude: 34.090200, longitude: -118.276700 } },
  { id: 2, location: { latitude: 34.089500, longitude: -118.277500 } },
  { id: 3, location: { latitude: 34.091000, longitude: -118.275000 } }
];

// Check each student
students.forEach(student => {
  if (isWithinBounds(student.location, bounds)) {
    console.log(`Student ${student.id} is within bounds and can be marked present.`);
  } else {
    console.log(`Student ${student.id} is outside bounds and cannot be marked present.`);
  }
});
