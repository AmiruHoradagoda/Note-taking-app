import React from "react";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 shadow">
      <div className="text-xl font-bold text-yellow-600">NoteApp</div>
      <input
        type="text"
        placeholder="Search"
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <img
        src="/profile-icon.png"
        alt="Profile"
        className="w-10 h-10 rounded-full"
      />
    </nav>
  );
};

export default NavBar;
