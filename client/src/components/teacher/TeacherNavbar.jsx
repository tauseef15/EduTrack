import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
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
  {
    name: "Classrooms",
    icon: <ListOrdered size={20} />,
    path: "/teacher/classrooms",
  },
  {
    name: "Attendance",
    icon: <CheckSquare size={20} />,
    path: "/teacher/attendance",
  },
  { name: "Tests", icon: <BookOpen size={20} />, path: "/teacher/upload-test" },
  {
    name: "Results",
    icon: <BarChart3 size={20} />,
    path: "/teacher/upload-result",
  },
  { name: "Notes", icon: <StickyNote size={20} />, path: "/teacher/notes" },
  {
    name: "Announcements",
    icon: <Megaphone size={20} />,
    path: "/teacher/announcements",
  },
  { name: "Profile", icon: <User size={20} />, path: "/teacher/profile" },
];

const TeacherNavbar = () => {
  const [teacher, setTeacher] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!token) return;
      try {
        const res = await fetch("https://edutrack-qldm.onrender.com/api/teacher/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTeacher(data);
        } else {
          console.error("Failed to fetch teacher");
        }
      } catch (err) {
        console.error("Error fetching teacher:", err);
      }
    };

    fetchTeacher();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Top Navbar */}
      <nav className="px-2 sm:px-6 md:px-4 lg:px-6 py-2 bg-white flex justify-between items-center w-full shadow z-20">
        <div className="text-lg sm:text-xl font-bold tracking-wide text-orange-600">
          EduTrack
        </div>

        {/* Desktop Profile */}
        <div
          className="hidden lg:flex items-center gap-3 relative"
          ref={profileRef}
        >
          {token && teacher ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                {teacher.name}
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

          {profileDropdownOpen && (
            <div className="absolute top-10 right-5 mt-2 w-40 bg-white border rounded shadow-md z-50">
              <Link
                to="/teacher/profile"
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
            className=" text-orange-600 hover:bg-orange-100 rounded-md"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div
          ref={dropdownRef}
          className="lg:hidden absolute top-[100%] left-0 w-full bg-white shadow-md z-10"
        >
          <nav className="flex flex-col gap-1 px-2 py-2">
            {menuItems.map((item, index) => (
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

export default TeacherNavbar;
