import { useState } from "react";
import {
  Archive,
  Bell,
  FileText,
  Menu,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "./ui/Badge";

const menuItems = [
  { label: "All Notes", Icon: FileText, active: true },
  { label: "Add Note", Icon: Plus },
  { label: "Subjects", Icon: Tag },
  { label: "Reminders", Icon: Bell },
  { label: "Archive", Icon: Archive },
  { label: "Trash", Icon: Trash2 },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-4 top-24 z-40 rounded-xl border border-border bg-card p-2 text-foreground shadow-sm lg:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed bottom-0 left-0 top-20 z-30 w-72 border-r border-border/80 bg-card/90 p-5 shadow-soft backdrop-blur-xl transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="text-sm font-medium opacity-80">Study workspace</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Lecture Notes</h2>
          <p className="mt-2 text-sm opacity-85">Keep PDFs, short summaries, and tags in one place.</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ label, Icon, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => setIsOpen(false)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </span>
              {active && <Badge variant="outline">Now</Badge>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-dashed border-border bg-background/70 p-4">
          <p className="text-sm font-semibold">PDF storage status</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload UI is ready. Backend file upload endpoint is still required for persistence.
          </p>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default SideBar;
