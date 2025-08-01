import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactSelect from "react-select";
import { FaTrashAlt } from "react-icons/fa";

const UploadMaterial = () => {
  const [testData, setTestData] = useState({
    title: "",
    subject: "",
    description: "",
    classroomIds: [],
    testDate: "",
    totalMarks: "",
    testUrl: "",
  });
  const [classrooms, setClassrooms] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [showTests, setShowTests] = useState(false);
  const token = localStorage.getItem("token");

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: state.isFocused ? "#f97316" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 2px #f97316" : null,
      "&:hover": {
        borderColor: "#f97316",
      },
      minHeight: "40px",
      fontSize: "14px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#f97316"
        : state.isFocused
        ? "#fcd9b6"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      "&:hover": {
        backgroundColor: "#fcd9b6",
      },
      fontSize: "14px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#f97316",
      color: "white",
      borderRadius: "4px",
      padding: "2px 4px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#ea580c",
        color: "white",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };



  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/teacher/classrooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassrooms(response.data);
      } catch (err) {
        console.error("Error fetching classrooms", err);
      }
    };
    fetchClassrooms();
  }, [token]);

  const handleTestUpload = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/teacher/upload-test",
        testData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestData({
        title: "",
        subject: "",
        description: "",
        classroomIds: [],
        testDate: "",
        totalMarks: "",
        testUrl: "",
      });
    } catch (err) {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteTest = async (testId) => {
    try {
      await axios.delete(`http://localhost:3000/api/teacher/test/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTests((prev) => prev.filter((test) => test._id !== testId));
    } catch (err) {
      console.error("Error deleting test:", err);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/teacher/tests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllTests(response.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    }
  };

  const toggleShowTests = () => {
    if (!showTests) fetchTests();
    setShowTests(!showTests);
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-3 sm:mb-4 text-center sm:text-left">
        Upload Test
      </h2>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleTestUpload}
          className="w-full max-w-6xl bg-white border border-orange-200 p-4 sm:p-6 rounded-xl shadow-md"
        >
          <div className="flex flex-col gap-4">
            {[
              { label: "Title", name: "title", type: "text" },
              { label: "Subject", name: "subject", type: "text" },
              { label: "Description", name: "description", type: "text" },
              { label: "Test Date", name: "testDate", type: "date" },
              { label: "Total Marks", name: "totalMarks", type: "number" },
              { label: "Test URL", name: "testUrl", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label className="text-orange-700 font-medium mb-1 text-sm sm:text-base">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={testData[name]}
                  onChange={handleChange}
                  required
                  className="border border-orange-300 rounded-md p-2 text-sm focus:outline-orange-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-orange-700 font-medium mb-1 text-sm sm:text-base">
              Select Classrooms:
            </label>
            <ReactSelect
              isMulti
              styles={customStyles}
              options={classrooms.map((cls) => ({
                value: cls._id,
                label: cls.name,
              }))}
              value={testData.classroomIds
                .map((id) => {
                  const classroom = classrooms.find((cls) => cls._id === id);
                  return classroom
                    ? { value: classroom._id, label: classroom.name }
                    : null;
                })
                .filter(Boolean)}
              onChange={(selectedOptions) => {
                const selectedIds = selectedOptions.map(
                  (option) => option.value
                );
                setTestData({ ...testData, classroomIds: selectedIds });
              }}
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-orange-600 text-white px-5 py-2 rounded-md hover:bg-orange-700 text-sm sm:text-base cursor-pointer"
          >
            Submit Test
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={toggleShowTests}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base cursor-pointer"
        >
          {showTests ? "Hide Uploaded Tests" : "Show Uploaded Tests"}
        </button>

        {showTests && (
          <div className="w-full max-w-4xl mt-8 space-y-4">
            {allTests.map((test) => (
              <div
                key={test._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start border border-orange-200 rounded-xl bg-white p-4 sm:p-6 shadow-md"
              >
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    {test.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {test.subject}{" "}
                    <span className="italic text-gray-500">
                      {test.description}
                    </span>
                  </p>
                  <p className="mt-2 font-semibold text-gray-800 text-sm">
                    Total Marks:{" "}
                    <span className="font-normal">{test.totalMarks}</span>
                  </p>

                  {test.testUrl && (
                    <a
                      href={test.testUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 font-semibold mt-1 inline-block hover:underline text-sm cursor-pointer"
                    >
                      Open Test
                    </a>
                  )}
                </div>

                <div className="flex flex-row sm:flex-col justify-between items-center gap-3">
                  <p className="text-sm text-gray-600">
                    {test.testDate
                      ? new Date(test.testDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "No Date"}
                  </p>

                  <FaTrashAlt
                    onClick={() => handleDeleteTest(test._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      
      </div>
    </div>
  );
};

export default UploadMaterial;
