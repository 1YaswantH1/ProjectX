const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    registrationStartDate: {
        type: Date,
        required: true
    },
    registrationEndDate: {
        type: Date,
        required: true
    },
    totalRegistrations: {
        type: Number,
        default: 0
    },

    registeredMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Event", eventSchema);
