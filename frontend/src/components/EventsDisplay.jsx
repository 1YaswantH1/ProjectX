import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const EventsDisplay = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const deleteModalRef = useRef(null);

    const api_events = import.meta.env.VITE_API_EVENTS;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios
            .get(api_events)
            .then((res) => setEvents(res.data))
            .catch((err) => console.error("Failed to fetch events:", err));
    };

    const openDeleteModal = (id) => {
        setSelectedEventId(id);
        deleteModalRef.current?.showModal();
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${api_events}/${selectedEventId}`);
            setEvents(events.filter((event) => event._id !== selectedEventId));
            deleteModalRef.current?.close();
            setSelectedEventId(null);
        } catch (err) {
            console.error("Error deleting event:", err);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {events.map((event) => (
                    <div
                        key={event._id}
                        className="card bg-base-100 shadow-md border border-gray-200 rounded-xl p-5"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold">{event.title}</h2>
                            <button
                                onClick={() => openDeleteModal(event._id)}
                                className="btn btn-sm btn-outline btn-error"
                            >
                                Delete
                            </button>
                        </div>
                        <p className="text-gray-700 mb-2">{event.description}</p>
                        <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Time:</strong> {event.time}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Location:</strong> {event.location}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Registration:</strong>{" "}
                            {new Date(event.registrationStartDate).toLocaleString()} →{" "}
                            {new Date(event.registrationEndDate).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Created by: {event.createdBy}
                        </p>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <dialog ref={deleteModalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-semibold text-lg">Confirm Deletion</h3>
                    <p className="py-4">Are you sure you want to delete this event?</p>
                    <div className="modal-action">
                        <form method="dialog" className="space-x-2">
                            <button className="btn btn-sm btn-outline" onClick={() => setSelectedEventId(null)}>Cancel</button>
                            <button type="button" className="btn btn-sm btn-error" onClick={handleDelete}>
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default EventsDisplay;
