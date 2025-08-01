const express = require('express');
const app = express();
const PORT = 3000;
const connectDB = require('./config/conn');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classroomRoutes = require('./routes/classroomRoutes');

connectDB();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
 