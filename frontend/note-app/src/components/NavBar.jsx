import React, { useState, useEffect } from "react";

const NavBar = ({ onLogout, onSearch }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(`/api/v1/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const userId = localStorage.getItem("userId");
    onSearch(userId, query);
  };

  const handleLogout = async () => {
    try {
      const username = user?.username;
      if (username) {
        await fetch(`/api/v1/auth/logout?username=${username}`, {
          method: "POST",
        });
      }
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gray-100 shadow">
      <div className="text-xl font-bold text-yellow-600">NoteApp</div>
      <div className="flex-1 max-w-xl mx-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search notes..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
