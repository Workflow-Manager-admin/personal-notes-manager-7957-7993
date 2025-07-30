import React from "react";
import "../notes-app.css";

// PUBLIC_INTERFACE
/**
 * Header bar with app title, create button, and search input.
 * @param {Object} props
 * @param {function(string):void} props.onSearch
 * @param {string} props.search
 * @param {function():void} props.onCreate
 */
function NotesHeader({ onSearch, search, onCreate }) {
  return (
    <header className="notes-header">
      <span className="notes-header-title">
        <span role="img" aria-label="notes">🗒️</span> My Notes
      </span>
      <div className="notes-header-actions">
        <button className="btn-primary" onClick={onCreate} aria-label="Create Note" title="Create Note (Ctrl+N)">
          + New Note
        </button>
        <input
          className="notes-header-search"
          type="search"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search notes..."
          aria-label="Search notes"
        />
      </div>
    </header>
  );
}

export default NotesHeader;
