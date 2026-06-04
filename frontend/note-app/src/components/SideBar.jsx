import { useState } from "react";
import {
  BookOpen,
  FileText,
  Grid3X3,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "notes", label: "My Notes", Icon: FileText },
  { id: "add", label: "Add Note", Icon: Plus },
  { id: "groups", label: "Groups", Icon: Users },
  { id: "subjects", label: "Subjects", Icon: Grid3X3 },
  { id: "settings", label: "Settings", Icon: Settings },
];

const SideBar = ({ activeSection, onSectionChange, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (sectionId) => {
    onSectionChange?.(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-white p-2 shadow-sm lg:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex w-64 flex-col border-r border-border bg-[#f4f4f5] px-6 py-7 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center gap-3">
          <BookOpen className="text-primary" size={28} />
          <span className="text-xl font-extrabold tracking-tight">LecKeep</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ id, label, Icon }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-white"
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-muted"
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default SideBar;
