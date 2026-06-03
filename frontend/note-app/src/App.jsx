import { useEffect, useState } from "react";
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
    if (token) setIsAuthenticated(true);
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
    <div className="min-h-screen">
      <NavBar onLogout={handleLogout} onSearch={handleSearch} />
      <SideBar />
      <main className="px-4 pb-10 pt-40 sm:px-6 md:pt-32 lg:pl-80 lg:pr-8">
        <MainContent searchResults={searchResults} />
      </main>
    </div>
  );
};

export default App;
