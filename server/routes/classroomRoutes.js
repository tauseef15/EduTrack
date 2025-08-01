const express = require("express");
const router = express.Router();
const { getClassroomByCode } = require("../controllers/classroomController");

// GET /api/classrooms/:code
router.get("/:code", getClassroomByCode);

module.exports = router;
