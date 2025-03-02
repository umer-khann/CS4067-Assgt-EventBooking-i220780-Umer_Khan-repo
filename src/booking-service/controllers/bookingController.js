const Booking = require("../models/Booking");
const axios = require("axios");
const logger = require("../config/logger");

exports.createBooking = async (req, res) => {
  try {
    const { userId, eventId, tickets, amount } = req.body;
    logger.info(
      `createBooking: Creating booking for user ${userId} for event ${eventId}`
    );

    // Check event availability
    const eventResponse = await axios.get(
      `http://localhost:3001/events/${eventId}/availability`
    );
    const availableTickets = eventResponse.data.availableTickets;
    if (availableTickets < tickets) {
      logger.info(`createBooking: Not enough tickets for event ${eventId}`);
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    // Process payment (via Payment Service)
    const paymentResponse = await axios.post("http://localhost:3003/payments", {
      userId,
      amount,
    });
    if (paymentResponse.data.status !== "SUCCESS") {
      logger.info(`createBooking: Payment failed for user ${userId}`);
      return res.status(400).json({ error: "Payment failed" });
    }

    // Create booking
    const booking = new Booking({
      userId,
      eventId,
      tickets,
      amount,
      status: "CONFIRMED",
    });
    await booking.save();
    logger.info(`createBooking: Booking created with id: ${booking._id}`);

    // Send notification (via Notification Service)
    await axios.post("http://localhost:3004/notifications", {
      bookingId: booking._id,
      userId,
      status: "CONFIRMED",
    });
    logger.info(
      `createBooking: Notification sent for booking id: ${booking._id}`
    );

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    logger.error(`createBooking: Error occurred - ${err.message}`);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    logger.info(`getBookingById: Fetching booking with id: ${req.params.id}`);
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      logger.info(
        `getBookingById: Booking not found with id: ${req.params.id}`
      );
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    logger.error(`getBookingById: Error occurred - ${err.message}`);
    res.status(500).json({ error: "Server Error" });
  }
};
