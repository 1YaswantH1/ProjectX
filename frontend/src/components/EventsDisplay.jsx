import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const EventsDisplay = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const deleteModalRef = useRef(null);
  const editModalRef = useRef(null);

  const api_events = import.meta.env.VITE_API_EVENTS;
  const api = import.meta.env.VITE_API;

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const openEditModal = (event) => {
    setEditFormData({ ...event });
    editModalRef.current?.showModal();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${api_events}/${editFormData._id}`,
        editFormData
      );
      setEvents((prev) =>
        prev.map((evt) => (evt._id === res.data._id ? res.data : evt))
      );
      editModalRef.current?.close();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="flex flex-col md:flex-row bg-base-100 shadow-md border border-gray-200 rounded-xl overflow-hidden"
          >
            {event.imageUrl && (
              <img
                src={`${api}${event.imageUrl}`}
                alt="Event"
                className="w-full md:w-[45%] h-48 md:h-full object-contain bg-white"
              />
            )}

            <div className="flex flex-col p-5 justify-between flex-1">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(event._id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-2 max-h-24 overflow-y-auto pr-2">
                  {event.description}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(event.eventDate).toLocaleDateString()}
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

              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary mt-4 self-start"
                >
                  Register Here
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🗑 Delete Confirmation Modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this event?</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedEventId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={handleDelete}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* ✏️ Edit Modal */}
      <dialog ref={editModalRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="text-lg font-bold mb-4">Edit Event</h3>
          {editFormData && (
            <form
              onSubmit={handleEditSubmit}
              className="grid grid-cols-1 gap-4"
            >
              <input
                type="text"
                name="title"
                className="input input-bordered"
                value={editFormData.title}
                onChange={handleEditChange}
                required
              />
              <textarea
                name="description"
                className="textarea textarea-bordered"
                value={editFormData.description}
                onChange={handleEditChange}
              />
              <input
                type="date"
                name="eventDate"
                className="input input-bordered"
                value={editFormData.eventDate?.slice(0, 10)}
                onChange={handleEditChange}
                required
              />
              <input
                type="time"
                name="time"
                className="input input-bordered"
                value={editFormData.time}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="location"
                className="input input-bordered"
                value={editFormData.location}
                onChange={handleEditChange}
                required
              />
              <input
                type="datetime-local"
                name="registrationStartDate"
                className="input input-bordered"
                value={editFormData.registrationStartDate?.slice(0, 16)}
                onChange={handleEditChange}
                required
              />
              <input
                type="datetime-local"
                name="registrationEndDate"
                className="input input-bordered"
                value={editFormData.registrationEndDate?.slice(0, 16)}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="registrationLink"
                className="input input-bordered"
                value={editFormData.registrationLink}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="createdBy"
                className="input input-bordered"
                value={editFormData.createdBy}
                onChange={handleEditChange}
                required
              />

              <div className="modal-action">
                <form method="dialog">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn ml-2"
                    onClick={() => editModalRef.current?.close()}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
};

export default EventsDisplay;
