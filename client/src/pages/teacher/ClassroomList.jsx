import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDialog, setShowStudentDialog] = useState(false);

  const fetchClassrooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://edutrack-qldm.onrender.com/api/teacher/classrooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClassrooms(response.data);
    } catch (error) {
      console.error("Failed to fetch classrooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const confirmDelete = (id) => {
    setSelectedClassroomId(id);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://edutrack-qldm.onrender.com/api/teacher/classroom/${selectedClassroomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClassrooms((prev) =>
        prev.filter((c) => c._id !== selectedClassroomId)
      );
      setShowDialog(false);
      setSelectedClassroomId(null);
    } catch (error) {
      console.error("Failed to delete classroom", error);
      alert("Something went wrong while deleting the classroom.");
    }
  };

  const openClassroom = async (classroom) => {
    setSelectedClassroom(classroom);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://edutrack-qldm.onrender.com/api/teacher/classroom/${classroom._id}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const handleBack = () => {
    setSelectedClassroom(null);
    setStudents([]);
  };

  const openStudentDialog = (student) => {
    setSelectedStudent(student);
    setShowStudentDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-orange-500 font-semibold animate-pulse text-lg sm:text-xl">
          Loading classrooms...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
          {selectedClassroom ? "Students" : "Your Classrooms"}
        </h2>
         <button
            onClick={handleBack}
            className=" bg-orange-100 text-orange-700 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-md border hover:bg-orange-200 transition cursor-pointer"
          >
            ← Back
          </button>
      </div>

      {selectedClassroom ? (
        <div>
          {students.length === 0 ? (
            <p className="text-gray-600">
              No students found in this classroom.
            </p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      Name: {student.name}
                    </p>
                    <p className="text-gray-600">Roll No: {student.rollNo}</p>
                  </div>
                  <button
                    onClick={() => openStudentDialog(student)}
                    className="text-sm text-orange-600 border border-orange-300 px-3 py-1 rounded-md hover:bg-orange-100 transition cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : classrooms.length === 0 ? (
        <p className="text-center text-gray-600 mt-24 text-sm sm:text-base">
          No classrooms found.
        </p>
      ) : (
        <div className="mt-5 grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <div
              key={classroom._id}
              onClick={() => openClassroom(classroom)}
              className="relative bg-white rounded-xl p-2 sm:p-4 border border-orange-200 shadow-sm hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(classroom._id);
                }}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
                title="Delete classroom"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <h3 className="text-lg sm:text-xl font-semibold text-orange-700 mb-2">
                {classroom.name}
              </h3>
              <p className="text-gray-800 text-sm sm:text-base mb-2 italic">
                {classroom.description || "No description provided."}
              </p>
              <p className="text-gray-700 text-sm sm:text-base mb-1">
                <span className="font-medium">Code:</span> {classroom.code}
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-medium">Students:</span>{" "}
                {classroom.students?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this classroom? This action cannot
              be undone.
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDialog(false)}
                className="w-full py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDialog && selectedStudent && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <h3 className="text-xl font-bold text-orange-600 mb-4">
              Student Details
            </h3>
            <div className="space-y-2 text-sm sm:text-base text-gray-800">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedStudent.name}
              </p>
              <p>
                <span className="font-semibold">Roll No:</span>{" "}
                {selectedStudent.rollNo}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedStudent.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedStudent.phone || "N/A"}
              </p>
              <p>
                <span className="font-semibold">DOB:</span>{" "}
                {selectedStudent.dob || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {selectedStudent.gender || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {selectedStudent.address || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Nationality:</span>{" "}
                {selectedStudent.nationality || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Blood Group:</span>{" "}
                {selectedStudent.bloodGroup || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Aadhaar:</span>{" "}
                {selectedStudent.aadhaar || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Place of Birth:</span>{" "}
                {selectedStudent.placeOfBirth || "N/A"}
              </p>
            </div>

            <button
              onClick={() => setShowStudentDialog(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassroomList;
