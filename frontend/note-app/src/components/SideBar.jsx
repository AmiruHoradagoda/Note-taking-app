import { useState } from "react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button - Fixed to the left side */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 z-30 p-2 text-white bg-yellow-500 rounded-r-lg top-20 hover:bg-yellow-600 focus:outline-none"
      >
        {isOpen ? "◀" : "▶"}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-16 h-full bg-gray-100 p-4 shadow-md transition-all duration-300 ease-in-out z-20 ${
          isOpen ? "w-60" : "w-0 -translate-x-full"
        }`}
      >
        {/* Sidebar Content */}
        <div
          className={`${
            isOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <button className="flex items-center w-full gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-200">
            <span>📝</span> Notes
          </button>
          <button className="flex items-center w-full gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-200">
            <span>⏰</span> Reminders
          </button>
          <button className="flex items-center w-full gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-200">
            <span>🏷️</span> Edit Labels
          </button>
          <button className="flex items-center w-full gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-200">
            <span>📦</span> Archive
          </button>
          <button className="flex items-center w-full gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-200">
            <span>🗑️</span> Trash
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
