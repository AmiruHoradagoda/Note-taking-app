import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit,
  Eye,
  FileText,
  Folder,
  Grid3X3,
  ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { apiFetch, getUserId } from "../utils/api";

const semesters = Array.from({ length: 8 }, (_, index) => `Semester ${index + 1}`);
const categories = ["Lecture", "Tutorial", "Assignment", "Exam Notes", "Summary"];

const defaultSubjects = [
  { name: "Data Structures", semester: "Semester 1" },
  { name: "Programming Basics", semester: "Semester 1" },
  { name: "Software Architecture", semester: "Semester 2" },
  { name: "Web Development", semester: "Semester 2" },
  { name: "Database Systems", semester: "Semester 3" },
  { name: "Cloud Computing", semester: "Semester 3" },
];

const demoSubjectCounts = {
  "Data Structures": { notes: 4, documents: 3 },
  "Programming Basics": { notes: 3, documents: 3 },
  "Software Architecture": { notes: 3, documents: 3 },
  "Web Development": { notes: 3, documents: 3 },
  "Database Systems": { notes: 3, documents: 2 },
  "Cloud Computing": { notes: 3, documents: 2 },
};

const dummyNotes = [
  {
    id: "demo-1",
    title: "eTicket_352453516943912",
    content: "Lecture ticket and quick reference PDF for data structures practical session.",
    createdAt: "2025-11-21T00:00:00.000Z",
    userId: "demo",
    tags: ["Data Structures"],
    attachmentName: "eTicket_352453516943912.pdf",
  },
  {
    id: "demo-2",
    title: "M0195",
    content: "Programming basics lecture handout with practice exercises.",
    createdAt: "2025-11-21T00:00:00.000Z",
    userId: "demo",
    tags: ["Programming Basics"],
    attachmentName: "M0195.pdf",
  },
  {
    id: "demo-3",
    title: "EDDS Basic User Support - ISD",
    content: "Support documentation and lecture summary for user support workflows.",
    createdAt: "2025-11-21T00:00:00.000Z",
    userId: "demo",
    tags: ["Software Architecture"],
    attachmentName: "EDDS Basic User Support - ISD.pdf",
  },
  {
    id: "demo-4",
    title: "Database Normalization Summary",
    content: "1NF, 2NF, and 3NF examples with short explanations.",
    createdAt: "2025-10-14T00:00:00.000Z",
    userId: "demo",
    tags: ["Database Systems"],
    attachmentName: "",
  },
  {
    id: "demo-5",
    title: "Cloud Deployment Checklist",
    content: "Steps for deploying frontend and backend services in the cloud.",
    createdAt: "2025-09-30T00:00:00.000Z",
    userId: "demo",
    tags: ["Cloud Computing"],
    attachmentName: "cloud-deployment-checklist.pdf",
  },
  {
    id: "demo-6",
    title: "React Component Notes",
    content: "Document set about props, state, and reusable component structure.",
    createdAt: "2025-08-18T00:00:00.000Z",
    userId: "demo",
    tags: ["Web Development"],
    attachmentName: "",
  },
];

const dummyNoteMeta = {
  "demo-1": { subject: "Data Structures", semester: "Semester 1", category: "Lecture", attachmentName: "eTicket_352453516943912.pdf", documents: ["eTicket_352453516943912.pdf", "stack-queue-diagram.png", "lab-whiteboard.jpg"] },
  "demo-2": { subject: "Programming Basics", semester: "Semester 1", category: "Tutorial", attachmentName: "M0195.pdf", documents: ["M0195.pdf", "flowchart-example.png", "programming-basics.docx"] },
  "demo-3": { subject: "Software Architecture", semester: "Semester 2", category: "Lecture", attachmentName: "EDDS Basic User Support - ISD.pdf", documents: ["EDDS Basic User Support - ISD.pdf", "support-workflow.png", "architecture-slides.pptx"] },
  "demo-4": { subject: "Database Systems", semester: "Semester 3", category: "Summary", attachmentName: "", documents: ["normalization-table.png", "database-normalization.xlsx"] },
  "demo-5": { subject: "Cloud Computing", semester: "Semester 3", category: "Assignment", attachmentName: "cloud-deployment-checklist.pdf", documents: ["cloud-deployment-checklist.pdf", "deployment-pipeline.png"] },
  "demo-6": { subject: "Web Development", semester: "Semester 2", category: "Exam Notes", attachmentName: "", documents: ["component-tree.png", "state-props-sketch.jpg", "react-revision.docx"] },
};
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
const noteMetaStorageKey = () => `leckeeper-note-meta-${getUserId() || "guest"}`;

