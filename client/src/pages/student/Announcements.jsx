import React, { useEffect, useState } from "react";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          "https://edutrack-qldm.onrender.com/api/student/announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setAnnouncements(data); // ✅ must be array
        } else {
          console.error("Server error:", data.message);
          setAnnouncements([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setAnnouncements([]);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading)
    return (
      <p className="text-center text-sm sm:text-base md:text-lg text-gray-600">
        Loading...
      </p>
    );

  if (announcements.length === 0) {
    return (
      <p className="text-center text-sm sm:text-base md:text-lg text-gray-600">
        No active announcements.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 w-full">
        Announcements
      </h2>
      <div className="space-y-4 max-w-6xl mx-auto">
        {announcements.map((a) => {
          const createdAt = new Date(a.createdAt);
          return (
            <div
              key={a._id}
              className="border p-3 rounded shadow-sm bg-white text-sm sm:text-base"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold mb-1 text-orange-600">
                  {a.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {createdAt.toLocaleString()}
                </p>
              </div>
              <p className="text-gray-700">{a.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
