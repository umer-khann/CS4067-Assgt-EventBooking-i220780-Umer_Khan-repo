// booking-routes.js
const express = require("express");
const { createBooking } = require("./booking-controller");
const router = express.Router();

// POST route for creating a booking
router.post("/", createBooking);

// You can add more routes for GET, PUT, DELETE if necessary
// For example: GET route to fetch all bookings
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
