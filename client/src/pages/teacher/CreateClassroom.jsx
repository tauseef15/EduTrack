import React, { useState } from "react";
import axios from "axios";

const CreateClassroom = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/teacher/create-classroom",
        { name, code, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setCode("");
      setDescription("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create classroom");
    }
  };

  return (
    <div>
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-6 sm:mb-8 text-center sm:text-left">
        Create a New Classroom
      </h2>
      <div className="flex justify-center items-center mt-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full sm:w-4/5 md:w-4/5 lg:w-1/2 border border-orange-200 mt-28"
        >
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">
              Classroom Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Eg. Physics 101"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={description}
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Eg. Introduction to Classical Mechanics"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Classroom Code
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={code}
              name="code"
              onChange={(e) => setCode(e.target.value)}
              placeholder="Eg. PHY101"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white text-lg font-semibold px-6 py-3 rounded-lg w-full hover:bg-orange-600 transition-all duration-300 cursor-pointer"
          >
            Create Classroom
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClassroom;
