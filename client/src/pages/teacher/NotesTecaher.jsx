import React, { useEffect, useState } from "react";
import axios from "axios";

function NotesTeacher() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    noteUrl: "",
    subject: "",
  });

  const [notesBySubject, setNotesBySubject] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://edutrack-qldm.onrender.com/api/teacher/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClassrooms(res.data))
      .catch((err) => console.error(err));

    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios
      .get("https://edutrack-qldm.onrender.com/api/teacher/notes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const grouped = {};
        res.data.forEach((note) => {
          const subject = note.subject || "General";
          if (!grouped[subject]) grouped[subject] = [];
          grouped[subject].push(note);
        });
        setNotesBySubject(grouped);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load notes");
      });
  };

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass) return alert("Please select a class");

    axios
      .post(
        "https://edutrack-qldm.onrender.com/api/teacher/upload-note",
        { ...noteData, classroomId: selectedClass },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Note uploaded successfully");
        setNoteData({ title: "", description: "", noteUrl: "", subject: "" });
        setSelectedClass("");
        fetchNotes();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to upload note");
      });
  };

  const toggleSubject = (subject) => {
    setOpenSubject((prev) => (prev === subject ? null : subject));
  };

  const openDeleteDialog = (noteId) => {
    setNoteToDelete(noteId);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`https://edutrack-qldm.onrender.com/api/teacher/notes/${noteToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setShowDialog(false);
        setNoteToDelete(null);
        fetchNotes();
      })
      .catch((err) => {
        console.error("Failed to delete note:", err);
        alert("Failed to delete note");
      });
  };

  return (
    <div className="relative">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-600 text-center sm:text-left">
        Upload Notes
      </h2>

      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10 bg-white shadow-md p-4 sm:p-6 rounded-lg"
        >
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Classroom</option>
            {classrooms.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          <input
            name="title"
            placeholder="Note Title"
            value={noteData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="subject"
            placeholder="Subject"
            value={noteData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Optional Description"
            value={noteData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="noteUrl"
            placeholder="Note URL (Google Drive, PDF, etc.)"
            value={noteData.noteUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="bg-orange-500 text-white cursor-pointer py-2 px-4 rounded hover:bg-orange-600 w-full"
          >
            Upload Note
          </button>
        </form>

        <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-4">
          Your Notes
        </h3>

        {Object.entries(notesBySubject).length === 0 ? (
          <p className="text-gray-600 italic">No notes uploaded yet.</p>
        ) : (
          Object.entries(notesBySubject).map(([subject, notes]) => (
            <div key={subject} className="mb-4 border rounded overflow-hidden">
              <button
                onClick={() => toggleSubject(subject)}
                className="w-full text-left cursor-pointer p-3 sm:p-4 bg-orange-100 hover:bg-orange-200 font-semibold text-orange-700 transition-colors"
              >
                {openSubject === subject ? "▼" : "▶"} {subject}
              </button>

              {openSubject === subject && (
                <div className="p-3 sm:p-4 bg-white space-y-3 border-t">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-3 border rounded shadow-sm bg-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {note.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {note.description || "No description"}
                          </p>
                        </div>

                        <div className="flex gap-3 items-center">
                          <button
                            href={note.noteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm underline cursor-pointer"
                          >
                            View Note
                          </button>
                          <button
                            onClick={() => openDeleteDialog(note._id)}
                            className="text-red-600 text-sm hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-md z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesTeacher;
