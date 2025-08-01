import React, { useEffect, useState } from "react";

const StudentTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/student/tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch tests");

      setTests(data.tests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Your Tests</h1>

      {loading && <p className="text-gray-700">Loading tests...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && tests.length === 0 && (
        <p className="text-gray-600">
          No tests available for your joined classrooms.
        </p>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6">
          {tests.map((test) => (
            <div
              key={test._id}
              className="p-3 md:p-4 lg:p-6 border border-orange-200 rounded-xl shadow bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2 md:mb-3">
                <h2 className="text-md md:text-xl font-bold text-gray-800">
                  {test.title}
                </h2>
                <div className="text-xs md:text-sm text-gray-700">
                  {new Date(test.testDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="flex items-center mb-2 md:mb-3 gap-2 md:gap-3">
                <p className="text-xs md:text-sm text-gray-700 font-medium ">{test.subject}</p>
                <p className="text-xs md:text-sm text-gray-600 italic">{test.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700 mb-1">
                  <strong>Total Marks:</strong> {test.totalMarks}
                </div>

                {test.testUrl && (
                  <a
                    href={test.testUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-orange-600 text-sm md:text-md font-semibold rounded transition"
                  >
                    Open Test
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentTests;
