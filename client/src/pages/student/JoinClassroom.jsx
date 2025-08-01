import React, { useState } from "react";
import axios from "axios";

const JoinClassroom = () => {
  const [classCode, setClassCode] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [classroom, setClassroom] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setMessage("");
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/classrooms/${classCode}`
      );
      setClassroom(response.data.classroom);
    } catch (err) {
      setClassroom(null);
      setError("Classroom not found");
    }
  };

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/api/student/join-classroom`,
        { rollNo, classCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join classroom");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 w-full">
        Join Classroom
      </h2>
      <div className="flex justify-center items-center mt-6">
        <div className="w-full max-w-6xl space-y-4 mt-10 sm:mt-16 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-orange-200">
          <input
            type="text"
            placeholder="Enter Class Code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            onClick={handleSearch}
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Search Classroom
          </button>

          {error && <p className="text-red-600 text-center">{error}</p>}
          {message && <p className="text-green-600 text-center">{message}</p>}

          {classroom && (
            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="text-lg sm:text-xl font-semibold">
                {classroom.name}
              </h3>
              <p className="text-sm text-gray-600">{classroom.description}</p>

              <input
                type="text"
                placeholder="Enter your Roll No"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="mt-4 w-full p-2 border border-gray-300 rounded-md"
                required
              />

              <button
                onClick={handleJoin}
                className="mt-3 w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
              >
                Join Classroom
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinClassroom;
