import { useState } from "react";
import {
  Archive,
  Bell,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
  Trash2,
} from "lucide-react";

const menuItems = [
  { label: "Notes", Icon: FileText },
  { label: "Reminders", Icon: Bell },
  { label: "Edit Labels", Icon: Tag },
  { label: "Archive", Icon: Archive },
  { label: "Trash", Icon: Trash2 },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ToggleIcon = isOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-0 z-30 p-2 text-white bg-yellow-500 rounded-r-lg top-20 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <ToggleIcon size={20} />
      </button>

      <aside
        className={`fixed left-0 top-16 h-full bg-gray-100 p-4 shadow-md transition-all duration-300 ease-in-out z-20 ${
          isOpen ? "w-60" : "w-0 -translate-x-full"
        }`}
      >
        <div
          className={`space-y-1 ${
            isOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          {menuItems.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center w-full gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-200"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default SideBar;
