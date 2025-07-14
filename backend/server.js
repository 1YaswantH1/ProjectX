const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require('express-session');
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
const authRoutes = require("@/routes/AuthRoutes")
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

app.use("/api/events", eventRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
