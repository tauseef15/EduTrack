const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/conn');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Use PORT from .env or fallback to 3000
const PORT = process.env.PORT || 3000;

// Import routes
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classroomRoutes = require('./routes/classroomRoutes');

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
