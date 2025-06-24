import React, { useState } from "react";
import axios from "axios";

const EventForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        time: "",
        location: "",
        registrationStartDate: "",
        registrationEndDate: "",
        createdBy: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
        setSuccess("");
    };

    const validateDates = () => {
        const now = new Date();
        const regStart = new Date(formData.registrationStartDate);
        const regEnd = new Date(formData.registrationEndDate);

        if (regStart < now) {
            setError("Registration start date must be now or in the future.");
            return false;
        }

        if (regEnd <= regStart) {
            setError("Registration end date must be after the start date.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateDates()) return;

        try {
            await axios.post("http://localhost:3000/api/events", formData);
            setSuccess("Event created successfully!");
            setFormData({
                title: "",
                description: "",
                eventDate: "",
                time: "",
                location: "",
                registrationStartDate: "",
                registrationEndDate: "",
                createdBy: "",
            });
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-base-200 rounded-box shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Event</h2>

            {error && <div className="alert alert-error mb-4">{error}</div>}
            {success && <div className="alert alert-success mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                />

                <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <label className="label">
                    <span className="label-text">Registration Start Date & Time</span>
                </label>
                <input
                    type="datetime-local"
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <label className="label">
                    <span className="label-text">Registration End Date & Time</span>
                </label>
                <input
                    type="datetime-local"
                    name="registrationEndDate"
                    value={formData.registrationEndDate}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <input
                    type="text"
                    name="createdBy"
                    placeholder="Created By"
                    value={formData.createdBy}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <button type="submit" className="btn btn-primary w-full">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default EventForm;
