const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const axios = require("axios");
const userRoutes = require("./userRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

// Routes
app.use("/api/users", userRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("User Service is running...");
});

// Create Booking - Sync call to Booking Service
app.post("/api/users/:userId/bookings", async (req, res) => {
  const { userId } = req.params;
  const { event_id, tickets } = req.body;

  try {
    // Validate user exists
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Call Booking Service to create booking
    const bookingServiceUrl =
      process.env.BOOKING_SERVICE_URL || "http://localhost:3002";
    const response = await axios.post(`${bookingServiceUrl}/bookings`, {
      user_id: userId,
      event_id,
      tickets,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error creating booking:", error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, pool };
