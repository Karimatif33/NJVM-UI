// Example Controller file (e.g., controllers/dataController.js)
const axios = require('axios');
const https = require('https');

// Example method to handle HTTPS request
exports.getData = async (req, res) => {
  try {
    // Create an HTTPS agent with SSL certificate validation enabled
    const agent = new https.Agent({
      rejectUnauthorized: true // Optional, as this is the default behavior
    });

    // Perform HTTPS request with Axios using the created agent
    const response = await axios.get('https://example.com/api/data', {
      httpsAgent: agent
    });

    // Send response data to the View or client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
