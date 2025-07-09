import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import NavBar from "./NavBar";

export default function CreateClass() {
    const [className, setClassName] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [rollNumbersFromExcel, setRollNumbersFromExcel] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [excelModalOpen, setExcelModalOpen] = useState(false);

    const API_CLASSES_UPLOAD = import.meta.env.VITE_API_CLASSES_UPLOAD;
    const navigate = useNavigate();

    const handleCSVUpload = async () => {
        setStatusMessage("");
        setErrorMessage("");

        if (!className || !csvFile) {
            setErrorMessage("Please fill both class name and choose a CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("csv", csvFile);
        formData.append("className", className);

        try {
            const res = await fetch(API_CLASSES_UPLOAD, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setStatusMessage("✅ Class uploaded successfully!");
                setClassName("");
                setCsvFile(null);
                setExcelFile(null);
                setRollNumbersFromExcel([]);
                setTimeout(() => navigate("/attendance"), 1000);
            } else {
                setErrorMessage(data.message || "❌ Upload failed.");
            }
        } catch (err) {
            setErrorMessage("❌ Server error. Please try again later.", err);
        }
    };

    const handleExcelImport = () => {
        setStatusMessage("");
        setErrorMessage("");

        if (!excelFile) {
            setErrorMessage("Please choose an Excel file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const flatRolls = json
                .flat()
                .map((v) => String(v).trim())
                .filter((v) => v !== "");

            setRollNumbersFromExcel(flatRolls);
            setExcelModalOpen(true);
        };

        reader.readAsArrayBuffer(excelFile);
    };

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <NavBar />
            <h1 className="text-3xl font-bold">🏫 Create or Import Class</h1>

            <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Class Name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
            />

            <input
                type="file"
                accept=".csv"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setCsvFile(e.target.files[0])}
            />

            <button className="btn btn-success w-full" onClick={handleCSVUpload}>
                Upload Class CSV
            </button>

            {statusMessage && (
                <div className="alert alert-success mt-2 py-2 text-sm">
                    {statusMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-error mt-2 py-2 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="divider">OR</div>

            <div className="space-y-2">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => setExcelFile(e.target.files[0])}
                />
                <button className="btn btn-info w-full" onClick={handleExcelImport}>
                    Import Roll Numbers from Excel
                </button>

                {rollNumbersFromExcel.length > 0 && (
                    <div className="bg-base-200 p-4 rounded">
                        <h2 className="font-semibold">📄 Imported Roll Numbers:</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm">
                            {rollNumbersFromExcel.map((r, i) => (
                                <div key={i} className="badge badge-outline">
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center mt-4">
                <button
                    onClick={() => navigate("/attendance")}
                    className="btn btn-outline btn-sm"
                >
                    Take Attendance
                </button>
            </div>

            {/* Excel Modal */}
            {excelModalOpen && (
                <dialog
                    open
                    className="modal modal-open"
                    onClick={() => setExcelModalOpen(false)}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">✅ Excel Imported!</h3>
                        <p className="py-2">
                            Imported <strong>{rollNumbersFromExcel.length}</strong> roll
                            numbers from Excel.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setExcelModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}
