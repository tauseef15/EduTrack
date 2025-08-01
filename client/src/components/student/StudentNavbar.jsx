import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
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
  {
    name: "Join Classroom",
    icon: <BookMarked size={20} />,
    path: "/student/joined-classrooms",
  },
  {
    name: "Attendance",
    icon: <CheckSquare size={20} />,
    path: "/student/attendance",
  },
  { name: "Tests", icon: <BookOpen size={20} />, path: "/student/tests" },
  { name: "Results", icon: <BarChart3 size={20} />, path: "/student/results" },
  {
    name: "Announcements",
    icon: <Megaphone size={20} />,
    path: "/student/announcements",
  },
  { name: "Notes", icon: <StickyNote size={20} />, path: "/student/notes" },
  { name: "Profile", icon: <User size={20} />, path: "/student/profile" },
];

const StudentNavbar = () => {
  const [student, setStudent] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/student/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        } else {
          console.error("Failed to fetch student");
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchStudent();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close profile dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Top Navbar */}
      <nav className="px-2 sm:px-4 lg:px-6 py-2 bg-white flex justify-between items-center w-full shadow z-20">
        <div className="text-lg sm:text-xl font-bold tracking-wide text-orange-600">
          EduTrack
        </div>

        {/* Profile / Login for large screens */}
        {/* Profile / Login for large screens */}
        <div
          className="hidden lg:flex items-center gap-3 relative"
          ref={dropdownRef}
        >
          {token && student ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                {student.name}
              </span>
              <div
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer text-orange-600 hover:bg-orange-100 transition border-2 border-orange-500"
              >
                <User size={24} />
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 transition"
            >
              Login
            </button>
          )}

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute top-10 right-5 mt-2 w-40 bg-white border rounded shadow-md z-50">
              <Link
                to="/student/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-orange-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-orange-600 hover:bg-orange-100 rounded-md"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-white shadow-md z-10">
          <nav className="flex flex-col gap-1 px-2 py-2">
            {studentMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === item.path
                    ? "bg-orange-100 text-orange-600 font-semibold"
                    : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="text-left text-red-500 hover:bg-gray-100 px-3 py-2 text-sm rounded-md"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default StudentNavbar;
