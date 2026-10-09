const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getComplaints,
  getMyComplaints,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

const router = express.Router();

// Student: view own complaints
router.get("/my", authMiddleware, getMyComplaints);

// Admin/Student: view all complaints
router.get("/", authMiddleware, getComplaints);

// Student: submit complaint
router.post("/", authMiddleware, createComplaint);

// Admin: update complaint status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateComplaintStatus
);

// Delete complaint
router.delete("/:id", authMiddleware, deleteComplaint);

module.exports = router;