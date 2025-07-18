import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useNavigate } from "react-router-dom";

export default function DeleteClass() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const API_CLASSES_NAME = import.meta.env.VITE_API_CLASSES_NAME;
    const API_CLASSES = import.meta.env.VITE_API_CLASSES;
    const fetchClasses = async () => {
        try {
            const res = await axios.get(API_CLASSES);
            setClasses(res.data);
        } catch (error) {
            console.error("Failed to fetch classes:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${API_CLASSES_NAME}/${encodeURIComponent(selectedClass.name)}`
            );
            setShowModal(false);
            setSelectedClass(null);
            fetchClasses(); // Refresh list
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    useEffect(() => {
        fetchClasses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-4">
            <NavBar />
            <h2 className="text-2xl font-bold mb-4">Delete a Class</h2>

            {classes.length === 0 ? (
                <p>No classes found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Students Count</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls.name}>
                                    <td>{cls.name}</td>
                                    <td>{cls.students.length}</td>
                                    <td>
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setShowModal(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && selectedClass && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
                        <p className="mb-4">
                            Are you sure you want to delete class{" "}
                            <strong>{selectedClass.name}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-error" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="text-center mt-4">
                <button
                    onClick={() => navigate("/attendance")}
                    className="btn btn-outline btn-sm"
                >
                    Take Attendance
                </button>
            </div>
        </div>
    );
}
