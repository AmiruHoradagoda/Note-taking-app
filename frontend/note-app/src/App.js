
import './App.css';
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import MainContent from "./components/MainContent";

const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
      <SideBar />
      <MainContent />
      </div>
    </div>
    );
};

export default App;