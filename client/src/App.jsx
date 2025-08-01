import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChooseSignup from "./pages/ChooseSignup";
import StudentSignup from "./pages/student/StudentSignup";
import TeacherSignup from "./pages/teacher/TeacherSignup";
import Landing from "./pages/Landing";
import StudentHome from "./pages/student/StudentHome";

// Teacher Sub-Pages
import Home from "./pages/teacher/Home";
import ProfileSummary from "./pages/teacher/ProfileSummary";
import CreateClassroom from "./pages/teacher/CreateClassroom";
import ClassroomList from "./pages/teacher/ClassroomList";
import UploadMaterial from "./pages/teacher/UploadMaterial";
import Results from "./pages/teacher/Results";
import Announcements from "./pages/teacher/Announcements";
import TeacherHero from "./pages/teacher/TeacherHero";

// Student Sub-Pages
import StudentHero from "./pages/student/StudentHero";
import StudentProfile from "./pages/student/Profile";
import JoinedClassrooms from "./pages/student/JoinClassroom";
import Tests from "./pages/student/Tests";
import TestResults from "./pages/student/TestResults";
import StudentAnnouncements from "./pages/student/Announcements";
import AskDoubts from "./pages/student/NotesStudent";
import AttendanceTeacher from "./pages/teacher/AttendanceTeacher";
import AttendanceStudent from "./pages/student/AttendanceStudent";

import PrivateRoute from "./components/PrivateRoute";
import NotesStudent from "./pages/student/NotesStudent";
import NotesTecaher from "./pages/teacher/NotesTecaher";
import ShowAttendance from "./pages/teacher/ShowAttendance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/choose-signup" element={<ChooseSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/signup/teacher" element={<TeacherSignup />} />
        <Route path="/student" element={<StudentHome />} />

        {/* Nested Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <PrivateRoute>
              <TeacherHero />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<ProfileSummary />} />
          <Route path="create" element={<CreateClassroom />} />
          <Route path="classrooms" element={<ClassroomList />} />
          <Route path="attendance" element={<AttendanceTeacher />} />
          <Route path="showattendance" element={<ShowAttendance />} />
          <Route path="upload-test" element={<UploadMaterial />} />
          <Route path="upload-result" element={<Results />} />
          <Route path="notes" element={<NotesTecaher />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        <Route
          path="/student"
          element={
            <PrivateRoute>
              <StudentHero />
            </PrivateRoute>
          }
        >
          <Route index element={<StudentHome />} />
          <Route path="joined-classrooms" element={<JoinedClassrooms />} />
          <Route path="attendance" element={<AttendanceStudent />} />
          <Route path="tests" element={<Tests />} />
          <Route path="results" element={<TestResults />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="notes" element={<NotesStudent />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
