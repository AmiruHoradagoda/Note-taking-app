import { useState, useEffect } from "react";

const MainContent = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    labels: [],
    color: "#ffffff",
    isArchived: false,
    isPinned: false,
  });

  const fetchNotes = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Assuming you store userId after login
      const response = await fetch(
        `http://localhost:8080/api/notes/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newNote,
          userId: localStorage.getItem("userId"),
        }),
      });
      if (!response.ok) throw new Error("Failed to create note");
      const data = await response.json();
      setNotes((prev) => [...prev, data]);
      setNewNote({
        title: "",
        content: "",
        labels: [],
        color: "#ffffff",
        isArchived: false,
        isPinned: false,
      });
    } catch (err) {
      setError("Failed to create note");
    }
  };

  const handleUpdateNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingNote),
        }
      );
      if (!response.ok) throw new Error("Failed to update note");
      const updatedNote = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? updatedNote : note))
      );
      setEditingNote(null);
    } catch (err) {
      setError("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 p-6">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {error && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Create Note Form */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleCreateNote} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) =>
              setNewNote((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            placeholder="Take a note..."
            value={newNote.content}
            onChange={(e) =>
              setNewNote((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Create Note
            </button>
          </div>
        </form>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-lg shadow-md"
            style={{ backgroundColor: note.color }}
          >
            {editingNote?.id === note.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateNote(note.id);
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <textarea
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows="3"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="px-3 py-1 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="mb-2 font-semibold">{note.title}</h3>
                <p className="text-sm text-gray-600">{note.content}</p>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
