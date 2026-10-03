const LostFound = require("../models/LostFound");

// GET ALL LOST & FOUND POSTS
const getLostFound = async (req, res) => {
  try {
    const posts = await LostFound.find()
      .populate("postedBy", "name email course")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching lost and found posts",
    });
  }
};

// CREATE LOST & FOUND POST
const createLostFound = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      location,
      date,
      contactInfo,
    } = req.body;

    if (
      !title ||
      !description ||
      !type ||
      !location ||
      !date ||
      !contactInfo
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        message: "Type must be either lost or found",
      });
    }

    const post = await LostFound.create({
      title,
      description,
      type,
      location,
      date,
      contactInfo,
      postedBy: req.user.id,
    });

    res.status(201).json({
      message: "Lost and found post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while creating lost and found post",
    });
  }
};

// UPDATE LOST & FOUND POST
const updateLostFound = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Lost and found post not found",
      });
    }

    // Only the person who created the post can update it
    if (post.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only update your own post",
      });
    }

    const {
      title,
      description,
      type,
      location,
      date,
      contactInfo,
      status,
    } = req.body;

    post.title = title || post.title;
    post.description = description || post.description;
    post.type = type || post.type;
    post.location = location || post.location;
    post.date = date || post.date;
    post.contactInfo = contactInfo || post.contactInfo;
    post.status = status || post.status;

    await post.save();

    res.json({
      message: "Lost and found post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating lost and found post",
    });
  }
};

// DELETE LOST & FOUND POST
const deleteLostFound = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Lost and found post not found",
      });
    }

    // Admin can delete any post
    // Student can delete only their own post
    const isOwner =
      post.postedBy.toString() === req.user.id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only delete your own post",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Lost and found post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting lost and found post",
    });
  }
};

module.exports = {
  getLostFound,
  createLostFound,
  updateLostFound,
  deleteLostFound,
};