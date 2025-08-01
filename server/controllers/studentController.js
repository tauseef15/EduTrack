const Student = require("../models/studentModel");
const Paper = require("../models/paperModel");
const Classroom = require("../models/classroomModel");
const Test = require("../models/testModel");
const Result = require("../models/resultModel");
const Attendance = require("../models/attendanceModel");
const Announcement = require("../models/announcementModel");
const fs = require("fs");
const Note = require("../models/noteModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// 🔐 Student Registration
exports.registerStudent = async (req, res) => {
  const { name, email, password, rollNo } = req.body;

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      rollNo,
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// 🔐 Student Login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.password) {
      return res.status(400).json({ message: "Password not set. Please register again." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, { expiresIn: "7d" });

    const { _id, name: studentName, email: studentEmail } = student;

    res.status(200).json({
      token,
      student: { id: _id, name: studentName, email: studentEmail },
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// 👤 View Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-password")
      .populate("classrooms", "name"); // Populate only the 'name' field of each classroom

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};


// 📝 Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Log req.file fully
    console.log("req.file:", req.file);

    if (req.file) {
      // Use secure_url if using Cloudinary storage
      const uploadedUrl = req.file.path || req.file.secure_url || req.file.url;
      console.log("Uploaded URL:", uploadedUrl);
      student.profilePicture = uploadedUrl;
    }

    Object.assign(student, {
      title: req.body.title || student.title,
      name: req.body.name || student.name,
      dob: req.body.dob || student.dob,
      gender: req.body.gender || student.gender,
      phone: req.body.phone || student.phone,
      email: req.body.email || student.email,
      placeOfBirth: req.body.placeOfBirth || student.placeOfBirth,
      bloodGroup: req.body.bloodGroup || student.bloodGroup,
      nationality: req.body.nationality || student.nationality,
      aadhaar: req.body.aadhaar || student.aadhaar,
      address: req.body.address || student.address,
    });

    await student.save();

    res.json({
      message: "Profile updated",
      student: {
        title: student.title,
        name: student.name,
        gender: student.gender,
        dob: student.dob,
        phone: student.phone,
        email: student.email,
        placeOfBirth: student.placeOfBirth,
        bloodGroup: student.bloodGroup,
        nationality: student.nationality,
        aadhaar: student.aadhaar,
        address: student.address,
        profilePicture: student.profilePicture,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
      stack: err.stack,
    });
  }
};





// ➕ Join Classroom
exports.joinClassroom = async (req, res) => {
  const { rollNo, classCode } = req.body;

  try {
    const classroom = await Classroom.findOne({ code: classCode });
    if (!classroom) return res.status(404).json({ message: "Classroom not found" });

    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.classrooms.includes(classroom._id)) {
      return res.status(400).json({ message: "Already joined this classroom" });
    }

    student.classrooms.push(classroom._id);
    classroom.students.push(student._id);

    await Promise.all([student.save(), classroom.save()]);

    res.status(200).json({ message: "Successfully joined classroom" });
  } catch (error) {
    console.error("Join classroom error:", error);
    res.status(500).json({ message: "Failed to join classroom" });
  }
};

// 📚 Get All Tests for Joined Classrooms
exports.getTestsForClassroom = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate("classrooms");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const joinedClassNames = student.classrooms.map(c => c.name);

    const tests = await Test.find({
      className: { $in: joinedClassNames },
    }).sort({ testDate: -1 });

    res.status(200).json({ tests });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Failed to fetch tests" });
  }
};

// 📄 Get Uploaded Paper by Test ID
exports.getPaperByTest = async (req, res) => {
  try {
    const paper = await Paper.findOne({ test: req.params.testId });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: "Error fetching paper", error });
  }
};

// 📢 Get Announcements for Joined Classrooms
exports.getAnnouncements = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const announcements = await Announcement.find({
      classroom: { $in: student.classrooms },
    }).sort({ createdAt: -1 });

    const now = new Date();
    const filtered = announcements.filter((a) => {
      const expiresAt = new Date(
        a.createdAt.getTime() + a.expiresInHours * 60 * 60 * 1000
      );
      return expiresAt > now;
    });

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Announcements error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📊 Get Student Results
exports.getResults = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate({
        path: "results.test",
        select: "title subject testDate totalMarks",
      })
      .select("results name rollNo email");

    if (!student) return res.status(404).json({ message: "Student not found" });

    const results = student.results.filter(r => r.test !== null);

    res.status(200).json({ results });
  } catch (error) {
    console.error("Results fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📆 Attendance for Specific Date
exports.getStudentAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      studentId: req.user.id,
      date: { $gte: start, $lte: end },
    }).populate("classroomId", "name");

    res.status(200).json({ attendance });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 Full Attendance
exports.getFullAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.user.id });
    res.status(200).json({ attendance });
  } catch (err) {
    console.error("Full attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 📚 Get Notes for Joined Classrooms
exports.getNotes = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const notes = await Note.find({
      classroomId: { $in: student.classrooms },
    })
      .populate("classroomId", "name")
      .sort({ createdAt: -1 });

    // Group notes by subject
    const notesBySubject = {};
    for (const note of notes) {
      const subject = note.subject || "General";
      if (!notesBySubject[subject]) {
        notesBySubject[subject] = [];
      }
      notesBySubject[subject].push(note);
    }

    res.status(200).json(notesBySubject);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
