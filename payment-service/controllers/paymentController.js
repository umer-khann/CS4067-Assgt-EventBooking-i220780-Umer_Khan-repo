// payment-service/controllers/paymentController.js
const Payment = require("../models/payment");

exports.processPayment = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    console.log(`Processing payment for user ${userId} of amount ${amount}`);

    // Simulate a successful payment and log it
    const paymentLog = new Payment({ userId, amount, status: "SUCCESS" });
    await paymentLog.save();

    res.json({
      status: "SUCCESS",
      message: "Payment processed successfully",
      payment: paymentLog,
    });
  } catch (err) {
    console.error("Error in processPayment:", err);
    res.status(500).json({ error: "Payment failed" });
  }
};
