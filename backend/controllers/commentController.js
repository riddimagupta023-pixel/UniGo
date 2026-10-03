const Comment = require("../models/Comment");

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("author", "name course")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Unable to fetch comments",
    });
  }
};

// Create a comment
const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      post: req.params.postId,
      author: req.user.id,
    });

    const populatedComment = await comment.populate(
      "author",
      "name course"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      message: "Unable to create comment",
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const loggedInUserId = String(req.user.id);
    const commentAuthorId = String(comment.author);

    // Admin can delete any comment
    if (req.user.role === "admin") {
      await comment.deleteOne();

      return res.json({
        message: "Comment deleted successfully",
      });
    }

    // Student can delete only their own comment
    if (loggedInUserId !== commentAuthorId) {
      return res.status(403).json({
        message: "You can only delete your own comment",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Unable to delete comment",
    });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};