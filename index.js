// validate_license_api.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.post('/validate', async (req, res) => {
  const { key } = req.body;

  try {
    const result = await pool.query('SELECT COUNT(*) FROM licenses WHERE license = $1', [key]);
    const count = parseInt(result.rows[0].count, 10);
    res.json({ valid: count > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
