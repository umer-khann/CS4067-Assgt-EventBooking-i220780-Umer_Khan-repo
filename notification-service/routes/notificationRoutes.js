const express = require("express");
const Notification = require("../models/Notifications");

const router = express.Router();

// Create a new notification
router.post("/send", async (req, res) => {
  try {
    const { recipient, message } = req.body;
    const notification = new Notification({ recipient, message });
    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
