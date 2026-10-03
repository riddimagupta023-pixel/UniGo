const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getLostFound,
  createLostFound,
  updateLostFound,
  deleteLostFound,
} = require("../controllers/lostFoundController");

const router = express.Router();

// All logged-in users can view posts
router.get("/", authMiddleware, getLostFound);

// Logged-in users can create posts
router.post("/", authMiddleware, createLostFound);

// Users can update their own posts
router.put("/:id", authMiddleware, updateLostFound);

// Users can delete their own posts
router.delete("/:id", authMiddleware, deleteLostFound);

module.exports = router;