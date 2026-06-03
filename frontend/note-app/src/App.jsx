import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import MainContent from "./pages/MainContent";
import AuthForms from "./pages/AuthForms";
import { apiFetch, clearAuth, getUserId } from "./utils/api";

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
    clearAuth();
    setSearchResults(null);
    setIsAuthenticated(false);
  };

  const handleSearch = async (userId, searchTxt) => {
    if (!searchTxt.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const data = await apiFetch("/notes/search", {
        params: {
          userId: userId || getUserId(),
          searchTxt,
        },
      });
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
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
