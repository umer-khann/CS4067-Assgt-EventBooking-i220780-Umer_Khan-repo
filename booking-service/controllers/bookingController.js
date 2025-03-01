// booking-service/controllers/bookingController.js
const Booking = require("../models/Booking");
const axios = require("axios");

exports.createBooking = async (req, res) => {
  try {
    const { userId, eventId, tickets, amount } = req.body;

    // 1. Check event availability (calls Event Service)
    const eventResponse = await axios.get(
      `http://localhost:3001/events/${eventId}/availability`
    );
    const availableTickets = eventResponse.data.availableTickets;
    if (availableTickets < tickets) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    // 2. Process payment (calls Payment Service)
    const paymentResponse = await axios.post("http://localhost:3003/payments", {
      userId,
      amount,
    });
    if (paymentResponse.data.status !== "SUCCESS") {
      return res.status(400).json({ error: "Payment failed" });
    }

    // 3. Create the booking
    const booking = new Booking({
      userId,
      eventId,
      tickets,
      amount,
      status: "CONFIRMED",
    });
    await booking.save();

    // 4. Send notification (calls Notification Service)
    await axios.post("http://localhost:3004/notifications", {
      bookingId: booking._id,
      userId,
      status: "CONFIRMED",
    });

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    console.error("Error in createBooking:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error("Error in getBookingById:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
