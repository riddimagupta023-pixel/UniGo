const CommunityPost = require("../models/CommunityPost");

// Get all community posts
const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "name course")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch community posts",
    });
  }
};

// Create a post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content is required",
      });
    }

    const post = await CommunityPost.create({
      content: content.trim(),
      author: req.user.id,
    });

    const populatedPost = await post.populate(
      "author",
      "name course"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create post",
    });
  }
};

// Like / unlike a post
const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await post.populate(
      "author",
      "name course"
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Unable to update like",
    });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You can only delete your own post",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete post",
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  toggleLike,
  deletePost,
};