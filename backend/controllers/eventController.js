const Event = require("../models/eventModel");
const fs = require("fs");
const path = require("path");

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        // Fix path to match where Multer actually stores the file
        if (event.imageUrl) {
            const imagePath = path.resolve("uploads", path.basename(event.imageUrl));
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("⚠️ Error deleting image file:", err.message);
                } else {
                    console.log("🗑️ Image file deleted:", imagePath);
                }
            });
        }

        res.status(200).json({ message: "Event and image deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

        // Define uploads folder path
        const uploadDir = path.join(__dirname, "..", "uploads");

        // Check and create uploads folder if not exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

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
        // console.log("✅ Fetched events");
        res.json(events);
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
        if (!updatedEvent)
            return res.status(404).json({ message: "Event not found" });
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
