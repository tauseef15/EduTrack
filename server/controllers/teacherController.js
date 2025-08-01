const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Test = require("../models/testModel");
const Announcement = require("../models/announcementModel");
const Paper = require("../models/paperModel");
const Classroom = require("../models/classroomModel");
const Result = require("../models/resultModel");
const Attendance = require("../models/attendanceModel");
const Notice = require("../models/noticeModel");
const Note = require("../models/noteModel");
const createNotice = require("../utils/createNotice");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// 🔐 Register Teacher
exports.registerTeacher = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existing = await Teacher.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Teacher already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newTeacher.save();
    res
      .status(201)
      .json({
        message: "Teacher registered successfully",
        teacher: newTeacher,
      });
  } catch (error) {
    res.status(500).json({ message: "Error registering teacher", error });
  }
};

// 🔐 Login Teacher
exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: teacher._id, role: "teacher" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email: safeEmail } = teacher;
    res.status(200).json({
      token,
      teacher: { id: _id, name, email: safeEmail },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// 👤 View Teacher Profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { name, phone, email, address, description } = req.body;

    teacher.name = name || teacher.name;
    teacher.phone = phone || teacher.phone;
    teacher.email = email || teacher.email;
    teacher.address = address || teacher.address;
    teacher.description = description || teacher.description;

    if (req.file && req.file.path) {
      teacher.dpUrl = req.file.path; // Cloudinary URL
    }

    await teacher.save();

    res.json({
      message: "Profile updated",
      teacher: {
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address,
        description: teacher.description,
        dpUrl: teacher.dpUrl,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// 🏫 Create Classroom
exports.createClassroom = async (req, res) => {
  const { name, code, description } = req.body;

  try {
    const existing = await Classroom.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Class code already in use." });

    const classroom = new Classroom({
      name,
      code,
      description,
      teacher: req.user.id,
    });
    await classroom.save();

    res
      .status(201)
      .json({ message: "Classroom created successfully", classroom });
  } catch (error) {
    res.status(500).json({ message: "Failed to create classroom", error });
  }
};

// 📚 Get All Classrooms by Teacher
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.user.id }).populate(
      "students",
      "_id"
    );
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};

// ❌ Delete Classroom
exports.deleteClassroom = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid classroom ID" });
  }

  try {
    const classroom = await Classroom.findById(id);
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });

    await classroom.deleteOne();
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 👥 Get Student List for Classroom
exports.studentList = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate(
      "students",
      "-password" // include all fields except password
    );
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json(classroom.students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error });
  }
};

// 📝 Upload Test
exports.uploadTest = async (req, res) => {
  const {
    title,
    subject,
    description,
    classroomIds,
    testDate,
    totalMarks,
    testUrl,
  } = req.body;

  if (
    !title ||
    !subject ||
    !description ||
    !classroomIds ||
    !testDate ||
    !totalMarks ||
    !testUrl
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const createdTests = [];
    const classroomNames = [];

    for (const classroomId of classroomIds) {
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) continue;

      const newTest = await Test.create({
        title,
        subject,
        description,
        className: classroom.name,
        classroomId,
        testDate,
        totalMarks,
        testUrl,
        uploadedBy: req.user.id,
      });

      createdTests.push(newTest);
      classroomNames.push(classroom.name);
    }

    if (createdTests.length === 0) {
      return res.status(404).json({ message: "No valid classrooms found." });
    }

    // Create the notice before sending response
    const classList = classroomNames.join(", ");
    await createNotice(req.user.id, `Uploaded test "${title}" for ${classList}`);

    res.status(201).json({
      message: "Test(s) uploaded successfully",
      tests: createdTests,
    });
  } catch (error) {
    console.error("Test upload failed:", error);
    res
      .status(500)
      .json({ message: "Failed to upload tests", error: error.message });
  }
};

exports.getUploadedTests = async (req, res) => {
  try {
    const tests = await Test.find({ uploadedBy: req.user._id })
      .select("title subject description testDate totalMarks testUrl uploadedAt")
      .sort({ uploadedAt: -1 });

    res.status(200).json(tests);
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};
// controllers/teacherController.js
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting test" });
  }
};

// 📄 Upload Paper
exports.uploadPaper = async (req, res) => {
  const { fileUrl } = req.body;

  try {
    const paper = new Paper({
      test: req.params.testId,
      fileUrl,
      uploadedBy: req.user.id,
    });

    await paper.save();
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload paper", error });
  }
};

