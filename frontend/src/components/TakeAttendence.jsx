import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TakeAttendance() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [attendance, setAttendance] = useState({});
    const [bulkStatus, setBulkStatus] = useState("present");
    const [bulkRollNumbers, setBulkRollNumbers] = useState("");
    const [filterText, setFilterText] = useState("");
    const [showExportForm, setShowExportForm] = useState(false);
    const [exportStartDate, setExportStartDate] = useState("");
    const [exportEndDate, setExportEndDate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchAttendance(selectedClass, date);
        }
    }, [date]);

    const showToast = (message, type = "info") => {
        const container = document.getElementById("toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = `alert alert-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => container.removeChild(toast), 3000);
    };

    const fetchClasses = async () => {
        const res = await fetch("http://localhost:3000/api/classes");
        const data = await res.json();
        setClasses(data);
    };

    const loadStudents = async (name) => {
        const res = await fetch("http://localhost:3000/api/classes");
        const data = await res.json();
        const cls = data.find((c) => c.name === name);
        if (cls) {
            setStudents(cls.students);
            setSelectedClass(name);
            fetchAttendance(name, date);
        }
    };

    const fetchAttendance = async (className, date) => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/attendance?className=${className}&date=${date}`
            );
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                const record = data[0];
                const newAttendance = {};
                record.records.forEach((r) => {
                    newAttendance[r.rollNumber] = r.status;
                });
                setAttendance(newAttendance);
                showToast("Loaded existing attendance", "info");
            } else {
                setAttendance({});
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const toggleStatus = (rollNumber, status) => {
        setAttendance((prev) => ({
            ...prev,
            [rollNumber]: status,
        }));
    };

    const submitAttendance = async () => {
        const records = students.map((s) => ({
            rollNumber: s.rollNumber,
            name: s.name,
            status: attendance[s.rollNumber] || "absent",
        }));
        const res = await fetch("http://localhost:3000/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ className: selectedClass, date, records }),
        });
        await res.json();
        showToast(res.ok ? "Attendance saved!" : "Failed to save", res.ok ? "success" : "error");
    };

    const filteredStudents = students.filter(
        (s) =>
            s.rollNumber.includes(filterText) ||
            s.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="toast toast-top toast-end z-50" id="toast-container"></div>

            <div className="text-center mb-4">
                <button onClick={() => navigate("/create")} className="btn btn-outline btn-sm">
                    Don't have a class? Create one
                </button>
            </div>

            <h1 className="text-3xl font-bold">📋 Take Attendance</h1>

            <div className="card bg-base-200 p-6">
                <h2 className="text-xl font-semibold">Select Class and Date</h2>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <select
                        className="select select-bordered w-full"
                        value={selectedClass}
                        onChange={(e) => loadStudents(e.target.value)}
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls.name}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        value={date}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {students.length > 0 && (
                <div className="card bg-base-100 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <select
                            className="select select-bordered"
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                        >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>

                        <input
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="Comma-separated roll numbers (e.g., 101,102)"
                            value={bulkRollNumbers}
                            onChange={(e) => setBulkRollNumbers(e.target.value)}
                        />

                        <button
                            className="btn btn-info"
                            onClick={() => {
                                const entries = bulkRollNumbers
                                    .split(/[,\s]+/)
                                    .map((r) => r.trim())
                                    .filter((r) => r);
                                const statusMap = {};
                                students.forEach((s) => {
                                    const match =
                                        entries.includes(s.rollNumber) ||
                                        entries.includes(s.rollNumber.slice(-3));
                                    statusMap[s.rollNumber] =
                                        match
                                            ? bulkStatus
                                            : bulkStatus === "present"
                                                ? "absent"
                                                : "present";
                                });
                                setAttendance(statusMap);
                                showToast(`Marked ${bulkStatus} for ${entries.length}, others inverted`, "success");
                            }}
                        >
                            Mark Bulk
                        </button>

                        <input
                            type="text"
                            className="input input-bordered w-full sm:w-auto"
                            placeholder="Search roll or name..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>

                    {filteredStudents.map((s) => (
                        <div
                            key={s.rollNumber}
                            className="flex justify-between items-center border rounded p-4"
                        >
                            <div>{s.rollNumber} - {s.name}</div>
                            <div className="flex gap-2">
                                <button
                                    className={`btn btn-sm ${attendance[s.rollNumber] === "present" ? "btn-success" : "btn-outline"
                                        }`}
                                    onClick={() => toggleStatus(s.rollNumber, "present")}
                                >
                                    Present
                                </button>
                                <button
                                    className={`btn btn-sm ${attendance[s.rollNumber] === "absent" ? "btn-error" : "btn-outline"
                                        }`}
                                    onClick={() => toggleStatus(s.rollNumber, "absent")}
                                >
                                    Absent
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <button className="btn btn-primary w-full" onClick={submitAttendance}>
                            Submit Attendance
                        </button>
                        <button className="btn btn-outline w-full" onClick={() => setShowExportForm(true)}>
                            Export CSV
                        </button>
                        <button
                            className="btn btn-warning w-full"
                            onClick={() => {
                                setAttendance({});
                                showToast("Cleared all attendance marks", "warning");
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            <input type="checkbox" id="export-modal" className="modal-toggle" checked={showExportForm} readOnly />
            <div className="modal">
                <div className="modal-box space-y-4">
                    <h3 className="font-bold text-lg">📤 Export Attendance</h3>
                    <div className="form-control">
                        <label className="label">Start Date</label>
                        <input
                            type="date"
                            className="input input-bordered"
                            value={exportStartDate}
                            onChange={(e) => setExportStartDate(e.target.value)}
                            max={new Date().toISOString().slice(0, 10)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">End Date</label>
                        <input
                            type="date"
                            className="input input-bordered"
                            value={exportEndDate}
                            onChange={(e) => setExportEndDate(e.target.value)}
                            max={new Date().toISOString().slice(0, 10)}
                        />
                    </div>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (!exportStartDate || !exportEndDate || !selectedClass) {
                                    showToast("Please fill all export fields", "warning");
                                    return;
                                }
                                const query = `className=${selectedClass}&startDate=${exportStartDate}&endDate=${exportEndDate}`;
                                window.open(`http://localhost:3000/api/attendance/export-pivot?${query}`, "_blank");
                                setShowExportForm(false);
                            }}
                        >
                            Download CSV
                        </button>
                        <button className="btn btn-outline" onClick={() => setShowExportForm(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
