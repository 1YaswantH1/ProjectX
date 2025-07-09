const Attendance = require('../models/Attendance');

exports.addAttendance = async (req, res) => {
    try {
        const { className, date, records } = req.body;

        const existing = await Attendance.findOne({ className, date });
        if (existing) {
            existing.records = records;
            await existing.save();
            return res.json({ message: 'Attendance updated', attendance: existing });
        }

        const attendance = new Attendance({ className, date, records });
        await attendance.save();
        res.json({ message: 'Attendance saved', attendance });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save attendance' });
    }
};

exports.getAttendanceByClassAndDate = async (req, res) => {
    try {
        const { className, date } = req.query;
        const filter = {};
        if (className) filter.className = className;
        if (date) {
            const d = new Date(date);
            const next = new Date(d);
            next.setDate(d.getDate() + 1);
            filter.date = { $gte: d, $lt: next };
        }
        const data = await Attendance.find(filter);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};

exports.exportAttendanceCSV = async (req, res) => {
    try {
        const { className, startDate, endDate } = req.query;
        if (!className || !startDate || !endDate)
            return res.status(400).send("Class name, start date, and end date are required");

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);

        const records = await Attendance.find({
            className,
            date: { $gte: start, $lt: end },
        });

        if (!records.length)
            return res.status(404).send("No attendance records found");

        const dates = [...new Set(records.map(r => r.date.toISOString().slice(0, 10)))].sort();

        const studentMap = {};
        for (const entry of records) {
            const dateStr = entry.date.toISOString().slice(0, 10);
            for (const rec of entry.records) {
                if (!studentMap[rec.rollNumber]) {
                    studentMap[rec.rollNumber] = { name: rec.name, statuses: {} };
                }
                studentMap[rec.rollNumber].statuses[dateStr] = rec.status;
            }
        }

        const header = ['Roll Number', 'Name', ...dates];
        const rows = [header.join(',')];
        for (const [rollNumber, { name, statuses }] of Object.entries(studentMap)) {
            const row = [rollNumber, `"${name}"`];
            for (const date of dates) {
                row.push(statuses[date] || 'absent');
            }
            rows.push(row.join(','));
        }

        res.setHeader('Content-Disposition', `attachment; filename=${className}_attendance_${startDate}_to_${endDate}.csv`);
        res.setHeader('Content-Type', 'text/csv');
        res.send(rows.join('\n'));
    } catch (err) {
        console.error("Export error:", err);
        res.status(500).json({ error: "Failed to export pivot CSV" });
    }
};
