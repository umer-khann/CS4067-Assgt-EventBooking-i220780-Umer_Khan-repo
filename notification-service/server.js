// notification-service/server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
