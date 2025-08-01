const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// 🟢 Admin Login
router.post('/login', adminController.loginAdmin);

// 👤 Admin Profile
router.get('/profile', verifyAdmin, adminController.getProfile);

// 🧑‍🎓 Manage Students
router.get('/students', verifyAdmin, adminController.getAllStudents);
router.post('/students', verifyAdmin, adminController.registerStudent);
router.delete('/students/:studentId', verifyAdmin, adminController.deleteStudent);

// 🧑‍🏫 Manage Teachers
router.get('/teachers', verifyAdmin, adminController.getAllTeachers);
router.post('/teachers', verifyAdmin, adminController.registerTeacher);
router.delete('/teachers/:teacherId', verifyAdmin, adminController.deleteTeacher);

// 📚 Manage Tests
router.get('/tests', verifyAdmin, adminController.getAllTests);

// 📄 Manage Papers
router.get('/papers', verifyAdmin, adminController.getAllPapers);

module.exports = router;
