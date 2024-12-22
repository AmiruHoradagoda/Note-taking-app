import React from "react";

const SideBar = () => {
  return (
    <div className="w-60 bg-gray-100 p-4 shadow-md">
      <button className="w-full py-2 text-left hover:bg-gray-200 rounded-lg">
        Notes
      </button>
      <button className="w-full py-2 text-left hover:bg-gray-200 rounded-lg">
        Reminders
      </button>
      <button className="w-full py-2 text-left hover:bg-gray-200 rounded-lg">
        Edit Labels
      </button>
      <button className="w-full py-2 text-left hover:bg-gray-200 rounded-lg">
        Archive
      </button>
      <button className="w-full py-2 text-left hover:bg-gray-200 rounded-lg">
        Trash
      </button>
    </div>
  );
};

export default SideBar;
