// booking-service/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingById,
} = require("../controllers/bookingController"); // Ensure this path is correct

router.post("/", createBooking); // Creating a booking
router.get("/:id", getBookingById); // Fetch booking by ID

module.exports = router;
