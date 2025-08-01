import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

const Results = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [totalMarks, setTotalMarks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("https://edutrack-qldm.onrender.com/api/teacher/tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTests(data);
      } catch (err) {
        console.error("Error fetching tests:", err);
      }
    };
    fetchTests();
  }, []);

  useEffect(() => {
    if (!selectedTest) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://edutrack-qldm.onrender.com/api/teacher/tests/${selectedTest}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setStudents(data.students);
        setTotalMarks(data.totalMarks);
        setMarks(data.studentResults || {});
        setAlreadyUploaded(Object.keys(data.studentResults || {}).length > 0);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedTest]);

  const handleMarkChange = (studentId, value) => {
    if (parseFloat(value) > totalMarks) return;
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    const results = students.map((student) => ({
      studentId: student._id,
      marksObtained: parseFloat(marks[student._id]) || 0,
      totalMarks,
    }));

    try {
      const res = await fetch(
        `https://edutrack-qldm.onrender.com/api/teacher/tests/${selectedTest}/results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ results }),
        }
      );

      if (res.ok) {
        setMarks({});
        setSelectedTest("");
        setAlreadyUploaded(false);
      } else {
        console.error("Failed to upload results");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "white",
      borderColor: state.isFocused ? "#f97316" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 2px #f97316" : null,
      "&:hover": { borderColor: "#f97316" },
      minHeight: "42px",
      fontSize: "14px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#f97316"
        : state.isFocused
        ? "#fcd9b6"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      "&:hover": { backgroundColor: "#fcd9b6" },
      fontSize: "14px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="relative">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-3 sm:mb-4 text-center sm:text-left">
        Upload Result
      </h2>

      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full max-w-6xl mt-6 mx-auto">
        <div className="mb-6">
          <label className="block text-gray-700 mb-1 font-medium text-sm sm:text-base">
            Select Test:
          </label>
          <ReactSelect
            styles={selectStyles}
            options={tests.map((test) => ({
              value: test._id,
              label: `${test.title} (${test.subject}) - ${
                test.classroomId?.name || "Unknown Class"
              }`,
            }))}
            value={
              selectedTest
                ? {
                    value: selectedTest,
                    label:
                      tests.find((test) => test._id === selectedTest)?.title +
                      " (" +
                      tests.find((test) => test._id === selectedTest)?.subject +
                      ") - " +
                      (tests.find((test) => test._id === selectedTest)
                        ?.classroomId?.name || "Unknown Class"),
                  }
                : null
            }
            onChange={(selectedOption) => {
              setSelectedTest(selectedOption ? selectedOption.value : "");
            }}
          />
        </div>

        {loading ? (
          <p className="text-gray-600 italic">Loading students...</p>
        ) : (
          selectedTest &&
          (Array.isArray(students) && students.length > 0 ? (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                {alreadyUploaded ? "Edit Marks" : "Enter Marks"} (Out of{" "}
                {totalMarks})
              </h3>
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-50 border p-3 rounded-lg shadow-sm"
                  >
                    <div className="text-gray-800 font-medium text-sm sm:text-base">
                      {student.name}{" "}
                      <span className="text-sm text-gray-500">
                        ({student.rollNo})
                      </span>
                    </div>
                    <input
                      type="number"
                      max={totalMarks}
                      min={0}
                      step="0.1"
                      placeholder="Marks"
                      value={marks[student._id] || ""}
                      onChange={(e) =>
                        handleMarkChange(student._id, e.target.value)
                      }
                      className="w-full sm:w-24 border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={Object.keys(marks).length === 0}
                className={`mt-6 px-5 py-2 cursor-pointer rounded font-medium transition-colors w-full sm:w-auto ${
                  Object.keys(marks).length === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {alreadyUploaded ? "Update Results" : "Submit Results"}
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No students found for this test.
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Results;
