import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  PlusCircle,
  ListOrdered,
  BookOpen,
  Megaphone,
  Home,
  BarChart3,
  CheckSquare,
  StickyNote,
} from "lucide-react";

const menuItems = [
  { name: "Home", icon: <Home size={20} />, path: "/teacher" },
  { name: "Create", icon: <PlusCircle size={20} />, path: "/teacher/create" },
  { name: "Classrooms", icon: <ListOrdered size={20} />, path: "/teacher/classrooms" },
  { name: "Attendance", icon: <CheckSquare  size={20} />, path: "/teacher/attendance" },
  { name: "Tests", icon: <BookOpen size={20} />, path: "/teacher/upload-test" },
  { name: "Results", icon: <BarChart3 size={20} />, path: "/teacher/upload-result" },
  { name: "Notes", icon: <StickyNote size={20} />, path: "/teacher/notes" },
  { name: "Announcements", icon: <Megaphone size={20} />, path: "/teacher/announcements" },
  { name: "Profile", icon: <User size={20} />, path: "/teacher/profile" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      {/* Sidebar for md and up */}
      <div className="hidden lg:block w-64 min-h-screen p-4">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
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

      
    </>
  );
};

export default Sidebar;
