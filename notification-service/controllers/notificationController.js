// notification-service/controllers/notificationController.js
const Notification = require("../models/Notification");

exports.sendNotification = async (req, res) => {
  try {
    const { bookingId, userId, status } = req.body;
    console.log(
      `Sending notification for booking ${bookingId} with status ${status} to user ${userId}`
    );

    // Log the notification in the database
    const notificationLog = new Notification({ bookingId, userId, status });
    await notificationLog.save();

    res.json({
      message: "Notification sent successfully",
      notification: notificationLog,
    });
  } catch (err) {
    console.error("Error in sendNotification:", err);
    res.status(500).json({ error: "Notification failed" });
  }
};
