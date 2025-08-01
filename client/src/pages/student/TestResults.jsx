import React, { useEffect, useState } from "react";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const validResults = results.filter((res) => res.test !== null);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/student/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResults(data.results);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">Results</h2>
      {loading ? (
        <p className="text-gray-600 italic">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 italic">No results available yet.</p>
      ) : (
        <div className="space-y-4 max-w-6xl mx-auto ">
          {validResults.length === 0 ? (
            <p className="text-gray-500 italic">No results available yet.</p>
          ) : (
            <div className="space-y-4">
              {validResults.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow border flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-semibold">{res.test.title}</p>
                    <p className="text-sm text-gray-600">{res.test.subject}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(res.test.testDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Marks: {res.marksObtained}/{res.totalMarks}
                    </p>
                    <p className="text-sm">
                      Percentage: {parseFloat(res.percentage).toFixed(2)}%
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      Grade: {res.grade}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
