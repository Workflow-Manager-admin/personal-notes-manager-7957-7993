import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import NotesSidebar from "./components/NotesSidebar";
import NoteDetail from "./components/NoteDetail";
import NotesHeader from "./components/NotesHeader";

// PUBLIC_INTERFACE
function App() {
  /** Main Notes State and logic for sidebar + note details + search filtering */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);

  // Init notes from localStorage
  useEffect(() => {
    const n = localStorage.getItem("notes-v1");
    if (n) {
      setNotes(JSON.parse(n));
    }
  }, []);

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes-v1", JSON.stringify(notes));
  }, [notes]);

  // Filter notes by search text (case-insensitive, by title/body)
  const searchedNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.body.toLowerCase().includes(search.toLowerCase()),
  );

  // Select note and stop editing
  const handleSelectNote = (id) => {
    setSelectedId(id);
    setEditing(false);
  };

  // Create and select a new note
  // PUBLIC_INTERFACE
  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      body: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
    setEditing(true);
  };

  // Update note title/body
  // PUBLIC_INTERFACE
  const handleSaveNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : n,
      ),
    );
    setEditing(false);
  };

  // PUBLIC_INTERFACE
  const handleEditNote = () => {
    setEditing(true);
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    // Select another note if possible
    if (id === selectedId) {
      const idx = notes.findIndex((n) => n.id === id);
      const altIdx = idx === 0 && notes.length > 1 ? 1 : idx - 1;
      setSelectedId(notes[altIdx]?.id ?? null);
      setEditing(false);
    }
  };

  // Find currently selected note (or null)
  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  // Keyboard shortcut: Ctrl/Cmd+N to create new note
  useEffect(() => {
    const onKey = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "n"
      ) {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [notes]);

  return (
    <div className="notes-app-root">
      <NotesHeader
        onSearch={setSearch}
        onCreate={handleCreateNote}
        search={search}
      />
      <div className="notes-main-area">
        <NotesSidebar
          notes={searchedNotes}
          selectedId={selectedId}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
        />
        <main className="note-detail-main">
          {selectedNote ? (
            <NoteDetail
              note={selectedNote}
              editing={editing}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
            />
          ) : (
            <div className="note-detail-empty">
              <span>📝</span>
              <p style={{ color: "var(--text-secondary)", marginTop: 16, fontSize: 18 }}>
                Select or create a note to get started.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
