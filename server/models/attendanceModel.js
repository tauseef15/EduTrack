// models/attendanceModel.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
});

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true }); // prevent duplicate entries

module.exports = mongoose.model("Attendance", attendanceSchema);
