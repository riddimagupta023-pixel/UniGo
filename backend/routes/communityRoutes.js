const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPosts,
  createPost,
  toggleLike,
  deletePost,
} = require("../controllers/communityController");

const router = express.Router();

// Get all community posts
router.get("/", authMiddleware, getPosts);

// Create a post
router.post("/", authMiddleware, createPost);

// Like / unlike a post
router.put("/:id/like", authMiddleware, toggleLike);

// Delete a post
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;