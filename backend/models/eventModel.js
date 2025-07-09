// models/eventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    eventDate: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    registrationLink: { type: String },
    imageUrl: { type: String },
    registrationStartDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= new Date();
            },
            message: "Registration start date must be now or in the future.",
        },
    },
    registrationEndDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.registrationStartDate;
            },
            message: "Registration end date must be after the start date.",
        },
    },
    createdBy: { type: String, required: true },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
