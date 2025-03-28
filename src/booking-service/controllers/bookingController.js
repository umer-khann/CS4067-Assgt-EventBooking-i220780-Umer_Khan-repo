const Booking = require("../models/Booking");
const axios = require("axios");
const logger = require("../config/logger");
const amqp = require("amqplib");

const k8sEnv = process.env.K8S_ENV || "true";

console.log("K8S_ENVVVV:", k8sEnv);

const EVENT_SERVICE_URL =
  k8sEnv === "true"
    ? "https://umer.devops.com"
    : "http://host.docker.internal:3001";

const PAYMENT_SERVICE_URL =
  k8sEnv === "true"
    ? "https://umer.devops.com"
    : "http://host.docker.internal:3003";

const RABBITMQ_URL =
  k8sEnv === "true"
    ? "amqp://rabbitmq-service.onlineeventbookingumerkhan.svc.cluster.local:5672"
    : "amqp://host.docker.internal";

console.log("EVENT_SERVICE_URL:", EVENT_SERVICE_URL);
console.log("PAYMENT_SERVICE_URL:", PAYMENT_SERVICE_URL);
console.log("RABBITMQ_URL:", RABBITMQ_URL);

// Function to get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    logger.error(`getBookingById: Error retrieving booking - ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Function to publish a message to RabbitMQ
async function publishNotification(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "notificationQueue";
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    logger.info(`Message sent to queue: ${JSON.stringify(message)}`);
    logger.info(`publishNotification: Message sent to queue ${queue}`);
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (err) {
    logger.error(
      `publishNotification: Error publishing message - ${err.message}`
    );
    throw err;
  }
}

// Function to create a booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, eventId, tickets, amount } = req.body;
    logger.info(
      `createBooking: Creating booking for user ${userId} for event ${eventId}`
    );

    // 1. Check event availability
    let eventResponse;
    try {
      eventResponse = await axios.get(
        `${EVENT_SERVICE_URL}/events/${eventId}/availability`
      );
    } catch (error) {
      logger.error(
        `createBooking: Error fetching event availability - ${error.message}`
      );
      return res
        .status(500)
        .json({ error: "Error fetching event availability" });
    }

    const availableTickets = eventResponse.data.availableTickets;
    if (availableTickets < tickets) {
      logger.info(`createBooking: Not enough tickets for event ${eventId}`);
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    // 2. Process payment
    let paymentResponse;
    try {
      paymentResponse = await axios.post(`${PAYMENT_SERVICE_URL}/payments`, {
        userId,
        amount,
      });
    } catch (error) {
      logger.error(
        `createBooking: Error processing payment - ${error.message}`
      );
      return res.status(500).json({ error: "Payment service error" });
    }

    if (paymentResponse.data.status !== "SUCCESS") {
      logger.info(`createBooking: Payment failed for user ${userId}`);
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

    try {
      await booking.save();
      logger.info(`createBooking: Booking created with id: ${booking._id}`);
    } catch (error) {
      logger.error(`createBooking: Error saving booking - ${error.message}`);
      return res.status(500).json({ error: "Error saving booking" });
    }

    // 4. Publish notification
    try {
      await publishNotification({
        bookingId: booking._id,
        userId,
        status: "CONFIRMED",
      });
    } catch (error) {
      logger.error(
        `createBooking: Error publishing notification - ${error.message}`
      );
      return res.status(500).json({ error: "Error publishing notification" });
    }

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    logger.error(`createBooking: Unexpected error occurred - ${err.message}`);
    res.status(500).json({ error: "Server Error" });
  }
};
