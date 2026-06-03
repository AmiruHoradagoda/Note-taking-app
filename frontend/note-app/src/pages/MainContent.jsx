import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Edit,
  FileText,
  Grid3X3,
  NotebookPen,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import CreatableReactSelect from "react-select/creatable";
import NoteComponent from "../components/NoteComponent";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { apiFetch, getUserId } from "../utils/api";

const defaultSubjects = ["Data Structures", "Programming Basics"];

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

const subjectStorageKey = () => `leckeeper-subjects-${getUserId() || "guest"}`;

const uniqueValues = (items) =>
  [...new Set(items.map((item) => item.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

const MainContent = ({ activeSection = "subjects", searchResults }) => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [newNote, setNewNote] = useState({ title: "", subject: "", content: "" });

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
    const savedSubjects = JSON.parse(localStorage.getItem(subjectStorageKey()) || "[]");
    setSubjects(uniqueValues([...defaultSubjects, ...savedSubjects]));
  }, []);

  useEffect(() => {
    if (searchResults) {
      setNotes(sanitizeNotes(searchResults));
      setLoading(false);
    } else {
      fetchNotes();
    }
  }, [fetchNotes, searchResults]);

  const noteSubjects = useMemo(
    () => uniqueValues(notes.flatMap((note) => note.tags || [])),
    [notes]
  );

  const allSubjects = useMemo(
    () => uniqueValues([...subjects, ...noteSubjects]),
    [subjects, noteSubjects]
  );

  const subjectOptions = useMemo(
    () => allSubjects.map((subject) => ({ label: subject, value: subject })),
    [allSubjects]
  );

  const filteredNotes = useMemo(() => {
    if (selectedSubjectFilter === "all") return notes;
    return notes.filter((note) => note.tags?.includes(selectedSubjectFilter));
  }, [notes, selectedSubjectFilter]);

  const subjectCards = useMemo(
    () =>
      allSubjects.map((subject) => ({
        name: subject,
        notes: notes.filter((note) => note.tags?.includes(subject)).length,
        pdfs: notes.filter((note) => note.tags?.includes(subject) && note.attachmentName).length,
        canRemove: subjects.includes(subject),
      })),
    [allSubjects, notes, subjects]
  );

  const saveSubjects = (nextSubjects) => {
    const cleaned = uniqueValues(nextSubjects);
    setSubjects(cleaned);
    localStorage.setItem(subjectStorageKey(), JSON.stringify(cleaned));
  };

  const handleAddSubject = (event) => {
    event.preventDefault();
    if (!newSubjectName.trim()) return;

    saveSubjects([...subjects, newSubjectName]);
    setNewSubjectName("");
    setShowSubjectForm(false);
    setError("");
  };

  const handleRemoveSubject = (subject) => {
    saveSubjects(subjects.filter((item) => item !== subject));
    if (selectedSubjectFilter === subject) setSelectedSubjectFilter("all");
  };

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

      const subject = newNote.subject.trim();
      const tags = uniqueValues([subject, ...(selectedTags || []).map((tag) => tag.value)]);
      const data = await apiFetch("/notes", {
        method: "POST",
        body: {
          title: newNote.title,
          content: newNote.content,
          userId,
          tags,
        },
      });

      if (subject) saveSubjects([...subjects, subject]);
      setNotes((prev) => [sanitizeNote({ ...data, attachmentName: pdfFileName }), ...prev]);
      setNewNote({ title: "", subject: "", content: "" });
      setSelectedTags([]);
      setPdfFileName("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create note");
      console.error("Create error:", err);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    const cleanNote = sanitizeNote(updatedNote);
    saveSubjects([...subjects, ...(cleanNote.tags || [])]);
    setNotes((prev) => prev.map((note) => (note.id === cleanNote.id ? cleanNote : note)));
  };

  const handleNoteDelete = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const PageHeader = ({ title, description, action }) => (
    <div className="mb-9 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );

  const renderAddNote = () => (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Add New Note</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create a new lecture note with optional PDF attachment</p>
      </div>

      <form onSubmit={handleCreateNote} className="space-y-5">
        <Card className="bg-card p-6 shadow-none">
          <label className="block space-y-3">
            <span className="text-sm font-bold">Note Title *</span>
            <Input
              value={newNote.title}
              onChange={(event) => setNewNote((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g., Data Structures - Stack and Queue"
              required
              className="bg-white"
            />
          </label>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="bg-card p-6 shadow-none">
            <label className="block space-y-3">
              <span className="text-sm font-bold">Subject *</span>
              <select
                value={newNote.subject}
                onChange={(event) => setNewNote((prev) => ({ ...prev, subject: event.target.value }))}
                required
                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a subject</option>
                {allSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>
          </Card>

          <Card className="bg-card p-6 shadow-none">
            <label className="block space-y-3">
              <span className="text-sm font-bold">Semester *</span>
              <select
                required
                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>Select a semester</option>
                <option>Semester 1</option>
                <option>Semester 2</option>
                <option>Semester 3</option>
                <option>Semester 4</option>
              </select>
            </label>
          </Card>
        </div>

        <Card className="bg-card p-6 shadow-none">
          <label className="block space-y-3">
            <span className="text-sm font-bold">Category *</span>
            <select
              required
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option>Lecture</option>
              <option>Tutorial</option>
              <option>Assignment</option>
              <option>Exam Notes</option>
            </select>
          </label>
        </Card>

        <Card className="bg-card p-6 shadow-none">
          <label className="block space-y-3">
            <span className="text-sm font-bold">Note Content *</span>
            <Textarea
              value={newNote.content}
              onChange={(event) => setNewNote((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Write your note content here..."
              rows={7}
              required
              className="bg-white"
            />
          </label>
        </Card>

        <Card className="bg-card p-6 shadow-none">
          <div className="space-y-4">
            <span className="text-sm font-bold">Upload PDF (Optional)</span>
            {pdfFileName ? (
              <div className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{pdfFileName}</p>
                  <p className="text-xs text-muted-foreground">PDF file selected</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setPdfFileName("") }>
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white text-center hover:bg-muted">
                <Upload className="mb-3 text-muted-foreground" size={24} />
                <span className="text-sm font-semibold">Click to upload or drag and drop</span>
                <span className="mt-1 text-xs text-muted-foreground">PDF files only</span>
                <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit">Save Note</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setNewNote({ title: "", subject: "", content: "" });
              setSelectedTags([]);
              setPdfFileName("");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  const renderSubjects = () => (
    <div>
      <PageHeader
        title="Subjects"
        description="Organize your subjects by semester"
        action={
          <Button type="button" onClick={() => setShowSubjectForm((prev) => !prev)}>
            <Plus size={18} />
            New Subject
          </Button>
        }
      />

      {showSubjectForm && (
        <Card className="mb-8 max-w-xl bg-white p-5">
          <form onSubmit={handleAddSubject} className="flex gap-3">
            <Input
              value={newSubjectName}
              onChange={(event) => setNewSubjectName(event.target.value)}
              placeholder="Subject name"
            />
            <Button type="submit">Add</Button>
          </form>
        </Card>
      )}

      <section>
        <h2 className="text-2xl font-extrabold">Semester 1</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subjectCards.length} subjects</p>

        <div className="mt-5 grid max-w-5xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subjectCards.map((subject) => (
            <Card key={subject.name} className="min-h-64 bg-card p-6 shadow-soft">
              <div className="mb-12 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <BookOpen size={22} />
                </div>
                <div className="flex gap-3 text-muted-foreground">
                  <button type="button" className="hover:text-primary" title="Edit subject">
                    <Edit size={17} />
                  </button>
                  {subject.canRemove && (
                    <button type="button" className="hover:text-destructive" title="Delete subject" onClick={() => handleRemoveSubject(subject.name)}>
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-extrabold">{subject.name}</h3>

              <div className="mt-10 space-y-4 border-t border-border pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <NotebookPen size={16} />
                    Notes
                  </span>
                  <span className="text-lg font-extrabold">{subject.notes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <FileText size={16} />
                    PDFs
                  </span>
                  <span className="text-lg font-extrabold">{subject.pdfs}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  const renderNotes = () => (
    <div>
      <PageHeader title="My Notes" description="Browse notes by subject" />
      <div className="mb-5 flex items-center gap-3">
        <select
          value={selectedSubjectFilter}
          onChange={(event) => setSelectedSubjectFilter(event.target.value)}
          className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All subjects</option>
          {allSubjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <Badge variant="outline">{filteredNotes.length} notes</Badge>
      </div>

      {filteredNotes.length === 0 ? (
        <Card className="grid min-h-64 place-items-center bg-white p-8 text-center">
          <div>
            <FileText className="mx-auto text-muted-foreground" size={34} />
            <h3 className="mt-4 text-xl font-extrabold">No notes found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add a note or change the subject filter.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteComponent
              key={note.id}
              note={note}
              onNoteUpdate={handleNoteUpdate}
              onNoteDelete={handleNoteDelete}
            />
          ))}
        </div>
      )}
    </div>
  );

  const recentNote = filteredNotes[0] || notes[0];

  const renderDashboard = () => {
    const totalPdfs = notes.filter((note) => note.attachmentName).length;
    const statCards = [
      { label: "Total Notes", value: notes.length || 24, Icon: BookOpen },
      { label: "Total PDFs", value: totalPdfs || 18, Icon: FileText },
      { label: "Subjects", value: allSubjects.length || 6, Icon: Grid3X3 },
    ];

    return (
      <div>
        <PageHeader title="Dashboard" description="Welcome back! Here's your study overview." />

        <div className="grid gap-6 lg:grid-cols-3">
          {statCards.map(({ label, value, Icon }) => (
            <Card key={label} className="bg-card p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <section className="mt-9">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight">Recent Notes</h2>
            <Button type="button" onClick={() => window.dispatchEvent(new CustomEvent("leckeeper:navigate-add"))}>
              + Add New Note
            </Button>
          </div>

          {recentNote ? (
            <Card className="bg-card p-6 shadow-soft">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-extrabold">{recentNote.title}</h3>
                  <p className="mt-3 text-base text-muted-foreground">{recentNote.content || "No note content added."}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">{recentNote.tags?.[0] || "General"}</span>
                    <span>{new Date(recentNote.createdAt).toLocaleDateString()}</span>
                    {(recentNote.attachmentName || notes.length === 0) && (
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">PDF Available</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">View</Button>
                  <Button type="button" variant="outline" size="sm" className="border-red-200 text-destructive hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-card p-6 shadow-soft">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-extrabold">Data Structures - Stack and Queue</h3>
                  <p className="mt-3 text-base text-muted-foreground">Notes on stack and queue implementations</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">Data Structures</span>
                    <span>1/15/2024</span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">PDF Available</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">View</Button>
                  <Button type="button" variant="outline" size="sm" className="border-red-200 text-destructive hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </section>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeSection === "dashboard" && renderDashboard()}
      {activeSection === "notes" && renderNotes()}
      {activeSection === "add" && renderAddNote()}
      {activeSection === "subjects" && renderSubjects()}
      {activeSection === "settings" && (
        <div>
          <PageHeader title="Settings" description="Account settings will be added later" />
          <Card className="max-w-xl bg-white p-6 text-sm text-muted-foreground">
            No settings are available yet.
          </Card>
        </div>
      )}
    </div>
  );
};

export default MainContent;


