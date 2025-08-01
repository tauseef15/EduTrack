const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: String,
  className: {
    type: String,
    required: true,
  },
  testDate: {
    type: Date,
    required: true,
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  testUrl: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  isResultUploaded: {
    type: Boolean,
    default: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Test", testSchema);
