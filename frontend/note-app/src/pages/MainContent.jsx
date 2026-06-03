import { useCallback, useEffect, useState } from "react";
import CreatableReactSelect from "react-select/creatable";
import NoteComponent from "../components/NoteComponent";
import { apiFetch, getUserId } from "../utils/api";

const sanitizeNote = (note) => ({
  id: note?.id || `temp-${Date.now()}-${Math.random()}`,
  title: note?.title || "",
  content: note?.content || "",
  createdAt: note?.createdAt || new Date().toISOString(),
  userId: note?.userId || "",
  tags: Array.isArray(note?.tags) ? note.tags : [],
});

const sanitizeNotes = (noteList) =>
  Array.isArray(noteList) ? noteList.map(sanitizeNote) : [];

const MainContent = ({ searchResults }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    tags: "",
    content: "",
    userId: "",
  });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      const data = await apiFetch(`/notes/user/${userId}`);
      setNotes(sanitizeNotes(data));
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchResults) {
      setNotes(sanitizeNotes(searchResults));
      setLoading(false);
    } else {
      fetchNotes();
    }
  }, [fetchNotes, searchResults]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      const data = await apiFetch("/notes", {
        method: "POST",
        body: {
          ...newNote,
          userId,
          tags: (selectedTags || []).map((tag) => tag.value),
        },
      });

      setNotes((prev) => [sanitizeNote(data), ...prev]);
      setNewNote({ title: "", content: "", tags: "", userId: "" });
      setSelectedTags([]);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create note");
      console.error("Create error:", err);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const handleNoteDelete = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 p-6">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {error && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Create Note Form */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Create New Note
        </h2>
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <CreatableReactSelect
              isMulti
              className="w-1/3"
              placeholder="Add Tags"
              value={selectedTags}
              onChange={setSelectedTags}
              classNamePrefix="select"
            />
          </div>
          <textarea
            placeholder="Take a note..."
            value={newNote.content}
            onChange={(e) =>
              setNewNote((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create Note
            </button>
          </div>
        </form>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteComponent
            key={note.id}
            note={note}
            onNoteUpdate={handleNoteUpdate}
            onNoteDelete={handleNoteDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MainContent;
