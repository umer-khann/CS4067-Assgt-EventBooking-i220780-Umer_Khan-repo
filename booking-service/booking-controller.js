// booking-controller.js
const axios = require("axios");
const pool = require("./db"); // Ensure db connection is correct

const createBooking = async (req, res) => {
  const { user_id, event_id, tickets } = req.body;

  try {
    // Validate the user exists via the User Service
    const userResponse = await axios.get(
      `http://localhost:3001/users/${user_id}`
    );
    const user = userResponse.data;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Insert the booking into the database
    const result = await pool.query(
      "INSERT INTO bookings (user_id, event_id, num_tickets) VALUES ($1, $2, $3) RETURNING *",
      [user_id, event_id, tickets]
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error("Error during booking:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createBooking };
