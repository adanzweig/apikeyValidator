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
    const result = await pool.query(
      'SELECT * FROM licenses WHERE license = $1 AND start_date <= NOW() AND end_date >= NOW()',
      [key]
    );

    if (result.rows.length > 0) {
      res.json({ valid: true, data: result.rows[0] });
    } else {
      res.json({ valid: false, data: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
