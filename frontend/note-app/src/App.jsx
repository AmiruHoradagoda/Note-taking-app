import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import MainContent from "./pages/MainContent";
import AuthForms from "./pages/AuthForms";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSearch = async (userId, searchTxt) => {
    if (!searchTxt.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/notes/search?userId=${userId}&searchTxt=${searchTxt}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
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
        <SideBar />
        <main className="flex-1 p-4 transition-all duration-300 lg:ml-60">
          <MainContent searchResults={searchResults} />
        </main>
      </div>
    </div>
  );
};

export default App;
