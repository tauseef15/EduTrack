// GET /api/classrooms/:code
const Classroom = require("../models/classroomModel");

exports.getClassroomByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const classroom = await Classroom.findOne({ code });
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    res.status(200).json({ classroom });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
