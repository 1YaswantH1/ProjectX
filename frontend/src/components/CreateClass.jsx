import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

export default function CreateClass() {
    const [className, setClassName] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [rollNumbersFromExcel, setRollNumbersFromExcel] = useState([]);
    const navigate = useNavigate();

    const handleCSVUpload = async () => {
        if (!className || !csvFile) {
            alert("Please fill both fields");
            return;
        }

        const formData = new FormData();
        formData.append("csv", csvFile);
        formData.append("className", className);

        const res = await fetch("http://localhost:3000/api/classes/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        if (res.ok) {
            alert("Class uploaded successfully!");
            setClassName("");
            setCsvFile(null);
            setExcelFile(null);
            setRollNumbersFromExcel([]);
            navigate("/attendance");
        } else {
            alert(data.message || "Upload failed");
        }
    };

    const handleExcelImport = () => {
        if (!excelFile) {
            alert("Please choose an Excel file");
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
            alert(`Imported ${flatRolls.length} roll numbers`);
        };
        reader.readAsArrayBuffer(excelFile);
    };

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
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
                    ✅ Already have a class? Take Attendance
                </button>
            </div>
        </div>
    );
}
