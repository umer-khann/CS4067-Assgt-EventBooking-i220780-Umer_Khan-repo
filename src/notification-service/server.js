const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const amqp = require("amqplib");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");
const logger = require("./config/logger");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 3004;

const RABBITMQ_URL =
  process.env.K8S_ENV === "true"
    ? "amqp://rabbitmq-service.onlineeventbookingumerkhan.svc.cluster.local:5672"
    : "amqp://host.docker.internal";

app.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`);
  // Start consuming messages asynchronously from RabbitMQ
  consumeNotifications();
});

console.log("r", RABBITMQ_URL);
// Consumer function to receive and save messages from RabbitMQ
async function consumeNotifications() {
  try {
    // Log the attempt to connect to RabbitMQ
    logger.info(
      `consumeNotifications: Attempting to connect to RabbitMQ at ${RABBITMQ_URL}`
    );

    const connection = await amqp.connect(RABBITMQ_URL);
    logger.info(`consumeNotifications: Connected to RabbitMQ`);

    const channel = await connection.createChannel();
    logger.info(`consumeNotifications: Channel created`);

    const queue = "notificationQueue";
    await channel.assertQueue(queue, { durable: true });
    logger.info(`consumeNotifications: Queue ${queue} asserted`);

    logger.info(
      `consumeNotifications: Waiting for messages in queue: ${queue}`
    );

    // Consume messages from the queue
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        logger.info(
          `consumeNotifications: Received message: ${msg.content.toString()}`
        );

        try {
          // Process the message and save the notification to MongoDB
          const message = JSON.parse(msg.content.toString());
          logger.info(
            `consumeNotifications: Parsed message: ${JSON.stringify(message)}`
          );

          const Notification = require("./models/Notification");
          const newNotification = new Notification({
            bookingId: message.bookingId,
            userId: message.userId,
            status: message.status,
            timestamp: new Date(),
          });

          await newNotification.save();
          logger.info(
            `consumeNotifications: Notification saved for booking ${message.bookingId}`
          );
        } catch (error) {
          logger.error(
            `consumeNotifications: Failed to save notification for booking ${message.bookingId} - ${error.message}`
          );
        }

        // Acknowledge the message after processing
        channel.ack(msg);
        logger.info(
          `consumeNotifications: Message acknowledged for booking ${msg.content.toString()}`
        );
      } else {
        logger.warn(`consumeNotifications: No message received`);
      }
    });
  } catch (err) {
    logger.error(
      `consumeNotifications: Error in consuming messages - ${err.message}`
    );
  }
}
