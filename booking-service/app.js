// app.js
const express = require("express");
const bookingRoutes = require("./booking-routes"); // Ensure correct import
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json()); // Middleware to parse JSON data

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => {
    console.log("✅ Booking Service: Database connected successfully");
  })
  .catch((err) => {
    console.error(
      "❌ Booking Service: Database connection failed",
      err.message
    );
  });

// Use the booking routes to handle requests
app.use("/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`✅ Booking Service running at: http://localhost:${PORT}`);
});
