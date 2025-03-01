const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notificationRoutes");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/notifications", notificationRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on http://localhost:${PORT}`);
});
