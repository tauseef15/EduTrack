const express = require("express");
const router = express.Router();
const { verifyTeacher } = require("../middleware/authMiddleware");
const {
  uploadTest,
  uploadPaper,
  getAllTests,
  getStudentsOfTest,
  uploadResultsForTest,
  viewClassResults,
  deleteClassroom,
} = require("../controllers/teacherController");
const {
  loginTeacher,
  getProfile,
  registerTeacher,
  createClassroom,
  getAllClassrooms,
  studentList,
  createAnnouncement,
  deleteAnnouncement,
  getTeacherAnnouncements,
  getUploadedTests,
  deleteTest,
  markAttendance,
  getAttendanceByDate,
  getTeacherNotices,
  updateProfile,
  uploadNote,
  getNotesByTeacher,
  deleteNote
} = require("../controllers/teacherController");
const upload = require("../middleware/upload");
const { verify } = require("jsonwebtoken");
// Auth
router.post("/login", loginTeacher);
router.post("/signup", registerTeacher);
// Dashboard
router.get("/profile", verifyTeacher, getProfile);
router.put("/profile", verifyTeacher, upload.single("dp"), updateProfile);


router.post("/create-classroom", verifyTeacher, createClassroom);
router.get("/classrooms", verifyTeacher, getAllClassrooms);
// routes/teacher.js or similar
router.delete("/classroom/:id", verifyTeacher, deleteClassroom);
router.get("/classroom/:id/students", verifyTeacher, studentList);

router.post("/create-announcement", verifyTeacher, createAnnouncement);
router.get("/announcements", verifyTeacher, getTeacherAnnouncements);

// ✅ Delete an announcement
router.delete("/announcements/:id", verifyTeacher, deleteAnnouncement);
// Upload test & result
router.post("/upload-test", verifyTeacher, uploadTest);
router.get("/uploaded-tests", verifyTeacher, getUploadedTests);
router.delete("/test/:testId", verifyTeacher, deleteTest);

router.get("/tests", verifyTeacher, getAllTests);
router.get("/tests/:testId/students", verifyTeacher, getStudentsOfTest);
router.post("/tests/:testId/results", verifyTeacher, uploadResultsForTest);

// Upload papers
router.post("/upload-paper/:testId", verifyTeacher, uploadPaper);

// View class results
router.get("/class/:className/results", verifyTeacher, viewClassResults);

router.post("/attendance", verifyTeacher, markAttendance);
router.get("/attendance", verifyTeacher, getAttendanceByDate);
router.get("/notice", verifyTeacher, getTeacherNotices);


router.post("/upload-note", verifyTeacher, uploadNote);
router.get("/notes", verifyTeacher, getNotesByTeacher);
router.delete("/notes/:id", verifyTeacher, deleteNote);
module.exports = router;
