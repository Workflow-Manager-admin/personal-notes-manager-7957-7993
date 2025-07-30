import React from "react";
import "../notes-app.css";

// Format date as e.g. "2024-06-07"
function formatDate(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 10);
}

// PUBLIC_INTERFACE
/**
 * Sidebar listing all notes and controlling selection & delete
 * @param {Object} props
 * @param {Array} props.notes - List of {id, title, body, createdAt, updatedAt}
 * @param {number|null} props.selectedId
 * @param {function(id:number):void} props.onSelect
 * @param {function(id:number):void} props.onDelete
 */
function NotesSidebar({ notes, selectedId, onSelect, onDelete }) {
  return (
    <nav className="notes-sidebar">
      <div className="notes-list">
        {notes.length === 0 && (
          <div className="no-notes-sidebar">No notes found.<br />Create your first note!</div>
        )}
        {notes.map((note) => (
          <div
            className={`note-list-item${note.id === selectedId ? " selected" : ""}`}
            key={note.id}
            onClick={() => onSelect(note.id)}
          >
            <div className="note-list-title">{note.title || <i>Untitled</i>}</div>
            <div className="note-list-snippet">
              {note.body.length > 38
                ? note.body.slice(0, 38) + "…"
                : note.body}
            </div>
            <div className="note-list-date">
              {formatDate(note.updatedAt)}
            </div>
            <button
              className="btn-note-delete"
              onClick={e => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              title="Delete"
              aria-label="Delete Note"
            >×</button>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default NotesSidebar;
