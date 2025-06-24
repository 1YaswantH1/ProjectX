const Event = require("@/models/eventModel");

const createEvent = async (req, res) => {
    try {
        console.log("🟡 Backend received:", req.body);

        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        console.error("❌ Backend error:", error); // ✅ Use 'error'
        res.status(400).json({ message: error.message });
    }
};


const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
        console.log("hello")
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createEvent, getAllEvents };
