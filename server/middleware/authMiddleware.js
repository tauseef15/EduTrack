const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
// const Admin = require('../models/adminModel'); // Optional, only if needed

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const extractToken = (req) => req.headers.authorization?.split(' ')[1];

// 🧑‍🎓 Verify Student
exports.verifyStudent = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(403).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized: Not a student' });
    }

    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    req.user = student;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// 👨‍🏫 Verify Teacher
exports.verifyTeacher = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(403).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'teacher') {
      return res.status(401).json({ message: 'Unauthorized: Not a teacher' });
    }

    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    req.user = teacher;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// 🧑‍💼 Verify Admin (optional)
exports.verifyAdmin = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(403).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Not an admin' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.user = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
