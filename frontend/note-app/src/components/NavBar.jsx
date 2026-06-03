import { useEffect, useState } from "react";
import { BookOpen, LogOut, Search } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { apiFetch, getUserId } from "../utils/api";

const NavBar = ({ onLogout, onSearch }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const userData = await apiFetch(`/users/${userId}`);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch?.(getUserId(), query);
  };

  const initials = (user?.username || "Student")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-fit items-center gap-3 lg:w-64">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight">LecKeep</p>
            <p className="hidden text-xs text-muted-foreground sm:block">Lecture notes library</p>
          </div>
        </div>

        <div className="relative hidden max-w-2xl flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search notes, subjects, or tags..."
            className="pl-10"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              {initials}
            </div>
            <span className="max-w-32 truncate text-sm font-semibold">
              {user?.username || "Student"}
            </span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onLogout}>
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 pb-3 md:hidden">
        <div className="relative pt-3">
          <Search className="absolute left-3 top-[1.65rem] h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search notes..."
            className="pl-10"
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
