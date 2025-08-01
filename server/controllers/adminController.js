const Admin = require('../models/adminmodel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Test = require('../models/testModel');
const Paper = require('../models/paperModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 🔐 Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

// 👤 Get Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// 🧑‍🏫 Register a New Teacher
exports.registerTeacher = async (req, res) => {
  const { name, email, password, subject } = req.body;

  try {
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Teacher already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      subject
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully', newTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error registering teacher', error });
  }
};

// 🧑‍🎓 Register a New Student
exports.registerStudent = async (req, res) => {
  const { name, email, password, className } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Student already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      class: className
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully', newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error });
  }
};

// 📚 View All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
};

// 🎓 View All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// 📄 View All Tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate('teacher', 'name subject');
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error });
  }
};

// 📂 View All Uploaded Papers
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find()
      .populate('test', 'title subject')
      .populate('uploadedBy', 'name');
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching papers', error });
  }
};

// ❌ Delete a Student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

// ❌ Delete a Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.teacherId);
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error });
  }
};
