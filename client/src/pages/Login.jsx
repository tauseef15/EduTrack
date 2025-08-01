import React, { useState } from "react";
import axios from "axios";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
          ? "http://localhost:3000/api/student/login"
          : "http://localhost:3000/api/teacher/login";

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
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-white">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Log in to your account
        </h2>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button className="w-full sm:w-1/2 border rounded p-2 flex items-center justify-center font-semibold gap-2 hover:bg-gray-100">
            <FaApple /> Continue with Apple
          </button>
          <button className="w-full sm:w-1/2 bg-orange-600 text-white border rounded p-2 flex items-center justify-center font-semibold gap-2 hover:bg-orange-500">
            <span className="bg-white p-1 rounded-full">
              <FcGoogle />
            </span>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center justify-center mb-4">
          <hr className="flex-grow border-t" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-t" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Role selector */}
          <div className="flex gap-4 items-center justify-center mb-2 text-sm sm:text-base">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={handleRoleChange}
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
              />
              Teacher
            </label>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/choose-signup" className="text-orange-600 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
