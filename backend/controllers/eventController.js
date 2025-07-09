const Event = require("../models/eventModel");

// Create Event with local image upload support
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventDate,
            time,
            location,
            registrationLink,
            registrationStartDate,
            registrationEndDate,
            createdBy,
        } = req.body;

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const event = await Event.create({
            title,
            description,
            eventDate,
            time,
            location,
            registrationLink,
            registrationStartDate,
            registrationEndDate,
            createdBy,
            imageUrl,
        });

        res.status(201).json(event);
    } catch (error) {
        console.error("❌ Error creating event:", error);
        res.status(400).json({ message: error.message });
    }
};

// Get All Events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        console.log("✅ Fetched events");
        res.json(events);
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

const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent,
    updateEvent,
};