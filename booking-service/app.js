require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// PostgreSQL Pool Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test Database Connection
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err));

// Create Booking Route (Insert into DB)
app.post("/bookings", async (req, res) => {
  const { user_id, event_id, tickets } = req.body;

  if (!user_id || !event_id || !tickets) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const query = `
            INSERT INTO bookings (user_id, event_id, num_tickets)
            VALUES ($1, $2, $3) RETURNING *;
        `;
    const result = await pool.query(query, [user_id, event_id, tickets]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting booking:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
