require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to database
connectDB();

// Routes
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ MongoDB connected successfully!`);
  console.log(
    `🚀 Server running on: \x1b[36mhttp://localhost:${PORT}/events\x1b[0m`
  );
});
