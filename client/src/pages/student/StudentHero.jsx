import React from "react";
import Navbar from "../../components/student/StudentNavbar";
import Sidebar from "../../components/student/StudentSidebar";
import { Outlet } from "react-router-dom";

const TeacherHero = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-54px)]"> {/* Adjust if your Navbar height ≠ 64px */}
        <Sidebar />
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-orange-100 p-2 md:p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default TeacherHero;
