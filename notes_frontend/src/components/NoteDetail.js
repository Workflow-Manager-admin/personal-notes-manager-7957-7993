import React, { useState, useEffect, useRef } from "react";
import "../notes-app.css";

// PUBLIC_INTERFACE
/**
 * Displays the note detail, supports view and edit modes, saving, editing, deleting.
 * @param {Object} props
 * @param {{id:number, title:string, body:string, createdAt:string, updatedAt:string}} props.note
 * @param {boolean} props.editing
 * @param {function(note):void} props.onSave
 * @param {function(id:number):void} props.onDelete
 * @param {function():void} props.onEdit
 */
function NoteDetail({ note, editing, onSave, onDelete, onEdit }) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  // Autofocus logic for edit mode
  const titleRef = useRef();

  useEffect(() => {
    setTitle(note.title);
    setBody(note.body);
  }, [note.id, note.title, note.body]);

  useEffect(() => {
    if (editing && titleRef.current) {
      setTimeout(() => titleRef.current.focus(), 50);
    }
  }, [editing, note.id]);

  // Handle save (with some trimming)
  const handleSave = () => {
    const trimmedTitle = title.trim() || "Untitled Note";
    onSave({ ...note, title: trimmedTitle, body });
  };

  // Keyboard: Ctrl+S/Meta+S to save in edit mode
  useEffect(() => {
    if (!editing) return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line
  }, [editing, title, body]);

  return (
    <section className="note-detail-paper" aria-label="Note Details">
      {editing ? (
        <>
          <input
            className="note-edit-title-inp"
            ref={titleRef}
            type="text"
            value={title}
            maxLength={128}
            placeholder="Note title"
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="note-edit-body-inp"
            value={body}
            rows={10}
            placeholder="Type your note here..."
            onChange={e => setBody(e.target.value)}
            aria-label="Note body"
          />
          <div className="note-detail-row">
            <button className="btn-accent" onClick={handleSave}>
              Save
            </button>
            <button className="btn-outline" onClick={() => { setTitle(note.title); setBody(note.body); onEdit(); }}>
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={() => onDelete(note.id)}
              title="Delete note"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ margin: 0, color: "var(--primary)" }}>{note.title}</h2>
          <div style={{
            color: "#444", marginTop: 9, fontSize: "1.09rem", minHeight: 40,
            whiteSpace: "pre-wrap", lineHeight: 1.6
          }}>
            {note.body || <span className="notes-empty-body">(No content)</span>}
          </div>
          <div style={{
            display: "flex", gap: 8, color: "var(--text-secondary)",
            marginTop: 7, fontSize: 13
          }}>
            Last edited: {note.updatedAt?.slice(0, 16).replace("T", " ")}
          </div>
          <div className="note-detail-row">
            <button className="btn-accent" onClick={onEdit}>Edit</button>
            <button className="btn-danger" onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default NoteDetail;
