import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import MainContent from "./pages/MainContent";
import AuthForms from "./pages/AuthForms";
import { apiFetch, clearAuth, getUserId } from "./utils/api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeSection, setActiveSection] = useState("subjects");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearAuth();
    setSearchResults(null);
    setActiveSection("subjects");
    setIsAuthenticated(false);
  };

  const handleSearch = async (userId, searchTxt) => {
    if (!searchTxt.trim()) {
      setSearchResults(null);
      return;
    }

    setActiveSection("notes");

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
    <div className="min-h-screen bg-white">
      <NavBar onSearch={handleSearch} />
      <SideBar activeSection={activeSection} onSectionChange={setActiveSection} onLogout={handleLogout} />
      <main className="px-6 pb-10 pt-28 lg:ml-64 lg:px-8">
        <MainContent activeSection={activeSection} searchResults={searchResults} />
      </main>
    </div>
  );
};

export default App;
