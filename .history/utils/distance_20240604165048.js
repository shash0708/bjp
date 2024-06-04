const axios = require('axios');
const apiKey = ;

async function calculateAndCheckDistance(adminLocation, userLocation, maxRadius) {
    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${adminLocation.latitude},${adminLocation.longitude}&destinations=${userLocation.latitude},${userLocation.longitude}&key=${apiKey}`;
        
        const response = await axios.get(url);
        const data = response.data;

        console.log('API Response:', data);


        if (data.status !== 'OK') {
            throw new Error('Error calculating distance');
        }

        const distanceText = data.rows[0].elements[0].distance.text;
        const distanceValue = data.rows[0].elements[0].distance.value;

        console.log(`Distance between admin and user: ${distanceText}`);

     
   if (distanceValue > maxRadius) {
            throw new Error('Distance exceeds maximum radius');
        }
        return distanceText; // Or any other data you want to return
    } catch (error) {
        console.error('Error calculating or checking distance:', error.message);
        throw error; // Propagate the error for handling elsewhere
    }
}

module.exports = calculateAndCheckDistance;
