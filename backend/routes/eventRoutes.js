const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} = require("@/controllers/eventController");
const isAuthenticated = require('@/middlewares/auth');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router.post("/", isAuthenticated, upload.single("image"), createEvent);
router.get("/", getAllEvents);
router.delete("/:id", isAuthenticated, deleteEvent);
router.put("/:id", isAuthenticated, updateEvent);

module.exports = router;
