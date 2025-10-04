// Test script for distance calculation
const { getDistanceBetweenAddresses } = require('./utils/distanceCalculator');

async function testDistanceCalculation() {
  try {
    console.log('Testing distance calculation...');
    
    const result = await getDistanceBetweenAddresses('Jaipur', 'Delhi');
    
    console.log('✅ Success!');
    console.log('Distance:', result.distance, 'km');
    console.log('Duration:', result.duration, 'hours');
    console.log('From:', result.fromAddress);
    console.log('To:', result.toAddress);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDistanceCalculation();

