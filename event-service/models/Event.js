const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: String,
    dateTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
