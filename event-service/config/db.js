const mongoose = require("mongoose");
const Event = require("../models/Event"); // Import Event model

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // Insert sample events if the collection is empty
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        {
          name: "Tech Conference 2025",
          description: "A big event on AI and Cloud Computing",
          location: "New York",
          dateTime: "2025-06-15T10:00:00",
          availableSeats: 200,
        },
        {
          name: "Music Festival 2025",
          description: "A live music festival with top artists",
          location: "Los Angeles",
          dateTime: "2025-07-20T18:00:00",
          availableSeats: 500,
        },
        {
          name: "Startup Pitch Night",
          description: "A networking event for entrepreneurs",
          location: "San Francisco",
          dateTime: "2025-08-05T19:00:00",
          availableSeats: 100,
        },
      ]);
      console.log("🎉 Sample events inserted into the database!");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
