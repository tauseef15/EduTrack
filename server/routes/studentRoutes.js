const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = require('../middleware/upload');
const { verifyStudent } = require("../middleware/authMiddleware");
const {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile,
  joinClassroom,
  getTestsForClassroom,
  getResults,
  getPaperByTest,
  getAnnouncements,
  getStudentAttendance,
  getFullAttendance,
  getNotes,
} = require("../controllers/studentController");

// Auth
router.post("/signup", registerStudent);
router.post("/login", loginStudent);

// Profile
router.get("/profile", verifyStudent, getProfile);
router.put("/profile", verifyStudent, upload.single("dp"), updateProfile);

// Classroom
router.post("/join-classroom", verifyStudent, joinClassroom);

// Tests & Results
router.get("/tests", verifyStudent, getTestsForClassroom);
router.get("/results", verifyStudent, getResults);
router.get("/paper/:testId", verifyStudent, getPaperByTest);

// Announcements
router.get("/announcements", verifyStudent, getAnnouncements);

// Attendance
router.get("/attendance", verifyStudent, getStudentAttendance);
router.get("/attendance/all", verifyStudent, getFullAttendance);

router.get("/notes", verifyStudent, getNotes);
module.exports = router;
