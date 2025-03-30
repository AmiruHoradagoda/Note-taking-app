import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import MainContent from "./pages/MainContent";
import AuthForms from "./pages/AuthForms";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally verify token expiration here or check if it's valid
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // Clear token on logout
  };

  const handleSearch = async (userId, searchTxt) => {
    if (!searchTxt.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/api/v1/notes/search?userId=${userId}&searchTxt=${searchTxt}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Search failed with status: " + response.status);
      }
      const data = await response.json();
      setSearchResults(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Search failed: " + error.message);
      console.error("Search failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthForms
        onLoginSuccess={handleAuthSuccess}
        onRegisterSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar onLogout={handleLogout} onSearch={handleSearch} />
      <div className="flex flex-1 pt-16">
        <main className="flex-1 p-4 transition-all duration-300">
          {error && <div className="text-red-600">{error}</div>}
          <MainContent searchResults={searchResults} />
        </main>
      </div>
    </div>
  );
};

export default App;