import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import MainContent from "./pages/MainContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // 'login', 'register', or 'main'

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage("main");
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("main");
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return currentPage === "login" ? (
        <div className="min-h-screen bg-gray-50">
          <LoginPage onLoginSuccess={handleLoginSuccess} />
          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage("register")}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <RegisterPage onRegisterSuccess={handleLoginSuccess} />
          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage("login")}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <NavBar />
        <div className="relative flex-1 pt-16">
          <SideBar />
          <main className="p-4 ml-0 transition-all duration-300 lg:ml-60">
            <MainContent />
          </main>
        </div>
      </>
    );
  };

  return <div className="flex flex-col h-screen">{renderContent()}</div>;
};

export default App;
