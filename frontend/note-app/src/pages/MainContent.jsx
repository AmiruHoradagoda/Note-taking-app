import { useCallback, useEffect, useMemo, useState } from "react";
import { BookMarked, FileText, Layers, Plus, Upload, X } from "lucide-react";
import CreatableReactSelect from "react-select/creatable";
import NoteComponent from "../components/NoteComponent";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { apiFetch, getUserId } from "../utils/api";

const sanitizeNote = (note) => ({
  id: note?.id || `temp-${Date.now()}-${Math.random()}`,
  title: note?.title || "Untitled lecture note",
  content: note?.content || "",
  createdAt: note?.createdAt || new Date().toISOString(),
  userId: note?.userId || "",
  tags: Array.isArray(note?.tags) ? note.tags : [],
  attachmentName: note?.attachmentName || note?.pdfName || "",
});

const sanitizeNotes = (noteList) =>
  Array.isArray(noteList) ? noteList.map(sanitizeNote) : [];

const MainContent = ({ searchResults }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [pdfFileName, setPdfFileName] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      const data = await apiFetch(`/notes/user/${userId}`);
      setNotes(sanitizeNotes(data));
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchResults) {
      setNotes(sanitizeNotes(searchResults));
      setLoading(false);
    } else {
      fetchNotes();
    }
  }, [fetchNotes, searchResults]);

  const stats = useMemo(() => {
    const uniqueTags = new Set(notes.flatMap((note) => note.tags || []));
    return [
      { label: "Total notes", value: notes.length, Icon: BookMarked },
      {
        label: "PDF selected",
        value: notes.filter((note) => note.attachmentName).length,
        Icon: FileText,
      },
      { label: "Subjects/tags", value: uniqueTags.size, Icon: Layers },
    ];
  }, [notes]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setPdfFileName(file.name);
    setError("");
  };

  const handleCreateNote = async (event) => {
    event.preventDefault();
    try {
      const userId = getUserId();
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      const data = await apiFetch("/notes", {
        method: "POST",
        body: {
          title: newNote.title,
          content: newNote.content,
          userId,
          tags: (selectedTags || []).map((tag) => tag.value),
        },
      });

      setNotes((prev) => [sanitizeNote({ ...data, attachmentName: pdfFileName }), ...prev]);
      setNewNote({ title: "", content: "" });
      setSelectedTags([]);
      setPdfFileName("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create note");
      console.error("Create error:", err);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? sanitizeNote(updatedNote) : note))
    );
  };

  const handleNoteDelete = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-border bg-card/85 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Badge variant="secondary">Student dashboard</Badge>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Keep lecture PDFs and short notes organized by subject.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Create concise lecture summaries, tag them by subject, and prepare PDF attachments for each note.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {stats.map(({ label, value, Icon }) => (
              <Card key={label} className="p-4 shadow-none">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-extrabold">{value}</p>
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-secondary-foreground">
                    <Icon size={18} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <Card className="h-fit p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Create note</h2>
              <p className="mt-1 text-sm text-muted-foreground">Add a lecture summary and subject tags.</p>
            </div>
            <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
              <Plus size={20} />
            </div>
          </div>

          <form onSubmit={handleCreateNote} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Lecture title</span>
              <Input
                type="text"
                placeholder="e.g. Database normalization"
                value={newNote.title}
                onChange={(event) => setNewNote((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Subject tags</span>
              <CreatableReactSelect
                isMulti
                placeholder="Data Structures, Networking..."
                value={selectedTags}
                onChange={setSelectedTags}
                classNamePrefix="select"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Short note</span>
              <Textarea
                placeholder="Write the key lecture points here..."
                value={newNote.content}
                onChange={(event) => setNewNote((prev) => ({ ...prev, content: event.target.value }))}
                rows={6}
                required
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-semibold">Lecture PDF</span>
              {pdfFileName ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/70 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{pdfFileName}</p>
                    <p className="text-xs text-muted-foreground">Selected locally for this note</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setPdfFileName("") }>
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-border bg-background/70 p-5 text-center transition-colors hover:bg-secondary/50">
                  <Upload className="mb-2 text-muted-foreground" size={24} />
                  <span className="text-sm font-semibold">Choose PDF</span>
                  <span className="mt-1 text-xs text-muted-foreground">PDF persistence needs backend upload support.</span>
                  <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Note
            </Button>
          </form>
        </Card>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">My notes</h2>
              <p className="text-sm text-muted-foreground">
                {searchResults ? "Showing search results" : "Recently saved lecture notes"}
              </p>
            </div>
            <Badge variant="outline">{notes.length} notes</Badge>
          </div>

          {notes.length === 0 ? (
            <Card className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <FileText size={26} />
                </div>
                <h3 className="mt-5 text-xl font-extrabold">No notes found</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Create your first lecture note with a title, short summary, and subject tags.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {notes.map((note) => (
                <NoteComponent
                  key={note.id}
                  note={note}
                  onNoteUpdate={handleNoteUpdate}
                  onNoteDelete={handleNoteDelete}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default MainContent;
