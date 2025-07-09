const Class = require('../models/class');
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadClassCSV = async (req, res) => {
    try {
        const { className } = req.body;
        const filePath = req.file.path;
        const students = [];
        let headerValidated = false;
        let csvStream;

        csvStream = fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim()
            }))
            .on('headers', (headers) => {
                const requiredHeaders = ['Name', 'Roll Number'];
                const missing = requiredHeaders.filter(h => !headers.includes(h));
                if (missing.length > 0) {
                    csvStream.destroy(); // stop reading
                    return res.status(400).json({ error: `Missing required headers: ${missing.join(', ')}` });
                }
                headerValidated = true;
            })
            .on('data', (row) => {
                if (!row['Name'] || !row['Roll Number']) {
                    console.warn('Skipping row due to missing fields:', row);
                    return;
                }

                students.push({
                    rollNumber: row['Roll Number'].trim(),
                    name: row['Name'].trim(),
                });
            })
            .on('end', async () => {
                if (!headerValidated) return; // already handled error

                const existing = await Class.findOne({ name: className });
                if (existing) {
                    return res.status(400).json({ message: 'Class already exists.' });
                }

                const newClass = new Class({ name: className, students });
                await newClass.save();

                res.json({ message: 'Class uploaded successfully', classId: newClass._id });
            })
            .on('error', (err) => {
                console.error('CSV parsing error:', err);
                res.status(500).json({ error: 'CSV parsing failed' });
            });

    } catch (err) {
        console.error('Upload failed:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};


exports.deleteClassByName = async (req, res) => {
    try {
        const { className } = req.params;

        const deletedClass = await Class.findOneAndDelete({ name: className });

        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json({ message: 'Class deleted successfully' });
    } catch (err) {
        console.error('Delete by name failed:', err);
        res.status(500).json({ error: 'Failed to delete class' });
    }
};

