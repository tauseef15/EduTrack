const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  // Personal Details
  profilePicture: String,
  dob: String,
  gender: String,
  phone: String,
  address: String,
  placeOfBirth: String,
  aadhaar: String,
  bloodGroup: String,
  nationality: String,

  class: String,
  classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
  enrolledSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  results: [
    {
      test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
      marksObtained: Number,
      totalMarks: Number,
      percentage: Number,
      grade: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