// 📈 View Results of a Class
exports.viewClassResults = async (req, res) => {
  const { className } = req.params;

  try {
    const students = await Student.find({ class: className }).populate({
      path: "results.test",
      select: "title subject testDate",
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching class results", error });
  }
};

// 📌 Post Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, classroomId, expiresInHours } = req.body;

    if (!title || !message || !classroomId || !expiresInHours) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (classroomId === "all") {
      // Fetch all classrooms created by this teacher
      const classrooms = await Classroom.find({ teacher: req.user.id });

      const announcements = classrooms.map((classroom) => ({
        title,
        message,
        classroom: classroom._id,
        expiresInHours,
      }));

      await Announcement.insertMany(announcements);

      return res
        .status(201)
        .json({ message: "Announcements created for all classrooms." });
    }

    // Single classroom case
    const classroomExists = await Classroom.findById(classroomId);
    if (!classroomExists) {
      return res.status(404).json({ message: "Classroom not found." });
    }

    const newAnnouncement = new Announcement({
      title,
      message,
      classroom: classroomId,
      expiresInHours,
    });

    await newAnnouncement.save();

    res.status(201).json({ message: "Announcement created successfully." });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.getTeacherAnnouncements = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.user.id });

    const classroomIds = classrooms.map((cls) => cls._id);

    const announcements = await Announcement.find({
      classroom: { $in: classroomIds },
    })
      .populate("classroom", "name") // Optional: to show classroom name
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error("Error fetching teacher announcements:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    const classroom = await Classroom.findById(announcement.classroom);
    if (!classroom || classroom.teacher.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this announcement." });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Announcement deleted." });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all tests by teacher
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({
      uploadedBy: req.user._id,
    })
      .select("title subject classroomId") // include classroomId
      .populate("classroomId", "name"); // populate only 'name' field from Classroom

    res.json(tests);
  } catch (err) {
    console.error("❌ Failed to fetch tests:", err);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};
// Get students and their results (if any) for a test
exports.getStudentsOfTest = async (req, res) => {
  try {
    const testId = req.params.testId;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const students = await Student.find({ classrooms: test.classroomId });

    const results = await Result.find({ testId });

    const studentResults = {};
    results.forEach((r) => {
      studentResults[r.studentId] = r.marksObtained;
    });

    res.status(200).json({
      students,
      totalMarks: test.totalMarks,
      studentResults,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Upload or update results
const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

exports.uploadResultsForTest = async (req, res) => {
  const { testId } = req.params;
  const { results } = req.body;

  if (!results || !Array.isArray(results))
    return res.status(400).json({ message: "Results array is required" });

  try {
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    for (const result of results) {
      const { studentId, marksObtained, totalMarks } = result;
      const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
      const grade = calculateGrade(percentage);

      // Remove previous result (if any)
      await Student.findByIdAndUpdate(
        studentId,
        { $pull: { results: { test: testId } } },
        { new: true }
      );

      // Add new result
      await Student.findByIdAndUpdate(
        studentId,
        {
          $push: {
            results: {
              test: testId,
              marksObtained,
              totalMarks,
              percentage,
              grade,
            },
          },
        },
        { new: true }
      );
    }

    // ✅ Mark test as result uploaded
    await Test.findByIdAndUpdate(testId, {
      isResultUploaded: true,
      uploadedAt: new Date(),
    });

    // ✅ Create a notice before sending response
    await createNotice(req.user.id, `Uploaded results for test "${test.title}"`);

    res.status(200).json({ message: "Results uploaded successfully" });
  } catch (err) {
    console.error("Error uploading results:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.markAttendance = async (req, res) => {
  const { classroomId, attendanceList, date } = req.body;
  const attendanceDate = new Date(date);

  if (!classroomId || !attendanceList || !Array.isArray(attendanceList)) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom || classroom.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const bulkOps = attendanceList.map((entry) => ({
      updateOne: {
        filter: { studentId: entry.studentId, date: attendanceDate },
        update: {
          studentId: entry.studentId,
          classroomId,
          date: attendanceDate,
          status: entry.status,
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error" });
  }``
};

exports.getAttendanceByDate = async (req, res) => {
  const { classroomId, date } = req.query;

  try {
    const attendanceRecords = await Attendance.find({
      classroomId,
      date: new Date(date),
    }).populate("studentId", "name rollNo");

    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTeacherNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ teacherId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5); // only latest 5
    res.status(200).json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error.message);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
};


exports.uploadNote = async (req, res) => {
  const { title, description, noteUrl, classroomId, subject  } = req.body;

  if (!title || !noteUrl || !classroomId || !subject)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom || classroom.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized or invalid class" });

    const note = new Note({
      title,
      description,
      noteUrl,
      classroomId,
      subject ,
      uploadedBy: req.user.id,
    });

    await note.save();
    res.status(201).json({ message: "Note uploaded", note });
  } catch (error) {
    res.status(500).json({ message: "Error uploading note", error });
  }
};

exports.getNotesByTeacher = async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id })
      .populate("classroomId", "name")
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
};