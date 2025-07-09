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
    const api_events = import.meta.env.VITE_API_EVENTS;

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
            await axios.post(api_events, formData);
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="form-control w-full">
                    <span className="label-text mb-1">Event Title</span>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Description</span>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Event Date</span>
                    <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Event Time</span>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Location</span>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Registration Start Date & Time</span>
                    <input
                        type="datetime-local"
                        name="registrationStartDate"
                        value={formData.registrationStartDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Registration End Date & Time</span>
                    <input
                        type="datetime-local"
                        name="registrationEndDate"
                        value={formData.registrationEndDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1">Created By</span>
                    <input
                        type="text"
                        name="createdBy"
                        value={formData.createdBy}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </label>

                {success && <div className="alert alert-success mt-4">{success}</div>}
                {error && <div className="alert alert-error mt-4">{error}</div>}

                <button type="submit" className="btn btn-primary w-full">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default EventForm;
