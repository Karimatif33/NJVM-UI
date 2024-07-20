const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const express = require('express');
const router = express.Router();

router.get('/check-existence/:type/:id', AsyncHandler(async (req, res) => {
  const client = await connect();
  const { type, id } = req.params;

  try {
    let exists = false;
    
    // Check existence based on type (subject or instructor)
    if (type === 'subject') {
      const result = await client.query(
        'SELECT EXISTS (SELECT 1 FROM subjects WHERE id = $1) AS "exists"',
        [id]
      );
      exists = result.rows[0].exists;
    } else if (type === 'instructor') {
      const result = await client.query(
        'SELECT EXISTS (SELECT 1 FROM instructors WHERE id = $1) AS "exists"',
        [id]
      );
      exists = result.rows[0].exists;
    }
    
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking existence:', error);
    res.status(500).json({ message: 'Error checking existence' });
  } finally {
    client.release();
  }
}));

module.exports = router;


const express = require('express');
const app = express();
const checkExistenceRouter = require('./routes/checkExistence'); // Adjust path as necessary

// Other middleware and setup

app.use('/api', checkExistenceRouter); // Mount the router at /api/check-existence

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
