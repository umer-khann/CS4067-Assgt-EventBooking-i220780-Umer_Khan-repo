// POST endpoint: log a notification
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const logger = require("../config/logger");
const { sendNotification } = require("../controllers/notificationController");

router.post("/", sendNotification);
// GET endpoint: retrieve notifications for a user from the database
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId query parameter" });
  }
  try {
    const notifications = await Notification.find({ userId });
    res.json(notifications);
  } catch (err) {
    logger.error("Error fetching notifications from DB: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
