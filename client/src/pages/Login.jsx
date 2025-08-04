import React, { useState } from "react";
import axios from "axios";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      role === "student"
        ? "https://edutrack-qldm.onrender.com/api/student/login"
        : "https://edutrack-qldm.onrender.com/api/teacher/login";

    try {
      const res = await axios.post(endpoint, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", role);
      navigate(role === "student" ? "/student" : "/teacher");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="absolute top-5 left-6 flex items-center text-orange-600 font-bold text-lg">
        EduTrack
      </div>
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-xl">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your EduTrack account
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex justify-center gap-6 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={handleRoleChange}
                className="accent-orange-600"
              />
              Student
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={handleRoleChange}
                className="accent-orange-600"
              />
              Teacher
            </label>
          </div>

          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Password Field */}
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Forgot password */}
          <div className="text-right">
            <a href="#" className="text-sm text-orange-600 hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md text-sm hover:bg-orange-700 transition"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/choose-signup" className="text-orange-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