const normalizeSubject = (subject) => {
  if (typeof subject === "string") {
    return { name: subject.trim(), semester: "Semester 1" };
  }

  return {
    name: subject?.name?.trim() || "",
    semester: semesters.includes(subject?.semester) ? subject.semester : "Semester 1",
  };
};

const uniqueSubjects = (items) => {
  const byName = new Map();
  items.map(normalizeSubject).forEach((subject) => {
    if (subject.name && !byName.has(subject.name)) byName.set(subject.name, subject);
  });
  return [...byName.values()].sort((a, b) =>
    a.semester === b.semester
      ? a.name.localeCompare(b.name)
      : semesters.indexOf(a.semester) - semesters.indexOf(b.semester)
  );
};

const uniqueValues = (items) =>
  [...new Set(items.map((item) => item.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const displayFileName = (fileName) => fileName.replace(/\.[^/.]+$/, "");

const allowedDocumentExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"];
const documentAccept = allowedDocumentExtensions.join(",");

const getFileExtension = (fileName) => {
  const match = fileName.toLowerCase().match(/\.[^/.]+$/);
  return match ? match[0] : "";
};

const isAllowedDocument = (fileName) => allowedDocumentExtensions.includes(getFileExtension(fileName));

const getDocumentIcon = (fileName, size = 38) => {
  const extension = getFileExtension(fileName);
  if ([".png", ".jpg", ".jpeg"].includes(extension)) {
    return <ImageIcon className="text-primary" size={size} />;
  }

  const colorClass = {
    ".pdf": "text-red-600",
    ".doc": "text-blue-600",
    ".docx": "text-blue-600",
    ".ppt": "text-orange-600",
    ".pptx": "text-orange-600",
    ".xls": "text-green-600",
    ".xlsx": "text-green-600",
  }[extension] || "text-muted-foreground";

  return <FileText className={colorClass} size={size} />;
};

const MainContent = ({ activeSection = "subjects", searchResults }) => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [noteMeta, setNoteMeta] = useState({});
  const [filters, setFilters] = useState({ semester: "all", subject: "all", category: "all" });
  const [subjectSemesterFilter, setSubjectSemesterFilter] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectSemester, setNewSubjectSemester] = useState("Semester 1");
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    subject: "",
    semester: "",
    category: "",
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
      const cleanNotes = sanitizeNotes(data);
      const demoNotes = dummyNotes.map(sanitizeNote);
      const mergedNotes = [
        ...cleanNotes,
        ...demoNotes.filter((demoNote) => !cleanNotes.some((note) => note.id === demoNote.id)),
      ];
      setNotes(mergedNotes);
      setNoteMeta((prev) => ({ ...dummyNoteMeta, ...prev }));
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setNotes(dummyNotes.map(sanitizeNote));
      setNoteMeta((prev) => ({ ...dummyNoteMeta, ...prev }));
      setError("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem(subjectStorageKey()) || "[]");
    const savedMeta = JSON.parse(localStorage.getItem(noteMetaStorageKey()) || "{}");
    setSubjects(uniqueSubjects([...defaultSubjects, ...savedSubjects]));
    setNoteMeta(savedMeta);
  }, []);

  useEffect(() => {
    if (searchResults) {
      setNotes(sanitizeNotes(searchResults));
      setLoading(false);
    } else {
      fetchNotes();
    }
  }, [fetchNotes, searchResults]);

  const noteSubjectNames = useMemo(
    () => uniqueValues(notes.flatMap((note) => note.tags || [])),
    [notes]
  );

  const allSubjectRecords = useMemo(
    () => uniqueSubjects([...subjects, ...noteSubjectNames.map((name) => ({ name, semester: "Semester 1" }))]),
    [subjects, noteSubjectNames]
  );

  const allSubjects = useMemo(
    () => allSubjectRecords.map((subject) => subject.name),
    [allSubjectRecords]
  );

  const saveSubjects = (nextSubjects) => {
    const cleaned = uniqueSubjects(nextSubjects);
    setSubjects(cleaned);
    localStorage.setItem(subjectStorageKey(), JSON.stringify(cleaned));
  };

  const saveNoteMeta = (nextMeta) => {
    setNoteMeta(nextMeta);
    localStorage.setItem(noteMetaStorageKey(), JSON.stringify(nextMeta));
  };

  const subjectSemester = (subjectName) =>
    allSubjectRecords.find((subject) => subject.name === subjectName)?.semester || "Semester 1";

  const getNoteView = (note) => {
    const subject = note.tags?.[0] || "General";
    const meta = noteMeta[note.id] || {};
    const legacyDocuments = [
      meta.attachmentName || note.attachmentName,
      ...(Array.isArray(meta.images) ? meta.images : []),
    ].filter(Boolean);
    const documents = Array.isArray(meta.documents) ? meta.documents : legacyDocuments;
    return {
      ...note,
      subject: meta.subject || subject,
      semester: meta.semester || subjectSemester(subject),
      category: meta.category || "Lecture",
      attachmentName: meta.attachmentName || note.attachmentName || documents.find((fileName) => getFileExtension(fileName) === ".pdf") || "",
      documents,
    };
  };

  const noteViews = useMemo(
    () => notes.map(getNoteView),
    [notes, noteMeta, allSubjectRecords]
  );

  const filteredNotes = useMemo(() => {
    return noteViews.filter((note) => {
      const matchesSemester = filters.semester === "all" || note.semester === filters.semester;
      const matchesSubject = filters.subject === "all" || note.subject === filters.subject;
      const matchesCategory = filters.category === "all" || note.category === filters.category;
      return matchesSemester && matchesSubject && matchesCategory;
    });
  }, [noteViews, filters]);

  const getFolderResources = (note) => {
    const documents = Array.isArray(note.documents) ? note.documents : [note.attachmentName].filter(Boolean);
    return {
      documents,
      total: documents.length,
    };
  };

  const subjectRows = useMemo(
    () =>
      allSubjectRecords.map((subject) => {
        const realNotes = noteViews.filter((note) => note.subject === subject.name);
        const demo = demoSubjectCounts[subject.name] || { notes: 0, documents: 0 };
        return {
          ...subject,
          notes: realNotes.length || demo.notes,
          documents: realNotes.reduce((count, note) => count + getFolderResources(note).total, 0) || demo.documents,
          canRemove: subjects.some((item) => item.name === subject.name),
        };
      }),
    [allSubjectRecords, noteViews, subjects]
  );

  const visibleSubjectRows = useMemo(() => {
    if (subjectSemesterFilter === "all") return subjectRows;
    return subjectRows.filter((subject) => subject.semester === subjectSemesterFilter);
  }, [subjectRows, subjectSemesterFilter]);

  const handleAddSubject = (event) => {
    event.preventDefault();
    if (!newSubjectName.trim()) return;

    saveSubjects([...subjects, { name: newSubjectName, semester: newSubjectSemester }]);
    setNewSubjectName("");
    setNewSubjectSemester("Semester 1");
    setShowSubjectForm(false);
    setError("");
  };

  const handleRemoveSubject = (subject) => {
    saveSubjects(subjects.filter((item) => item.name !== subject));
    if (filters.subject === subject) setFilters((prev) => ({ ...prev, subject: "all" }));
  };

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter((file) => !isAllowedDocument(file.name));
    if (invalidFiles.length > 0) {
      setError("Please select only PDF, image, Word, PowerPoint, or Excel files.");
      return;
    }

    setSelectedDocuments((prev) => uniqueValues([...prev, ...files.map((file) => file.name)]));
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

      if (selectedDocuments.length === 0) {
        setError("Please upload at least one document.");
        return;
      }

      const subject = newNote.subject.trim();
      const data = await apiFetch("/notes", {
        method: "POST",
        body: {
          title: newNote.title,
          content: "",
          userId,
          tags: uniqueValues([subject]),
        },
      });

      if (subject) saveSubjects([...subjects, { name: subject, semester: newNote.semester || "Semester 1" }]);
      const firstPdf = selectedDocuments.find((fileName) => getFileExtension(fileName) === ".pdf") || "";
      const cleanNote = sanitizeNote({ ...data, content: "", attachmentName: firstPdf });
      setNotes((prev) => [cleanNote, ...prev]);
      saveNoteMeta({
        ...noteMeta,
        [cleanNote.id]: {
          subject,
          semester: newNote.semester || "Semester 1",
          category: newNote.category || "Lecture",
          attachmentName: firstPdf,
          documents: selectedDocuments,
        },
      });
      setNewNote({ title: "", subject: "", semester: "", category: "" });
      setSelectedDocuments([]);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create note");
      console.error("Create error:", err);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    const cleanNote = sanitizeNote(updatedNote);
    saveSubjects([
      ...subjects,
      ...(cleanNote.tags || []).map((name) => ({ name, semester: subjectSemester(name) })),
    ]);
    setNotes((prev) => prev.map((note) => (note.id === cleanNote.id ? cleanNote : note)));
  };

  const handleNoteDelete = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    if (selectedNote?.id === noteId) setSelectedNote(null);
    const nextMeta = { ...noteMeta };
    delete nextMeta[noteId];
    saveNoteMeta(nextMeta);
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
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Add New Note Folder</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create one folder and upload PDF, image, Word, PowerPoint, or Excel documents.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <form onSubmit={handleCreateNote} className="space-y-5">
          <Card className="bg-card p-6 shadow-none">
            <label className="block space-y-3">
              <span className="text-sm font-bold">Folder Name *</span>
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
                  onChange={(event) => {
                    const subject = event.target.value;
                    setNewNote((prev) => ({ ...prev, subject, semester: subjectSemester(subject) }));
                  }}
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
                  value={newNote.semester}
                  onChange={(event) => setNewNote((prev) => ({ ...prev, semester: event.target.value }))}
                  required
                  className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>Select a semester</option>
                  {semesters.map((semester) => <option key={semester}>{semester}</option>)}
                </select>
              </label>
            </Card>
          </div>

          <Card className="bg-card p-6 shadow-none">
            <label className="block space-y-3">
              <span className="text-sm font-bold">Category *</span>
              <select
                value={newNote.category}
                onChange={(event) => setNewNote((prev) => ({ ...prev, category: event.target.value }))}
                required
                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </Card>

          <Card className="bg-card p-6 shadow-none">
            <div className="space-y-4">
              <span className="text-sm font-bold">Upload Documents *</span>
              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white text-center hover:bg-muted">
                <Upload className="mb-3 text-muted-foreground" size={26} />
                <span className="text-sm font-semibold">Click to upload or drag and drop</span>
                <span className="mt-1 text-xs text-muted-foreground">PDF, images, Word, PowerPoint, Excel</span>
                <input type="file" accept={documentAccept} multiple className="hidden" onChange={handleDocumentChange} />
              </label>

              {selectedDocuments.length > 0 && (
                <div className="space-y-2 rounded-lg border border-border bg-white p-3">
                  {selectedDocuments.map((fileName) => (
                    <div key={fileName} className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {getDocumentIcon(fileName, 20)}
                        <p className="truncate text-sm font-bold">{displayFileName(fileName)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDocuments((prev) => prev.filter((item) => item !== fileName))}
                      >
                        <X size={15} />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setSelectedDocuments([])}>
                    Clear Documents
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="submit">Save Folder</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewNote({ title: "", subject: "", semester: "", category: "" });
                setSelectedDocuments([]);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <Card className="bg-white p-5 shadow-soft">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Folder size={38} fill="currentColor" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-extrabold">Folder Preview</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This form creates one folder in My Notes. Inside the folder you will see the uploaded documents as file cards.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              {selectedDocuments.length > 0 ? (
                selectedDocuments.map((fileName) => (
                  <div key={fileName} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    {getDocumentIcon(fileName, 18)}
                    <span className="truncate font-semibold">{displayFileName(fileName)}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <FileText className="text-muted-foreground" size={18} />
                  <span className="font-semibold">Uploaded documents will appear here</span>
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div>
      <div className="mb-9 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Subjects</h1>
          <p className="mt-2 text-base text-muted-foreground">Manage subjects in a table and assign each to a semester</p>
        </div>
        <Button type="button" onClick={() => setShowSubjectForm((prev) => !prev)}>
          + New Subject
        </Button>
      </div>

      {showSubjectForm && (
        <Card className="mb-6 bg-card p-6 shadow-none">
          <h2 className="mb-5 text-base font-extrabold">Create New Subject</h2>
          <form onSubmit={handleAddSubject} className="grid gap-4 md:grid-cols-[1fr_220px_auto_auto] md:items-end">
            <label className="block space-y-2">
              <span className="text-xs font-bold">Subject Name</span>
              <Input
                value={newSubjectName}
                onChange={(event) => setNewSubjectName(event.target.value)}
                placeholder="e.g., Advanced Algorithms"
                className="bg-white"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold">Semester</span>
              <select
                value={newSubjectSemester}
                onChange={(event) => setNewSubjectSemester(event.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {semesters.map((semester) => <option key={semester}>{semester}</option>)}
              </select>
            </label>
            <Button type="submit">Create</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewSubjectName("");
                setNewSubjectSemester("Semester 1");
                setShowSubjectForm(false);
              }}
            >
              Cancel
            </Button>
          </form>
        </Card>
      )}

      <Card className="mb-4 bg-card p-4 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Filter subjects</p>
            <p className="mt-1 text-xs text-muted-foreground">Show subjects by selected semester.</p>
          </div>
          <select
            value={subjectSemesterFilter}
            onChange={(event) => setSubjectSemesterFilter(event.target.value)}
            className="h-10 min-w-52 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All semesters</option>
            {semesters.map((semester) => <option key={semester}>{semester}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-card text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Semester</th>
                <th className="px-5 py-4 text-center">Notes</th>
                <th className="px-5 py-4 text-center">Documents</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleSubjectRows.map((subject) => (
                <tr key={subject.name} className="hover:bg-muted/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <BookOpen size={18} />
                      </div>
                      <span className="font-bold">{subject.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{subject.semester}</td>
                  <td className="px-5 py-4 text-center font-bold">{subject.notes}</td>
                  <td className="px-5 py-4 text-center font-bold">{subject.documents}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="ghost" size="icon" title="Edit subject">
                        <Edit size={16} />
                      </Button>
                      {subject.canRemove && (
                        <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-red-50" onClick={() => handleRemoveSubject(subject.name)} title="Delete subject">
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleSubjectRows.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-muted-foreground" colSpan="5">
                    No subjects found for this semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderFolderCard = (note) => {
    return (
      <Card key={note.id} className="bg-white p-5 shadow-soft transition hover:-translate-y-0.5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Folder size={38} fill="currentColor" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="line-clamp-2 min-h-11 text-lg font-extrabold">{note.title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{formatDate(note.createdAt)}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">{note.subject}</Badge>
          <Badge variant="outline">{note.semester}</Badge>
          <Badge variant="outline">{note.category}</Badge>
        </div>

        <div className="mt-7 flex justify-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => setSelectedNote(note)}>
            <Eye size={14} /> View Folder
          </Button>
          <Button type="button" variant="outline" size="sm" className="border-red-200 text-destructive hover:bg-red-50" onClick={() => handleNoteDelete(note.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </Card>
    );
  };

  const renderResourceTile = ({ icon, title, date }) => (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-border bg-white p-4 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center">
        {icon}
      </div>
      <h4 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">{title}</h4>
      <p className="mt-3 text-xs text-muted-foreground">{date}</p>
    </div>
  );

  const renderFolderView = (note) => {
    const resources = getFolderResources(note);
    return (
      <div>
        <button
          type="button"
          className="mb-6 flex items-center gap-2 text-sm font-bold text-primary"
          onClick={() => setSelectedNote(null)}
        >
          <ArrowLeft size={17} /> Back to folders
        </button>

        <Card className="mb-6 bg-card p-6 shadow-soft">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Folder size={48} fill="currentColor" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{note.title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  This note folder contains uploaded lecture documents.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{note.subject}</Badge>
                  <Badge variant="outline">{note.semester}</Badge>
                  <Badge variant="outline">{note.category}</Badge>
                  <Badge variant="outline">{resources.total} items inside</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <section className="space-y-6">
            <Card className="bg-white p-6 shadow-soft">
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-muted-foreground">{resources.total} documents found</p>
                <button type="button" className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Refresh folder">
                  <RefreshCw size={18} />
                </button>
              </div>
              {resources.documents.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {resources.documents.map((fileName) => renderResourceTile({
                    icon: getDocumentIcon(fileName, 42),
                    title: displayFileName(fileName),
                    date: formatDate(note.createdAt),
                  }))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
                  No documents uploaded yet.
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>
    );
  };

  const renderNotes = () => (
    <div>
      {selectedNote ? (
        renderFolderView(selectedNote)
      ) : (
      <>
      <PageHeader title="My Notes" description="Filter note folders by semester, subject, and category" />

      <Card className="mb-6 bg-card p-5 shadow-none">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-bold">Semester</span>
            <select value={filters.semester} onChange={(event) => setFilters((prev) => ({ ...prev, semester: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All semesters</option>
              {semesters.map((semester) => <option key={semester}>{semester}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold">Subject</span>
            <select value={filters.subject} onChange={(event) => setFilters((prev) => ({ ...prev, subject: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All subjects</option>
              {allSubjects.map((subject) => <option key={subject}>{subject}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold">Category</span>
            <select value={filters.category} onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredNotes.length} folders found</span>
          <button type="button" className="flex items-center gap-2 font-semibold text-primary" onClick={() => setFilters({ semester: "all", subject: "all", category: "all" })}>
            <RefreshCw size={15} /> Reset filters
          </button>
        </div>
      </Card>

      {filteredNotes.length === 0 ? (
        <Card className="grid min-h-64 place-items-center bg-white p-8 text-center">
          <div>
            <FileText className="mx-auto text-muted-foreground" size={34} />
            <h3 className="mt-4 text-xl font-extrabold">No notes found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add a note or change the filters.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map(renderFolderCard)}
        </div>
      )}
      </>
      )}
    </div>
  );

  const recentNote = filteredNotes[0] || noteViews[0];

  const renderDashboard = () => {
    const totalDocuments = noteViews.reduce((count, note) => count + getFolderResources(note).total, 0);
    const statCards = [
      { label: "Total Notes", value: notes.length || 24, Icon: BookOpen },
      { label: "Total Documents", value: totalDocuments || 18, Icon: FileText },
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
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">{recentNote.subject || "General"}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(recentNote.createdAt)}</span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      {getFolderResources(recentNote).total} documents
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">View</Button>
                  <Button type="button" variant="outline" size="sm" className="border-red-200 text-destructive hover:bg-red-50" onClick={() => handleNoteDelete(recentNote.id)}>
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
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">Data Structures</span>
                    <span>1/15/2024</span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">3 documents</span>
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

