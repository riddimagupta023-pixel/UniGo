const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// Get comments for a post
router.get(
  "/post/:postId",
  authMiddleware,
  getComments
);

// Add a comment to a post
router.post(
  "/post/:postId",
  authMiddleware,
  createComment
);

// Delete a comment
router.delete(
  "/:id",
  authMiddleware,
  deleteComment
);

module.exports = router;