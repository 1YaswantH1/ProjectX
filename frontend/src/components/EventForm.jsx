import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EventForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        time: "",
        location: "",
        registrationLink: "",
        registrationStartDate: "",
        registrationEndDate: "",
        createdBy: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user"); // adjust if you're using tokens or session
        if (!user) {
            navigate("/login");
        }
    }, []);

    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const api_events = import.meta.env.VITE_API_EVENTS;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
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

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (imageFile) data.append("image", imageFile);

        try {
            await axios.post(api_events, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess("Event created successfully!");
            setFormData({
                title: "",
                description: "",
                eventDate: "",
                time: "",
                location: "",
                registrationLink: "",
                registrationStartDate: "",
                registrationEndDate: "",
                createdBy: "",
            });
            setImageFile(null);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-base-200 rounded-box shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {[
                    { name: "title", label: "Event Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "eventDate", label: "Event Date", type: "date" },
                    { name: "time", label: "Event Time", type: "time" },
                    { name: "location", label: "Location", type: "text" },
                    { name: "registrationLink", label: "Registration Link", type: "url" },
                    { name: "registrationStartDate", label: "Registration Start", type: "datetime-local" },
                    { name: "registrationEndDate", label: "Registration End", type: "datetime-local" },
                    { name: "createdBy", label: "Created By", type: "text" },
                ].map(({ name, label, type }) => (
                    <label className="form-control w-full" key={name}>
                        <span className="label-text mb-1">{label}</span>
                        {type === "textarea" ? (
                            <textarea
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="textarea textarea-bordered w-full"
                            />
                        ) : (
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required={name !== "description" && name !== "registrationLink"}
                            />
                        )}
                    </label>
                ))}

                {/* Image Upload */}
                <label className="form-control w-full">
                    <span className="label-text mb-1">Event Image</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full"
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
