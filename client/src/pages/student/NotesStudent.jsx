import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, FileText } from "lucide-react"; // icons (optional)

function NotesStudent() {
  const [notesBySubject, setNotesBySubject] = useState({});
  const [openSubject, setOpenSubject] = useState(null);

  useEffect(() => {
    axios
      .get("https://edutrack-qldm.onrender.com/api/student/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setNotesBySubject(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch notes");
      });
  }, []);

  const toggleSubject = (subject) => {
    setOpenSubject((prev) => (prev === subject ? null : subject));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-orange-600">Notes</h2>
      <div className="space-y-4 max-w-6xl mx-auto">
        {Object.entries(notesBySubject).map(([subject, notes]) => (
          <div
            key={subject}
            className="mb-3 border rounded-md shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleSubject(subject)}
              className="w-full flex items-center justify-between px-2 md:px-4 py-1 md:py-3 bg-orange-100 hover:bg-orange-200 text-orange-800 font-medium text-lg transition"
            >
              <span className="flex items-center gap-2">
                {openSubject === subject ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                {subject}
              </span>
            </button>

            {openSubject === subject && (
              <div className="px-2 md:px-4 py-3 bg-white space-y-4 border-t">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="p-2 md:p-4 rounded-md border bg-gray-50 hover:shadow transition"
                  >
                    <div className="flex items-center gap-1 md:gap-3 mb-2">
                      <FileText className="w-3 md:w-5 h-3 md:h-5 text-orange-600" />
                      <h4 className="font-semibold text-sm md:text-lg text-gray-800">
                        {note.title}
                      </h4>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs md:text-sm text-gray-600 mb-2">
                        {note.description || "No description provided."}
                      </p>
                      <a
                        href={note.noteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-xs md:text-sm font-medium text-blue-600 hover:underline"
                      >
                        View Note
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesStudent;
