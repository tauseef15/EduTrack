import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const CreateAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expiresInHours, setExpiresInHours] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClassrooms();
    fetchAnnouncements();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/teacher/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClassrooms(data);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/teacher/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/teacher/announcements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchAnnouncements();
      } else {
        console.error("Failed to delete announcement");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/teacher/create-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message, classroomId, expiresInHours }),
      });

      if (res.ok) {
        setTitle("");
        setMessage("");
        setExpiresInHours("");
        setClassroomId("");
        fetchAnnouncements();
      } else {
        console.error("Failed to create announcement");
      }
    } catch (err) {
      console.error("Error creating announcement:", err);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-600">Create Announcement</h2>

      <div className="max-w-6xl mx-auto mt-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-5 bg-white p-4 sm:p-6 rounded-lg shadow-md"
        >
          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">Classroom:</label>
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            >
              <option value="">-- Select Classroom --</option>
              <option value="all">All Classrooms</option>
              {classrooms.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">Title:</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">Message:</label>
            <textarea
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">
              Expires in (Hours):
            </label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
              value={expiresInHours}
              onChange={(e) => setExpiresInHours(e.target.value)}
              required
              min="1"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base"
          >
            Submit
          </button>
        </form>

        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-orange-600">
          Your Announcements
        </h2>

        {announcements.length === 0 ? (
          <p className="text-gray-600">No announcements created yet.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann) => {
              const createdAt = new Date(ann.createdAt);
              const expiryDate = new Date(
                createdAt.getTime() + ann.expiresInHours * 60 * 60 * 1000
              );
              const isExpired = new Date() > expiryDate;

              return (
                <div
                  key={ann._id}
                  className="border p-4 rounded shadow-sm bg-gray-50 relative"
                >
                  <h3 className="text-base sm:text-lg font-bold">{ann.title}</h3>
                  <p className="text-gray-700 text-sm sm:text-base">{ann.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Classroom: {ann.classroom?.name || "Unknown"} | Expires:{" "}
                    {expiryDate.toLocaleString()}{" "}
                    {isExpired && (
                      <span className="text-red-600 font-semibold ml-2">(Expired)</span>
                    )}
                  </p>
                  <FaTrashAlt
                    onClick={() => handleDelete(ann._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer text-lg absolute top-3 right-3"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAnnouncement;
