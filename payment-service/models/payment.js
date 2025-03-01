// payment-service/models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "SUCCESS" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
