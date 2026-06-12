import { useEffect, useState } from "react";
import NavBar from "../components/layout/NavBar";
import SideBar from "../components/layout/SideBar";
import AuthForms from "../features/auth/AuthForms";
import MainContent from "../features/workspace/MainContent";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../lib/apiClient";

const App = () => {
  const { isAuthenticated, markAuthenticated, logout } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const openAddNote = () => setActiveSection("add");
    window.addEventListener("leckeeper:navigate-add", openAddNote);
    return () => window.removeEventListener("leckeeper:navigate-add", openAddNote);
  }, []);

  const handleLogout = () => {
    logout();
    setSearchResults(null);
    setActiveSection("dashboard");
  };

  const handleSearch = async (_userId, searchTxt) => {
    if (!searchTxt.trim()) {
      setSearchResults(null);
      return;
    }

    setActiveSection("notes");

    try {
      const response = await apiFetch("/search", {
        params: {
          q: searchTxt,
          scope: "all",
        },
      });
      const data = response?.data ?? response;
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthForms
        onLoginSuccess={markAuthenticated}
        onRegisterSuccess={markAuthenticated}
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


