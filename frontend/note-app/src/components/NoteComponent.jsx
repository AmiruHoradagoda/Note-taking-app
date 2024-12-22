import React from "react";

const NoteComponent = () => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h4 className="font-bold text-lg">Note Title</h4>
      <p className="text-gray-600">Note content goes here...</p>
      <div className="flex justify-end space-x-2 mt-2">
        <button className="text-gray-500 hover:text-gray-700">✏️</button>
        <button className="text-gray-500 hover:text-gray-700">🗑</button>
      </div>
    </div>
  );
};

export default NoteComponent;
