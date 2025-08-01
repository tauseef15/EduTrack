import React, { useState } from "react";
import axios from "axios";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const TeacherSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/teacher/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "teacher");
      navigate("/teacher");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Sign up to register as a teacher
        </h2>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <button className="flex-1 border rounded p-2 flex items-center justify-center font-semibold gap-2 hover:bg-gray-100 text-sm sm:text-base">
            <FaApple /> Continue with Apple
          </button>
          <button className="flex-1 bg-orange-600 text-white border rounded p-2 flex items-center justify-center font-semibold gap-2 hover:bg-orange-500 text-sm sm:text-base">
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
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500 text-sm sm:text-base"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500 text-sm sm:text-base"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (8+ characters)"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500 text-sm sm:text-base"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-orange-500 text-sm sm:text-base"
          />

          <div className="flex items-start gap-2 text-sm mt-2">
            <input type="checkbox" className="mt-1" />
            <span>Send me tips and updates about teaching tools.</span>
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
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition text-sm sm:text-base"
          >
            Create my account
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="#" className="text-orange-600 underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default TeacherSignup;
