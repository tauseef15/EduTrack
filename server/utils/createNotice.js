const Notice = require("../models/noticeModel");

const createNotice = async (teacherId, message) => {
  try {
    await Notice.create({ teacherId, message });
  } catch (error) {
    console.error("Failed to create notice:", error.message);
  }
};

module.exports = createNotice;
