const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Students and admins can view events
router.get("/", authMiddleware, getEvents);

// Only admins can create events
router.post("/", authMiddleware, adminMiddleware, createEvent);

// Only admins can update events
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);

// Only admins can delete events
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;