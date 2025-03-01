// event-service/controllers/eventController.js
const Event = require("../models/Event");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error in getAllEvents:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get event by id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Error in getEventById:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Check ticket availability
exports.checkAvailability = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ availableTickets: event.availableTickets });
  } catch (err) {
    console.error("Error in checkAvailability:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, date, venue, availableTickets } = req.body;
    const event = new Event({ name, date, venue, availableTickets });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("Error in createEvent:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
