const Complaint = require("../models/Complaint");

// GET ALL COMPLAINTS
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("submittedBy", "name email course")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching complaints",
    });
  }
};

// GET MY COMPLAINTS
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      submittedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching your complaints",
    });
  }
};

// CREATE COMPLAINT
const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      submittedBy: req.user.id,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while submitting complaint",
    });
  }
};

// UPDATE COMPLAINT STATUS - ADMIN
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    await complaint.save();

    res.json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating complaint",
    });
  }
};

// DELETE COMPLAINT
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      complaint.submittedBy.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only delete your own complaint",
      });
    }

    await complaint.deleteOne();

    res.json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting complaint",
    });
  }
};

module.exports = {
  getComplaints,
  getMyComplaints,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
};