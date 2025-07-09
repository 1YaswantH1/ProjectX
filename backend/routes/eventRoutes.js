const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, deleteEvent } = require("@/controllers/eventController");

router.post("/", createEvent);
router.get("/", getAllEvents);
router.delete("/:id", deleteEvent);

module.exports = router;
