const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
require("module-alias/register");

dotenv.config({ path: path.join(__dirname, "dotenv/config.env") });

const app = express();
const PORT = process.env.PORT || 3000;

const dbConnection = require("@/db_connection/db");
dbConnection();

// Import Routes
const eventRoutes = require("@/routes/eventRoutes");
const classRoutes = require("@/routes/classRoutes");
const attendanceRoutes = require("@/routes/AttendanceRoutes");



// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
}));

// app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/events", eventRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
    res.send("hi");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
