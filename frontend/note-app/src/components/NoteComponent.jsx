import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import CreatableReactSelect from "react-select/creatable";

// Utility function to generate a color based on the tag name
const generateTagColor = (tag) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-gray-500",
  ];
  // Generate a consistent index for the color based on the tag name
  const index =
    tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

const NoteComponent = ({ note, onNoteUpdate, onNoteDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState(
    note.tags.map((tag) => ({ label: tag, value: tag }))
  );

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/api/v1/notes/${note.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editedNote.title,
            content: editedNote.content,
            userId: editedNote.userId,
            tags: selectedTags.map((tag) => tag.value),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();
      onNoteUpdate(updatedNote);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("Failed to update note");
      console.error("Update error:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(
          `http://localhost:5050/api/v1/notes/${note.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        onNoteDelete(note.id);
      } catch (err) {
        setError("Failed to delete note");
        console.error("Delete error:", err);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <input
          type="text"
          value={editedNote.title}
          onChange={(e) =>
            setEditedNote({ ...editedNote, title: e.target.value })
          }
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Note Title"
        />
        <textarea
          value={editedNote.content}
          onChange={(e) =>
            setEditedNote({ ...editedNote, content: e.target.value })
          }
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
          placeholder="Note content..."
        />
        <CreatableReactSelect
          isMulti
          className="w-full mb-2"
          placeholder="Add Tags"
          value={selectedTags}
          onChange={setSelectedTags}
          classNamePrefix="select"
        />
        <div className="flex justify-end mt-2 space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold">{note.title}</h4>
        <div className="mt-2">
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-sm text-white rounded-full ${generateTagColor(
                    tag
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-gray-600">{note.content}</p>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-500 transition-colors hover:text-blue-600"
          title="Edit note"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 transition-colors hover:text-red-600"
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default NoteComponent;
