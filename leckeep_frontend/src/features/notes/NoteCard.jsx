import { useEffect, useState } from "react";
import { Calendar, FileText, Pencil, Save, Tag, Trash2, X } from "lucide-react";
import CreatableReactSelect from "react-select/creatable";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { apiFetch } from "../../lib/apiClient";

const formatDate = (value) => {
  if (!value) return "Recently added";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently added";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NoteCard = ({ note, onNoteUpdate, onNoteDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState(
    (note.tags || []).map((tag) => ({ label: tag, value: tag }))
  );

  useEffect(() => {
    setEditedNote(note);
    setSelectedTags((note.tags || []).map((tag) => ({ label: tag, value: tag })));
  }, [note]);

  const handleUpdate = async () => {
    try {
      const updatedNote = await apiFetch(`/notes/${note.id}`, {
        method: "PUT",
        body: {
          title: editedNote.title,
          content: editedNote.content,
          userId: editedNote.userId,
          tags: (selectedTags || []).map((tag) => tag.value),
        },
      });

      onNoteUpdate({ ...updatedNote, attachmentName: note.attachmentName });
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update note");
      console.error("Update error:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await apiFetch(`/notes/${note.id}`, { method: "DELETE" });
      onNoteDelete(note.id);
    } catch (err) {
      setError(err.message || "Failed to delete note");
      console.error("Delete error:", err);
    }
  };

  const handleCancel = () => {
    setEditedNote(note);
    setSelectedTags((note.tags || []).map((tag) => ({ label: tag, value: tag })));
    setError("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <Badge variant="secondary">Editing</Badge>
            <h3 className="mt-2 text-lg font-bold">Update lecture note</h3>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={handleCancel}>
            <X size={18} />
          </Button>
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="space-y-3">
          <Input
            type="text"
            value={editedNote.title}
            onChange={(event) => setEditedNote({ ...editedNote, title: event.target.value })}
            placeholder="Lecture title"
          />
          <Textarea
            value={editedNote.content}
            onChange={(event) => setEditedNote({ ...editedNote, content: event.target.value })}
            placeholder="Short note content"
            rows={5}
          />
          <CreatableReactSelect
            isMulti
            placeholder="Add tags or subjects"
            value={selectedTags}
            onChange={setSelectedTags}
            classNamePrefix="select"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpdate}>
            <Save size={16} />
            Save
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex min-h-64 flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-soft">
      {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <FileText size={21} />
        </div>
        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Button type="button" variant="ghost" size="icon" onClick={() => setIsEditing(true)} title="Edit note">
            <Pencil size={16} />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={handleDelete} title="Delete note" className="text-destructive hover:bg-red-50 hover:text-destructive">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <h3 className="text-lg font-extrabold leading-snug tracking-tight">{note.title}</h3>
      <p className="mt-3 line-clamp-5 flex-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">
        {note.content}
      </p>

      <div className="mt-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          {(note.tags || []).length > 0 ? (
            note.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag size={12} />
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary">No tags</Badge>
          )}
          {note.attachmentName && (
            <Badge variant="success">
              <FileText size={12} />
              PDF
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatDate(note.createdAt)}
          </span>
          {note.attachmentName && <span className="max-w-28 truncate">{note.attachmentName}</span>}
        </div>
      </div>
    </Card>
  );
};

export default NoteCard;
