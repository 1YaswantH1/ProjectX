const Event = require("@/models/eventModel");

// Create Event
const createEvent = async (req, res) => {
    try {
        console.log("🟡 Backend received:", req.body);
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        console.error("❌ Backend error:", error);
        res.status(400).json({ message: error.message });
    }
};

// Get All Events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
        console.log("✅ Fetched events");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Event by ID
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent,
};
