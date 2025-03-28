// booking-service/server.js
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const logger = require("./config/logger");

const app = express();
connectDB(); // Ensure DB connection is working

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use("/bookings", bookingRoutes); // Use the routes under /bookings

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Booking Service running on port ${PORT}`);
});
