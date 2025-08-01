import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const StudentSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/student/signup",
        form
      );
      localStorage.setItem("token", res.data.token); // Optional
      localStorage.setItem("role", "student");
      navigate("/student");
    } catch (err) {8
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          Sign up to register as a student
        </h2>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button className="flex-1 border rounded p-2 flex items-center justify-center font-semibold gap-2 hover:bg-gray-100 transition">
            <FaApple />{" "}
            <span className="hidden sm:inline">Continue with Apple</span>
          </button>
          <button className="flex-1 bg-orange-600 text-white border rounded p-2 flex items-center justify-center font-semibold gap-2 hover:bg-orange-500 transition">
            <span className="bg-white p-1 rounded-full">
              <FcGoogle />
            </span>
            <span className="hidden sm:inline">Continue with Google</span>
          </button>
        </div>

        <div className="flex items-center justify-center mb-4">
          <hr className="flex-grow border-t" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-t" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500"
          />

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
            placeholder="Password (8+ characters)"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500"
          />

          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500"
          />

          <div className="flex items-start gap-2 text-sm mt-2">
            <input type="checkbox" className="mt-1" />
            <span>Send me tips and updates about student features.</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            <span>
              I agree to the{" "}
              <a href="#" className="text-orange-600 underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-orange-600 underline">
                Privacy Policy
              </a>
              .
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
          >
            Create my account
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;
