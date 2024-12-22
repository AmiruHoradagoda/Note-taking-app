import React from "react";
import NoteComponent from "./NoteComponent";

const MainContent = () => {
  return (
    <div className="flex-1 p-4 bg-gray-50">
      <div className="flex items-center p-4 bg-white shadow-md rounded-lg mb-4">
        <input
          type="text"
          placeholder="Take a note..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex items-center space-x-2 ml-4">
          <button className="text-lg">✏️</button>
          <button className="text-lg">📎</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NoteComponent />
        <NoteComponent />
        <NoteComponent />
      </div>
    </div>
  );
};

export default MainContent;
