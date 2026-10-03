const Announcement = require("../models/Announcement");

// GET ALL ANNOUNCEMENTS
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching announcements",
    });
  }
};

// CREATE ANNOUNCEMENT
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      content,
      category,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while creating announcement",
    });
  }
};

// UPDATE ANNOUNCEMENT
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.category = category || announcement.category;

    await announcement.save();

    res.json({
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating announcement",
    });
  }
};

// DELETE ANNOUNCEMENT
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();

    res.json({
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting announcement",
    });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};