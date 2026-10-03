const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

// Students and admins can view announcements
router.get("/", authMiddleware, getAnnouncements);

// Only admins can create announcements
router.post("/", authMiddleware, adminMiddleware, createAnnouncement);

// Only admins can update announcements
router.put("/:id", authMiddleware, adminMiddleware, updateAnnouncement);

// Only admins can delete announcements
router.delete("/:id", authMiddleware, adminMiddleware, deleteAnnouncement);

module.exports = router;