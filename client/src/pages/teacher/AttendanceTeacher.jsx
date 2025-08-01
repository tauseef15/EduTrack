import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const MarkAttendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await axios.get(
          "https://edutrack-qldm.onrender.com/api/teacher/classrooms",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const cls = Array.isArray(res.data) ? res.data : res.data.classrooms;
        const options = cls.map((c) => ({
          value: c._id,
          label: c.name,
        }));
        setClassrooms(options);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClassrooms();
  }, [token]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      try {
        const res = await axios.get(
          `https://edutrack-qldm.onrender.com/api/teacher/classroom/${selectedClass.value}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data);
        const initial = {};
        res.data.forEach((s) => (initial[s._id] = "Present"));
        setAttendance(initial);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [selectedClass, token]);

  useEffect(() => {
    setMessage("");
  }, [selectedClass, date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClass) {
      setMessage("❌ Please select a class.");
      return;
    }

    const attendanceList = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId],
    }));

    try {
      await axios.post(
        "https://edutrack-qldm.onrender.com/api/teacher/attendance",
        { classroomId: selectedClass.value, date, attendanceList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to mark attendance.");
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#f97316" : "#fcd34d",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(251, 146, 60, 0.5)" : "none",
      "&:hover": { borderColor: "#f97316" },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#fed7aa" : "white",
      color: "#7c2d12",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#ea580c",
      fontWeight: "500",
    }),
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-6 sm:mb-8 text-center sm:text-left">
        Mark Attendance
      </h2>

      <div className="max-w-full sm:max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-6">
        {/* Class Select */}
        <div>
          <label className="block font-semibold text-orange-600 mb-2 text-sm sm:text-base">
            Select Class
          </label>
          <Select
            styles={customStyles}
            options={classrooms}
            value={selectedClass}
            onChange={setSelectedClass}
            placeholder="Choose a class..."
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block font-semibold text-orange-600 mb-2 text-sm sm:text-base">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-orange-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
          />
        </div>

        {/* Student List */}
        {students.length > 0 && (
          <div className="border border-orange-300 rounded p-4 sm:p-5 bg-orange-50">
            <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-4">
              Student List
            </h3>

            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-orange-200 pb-3"
                >
                  <span className="text-sm sm:text-base text-gray-800 mb-2 sm:mb-0">
                    {student.name} ({student.rollNo})
                  </span>
                  <div className="flex space-x-4">
                    <label className="text-green-700 text-sm sm:text-base">
                      <input
                        type="radio"
                        name={student._id}
                        value="Present"
                        checked={attendance[student._id] === "Present"}
                        onChange={() =>
                          handleStatusChange(student._id, "Present")
                        }
                        className="mr-1 cursor-pointer"
                      />
                      Present
                    </label>
                    <label className="text-red-600 text-sm sm:text-base">
                      <input
                        type="radio"
                        name={student._id}
                        value="Absent"
                        checked={attendance[student._id] === "Absent"}
                        onChange={() =>
                          handleStatusChange(student._id, "Absent")
                        }
                        className="mr-1 cursor-pointer"
                      />
                      Absent
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {students.length > 0 && (
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition w-full sm:w-auto cursor-pointer"
            >
              Submit Attendance
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <p className="text-orange-700 font-medium mt-2 text-center sm:text-left">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
