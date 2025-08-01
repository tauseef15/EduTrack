const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  dpUrl: {
    type: String, // stores the filename of the profile picture
  },
  uploadedTests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
  ],
  uploadedPapers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
