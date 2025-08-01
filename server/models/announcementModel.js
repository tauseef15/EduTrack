const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresInHours: Number
});

announcementSchema.virtual("expiresAt").get(function () {
  return new Date(this.createdAt.getTime() + this.expiresInHours * 60 * 60 * 1000);
});

module.exports = mongoose.model("Announcement", announcementSchema);
