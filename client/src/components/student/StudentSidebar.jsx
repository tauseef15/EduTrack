import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  BookOpen,
  BookMarked,
  BarChart3,
  Megaphone,
  Home,
  CheckSquare,
  StickyNote,
} from "lucide-react";

const studentMenuItems = [
  { name: "Home", icon: <Home size={20} />, path: "/student" },
  { name: "Join Classroom", icon: <BookMarked size={20} />, path: "/student/joined-classrooms" },
  { name: "Attendance", icon: <CheckSquare size={20} />, path: "/student/attendance" },
  { name: "Tests", icon: <BookOpen size={20} />, path: "/student/tests" },
  { name: "Results", icon: <BarChart3 size={20} />, path: "/student/results" },
  { name: "Announcements", icon: <Megaphone size={20} />, path: "/student/announcements" },
  { name: "Notes", icon: <StickyNote size={20} />, path: "/student/notes" },
  { name: "Profile", icon: <User size={20} />, path: "/student/profile" },
];

const StudentSidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:block w-64 min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        {studentMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-md text-sm transition-colors ${
              location.pathname === item.path
                ? "bg-orange-100 text-orange-600 font-semibold"
                : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default StudentSidebar;
