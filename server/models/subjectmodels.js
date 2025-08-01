const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema({
  name: String, // e.g., "Math", "Science"
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
