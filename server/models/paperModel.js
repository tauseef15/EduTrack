const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test"
  },
  fileUrl: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }
});

module.exports = mongoose.model("Paper", paperSchema);
