import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import CreatableReactSelect from "react-select/creatable";

const MainContent = ({ searchResults }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    userId: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchNotes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:8080/api/v1/notes/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      // Ensure each note has all required properties
      const sanitizedNotes = data.map((note) => ({
        id: note?.id || "",
        title: note?.title || "",
        content: note?.content || "",
        createdAt: note?.createdAt || new Date().toISOString(),
        userId: note?.userId || "",
        tags: Array.isArray(note?.tags) ? note.tags : [],
      }));
      setNotes(sanitizedNotes);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchResults) {
      // Apply the same sanitization to search results
      const sanitizedResults = searchResults.map((note) => ({
        id: note?.id || "",
        title: note?.title || "",
        content: note?.content || "",
        createdAt: note?.createdAt || new Date().toISOString(),
        userId: note?.userId || "",
        tags: Array.isArray(note?.tags) ? note.tags : [],
      }));
      setNotes(sanitizedResults);
    } else {
      fetchNotes();
    }
  }, [searchResults]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:8080/api/v1/notes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newNote,
          userId,
          tags: selectedTags.map((tag) => tag.value),
        }),
      });
      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }
      if (!response.ok) throw new Error("Failed to create note");
      const data = await response.json();
      // Sanitize the new note data
      const sanitizedNote = {
        id: data?.id || "",
        title: data?.title || "",
        content: data?.content || "",
        createdAt: data?.createdAt || new Date().toISOString(),
        userId: data?.userId || "",
        tags: Array.isArray(data?.tags) ? data.tags : [],
      };
      setNotes((prev) => [...prev, sanitizedNote]);
      setNewNote({
        title: "",
        content: "",
        userId: "",
      });
      setSelectedTags([]);
    } catch (err) {
      console.error("Create error:", err);
      setError("Failed to create note");
    }
  };

  const handleUpdateNote = async (noteId) => {
    if (!noteId || !editingNote) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/notes/${noteId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(editingNote),
        }
      );
      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }
      if (!response.ok) throw new Error("Failed to update note");
      const data = await response.json();
      // Sanitize the updated note data
      const sanitizedNote = {
        id: data?.id || noteId,
        title: data?.title || editingNote.title || "",
        content: data?.content || editingNote.content || "",
        createdAt: data?.createdAt || new Date().toISOString(),
        userId: data?.userId || editingNote.userId || "",
        tags: Array.isArray(data?.tags) ? data.tags : [],
      };
      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? sanitizedNote : note))
      );
      setEditingNote(null);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/notes/${noteId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }
      if (!response.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete note");
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
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
                setNewNote((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
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
              setNewNote((prev) => ({
                ...prev,
                content: e.target.value,
              }))
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
        {Array.isArray(notes) &&
          notes.map((note) => (
            <div
              key={note?.id || Math.random()}
              className="relative p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              {editingNote?.id === note?.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateNote(note.id);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={editingNote.title || ""}
                    onChange={(e) =>
                      setEditingNote((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <textarea
                    value={editingNote.content || ""}
                    onChange={(e) =>
                      setEditingNote((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="4"
                    required
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
                      className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    {note?.title || "Untitled"}
                  </h3>
                  <p className="mb-4 text-gray-600 whitespace-pre-wrap">
                    {note?.content || ""}
                  </p>
                  {Array.isArray(note?.tags) && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 rounded-b-lg bg-gray-50">
                    <span className="text-sm text-gray-500">
                      {formatDate(note?.createdAt)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="p-2 text-gray-600 transition-colors rounded-full hover:text-blue-600 hover:bg-gray-100"
                        title="Edit note"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note?.id)}
                        className="p-2 text-gray-600 transition-colors rounded-full hover:text-red-600 hover:bg-gray-100"
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
