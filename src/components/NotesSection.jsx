import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { formatDate, MONTH_NAMES, MONTH_THEMES } from '../utils/calendarUtils';
import './NotesSection.css';

export default function NotesSection() {
  const {
    notes,
    rangeNotes,
    startDate,
    endDate,
    currentMonth,
    currentYear,
    addNoteToDate,
    removeNoteFromDate,
    addRangeNote,
    removeRangeNote,
  } = useCalendar();

  const [noteInput, setNoteInput] = useState('');
  const [activeTab, setActiveTab] = useState('month');
  const theme = MONTH_THEMES[currentMonth];

  // Get notes for the current month
  const monthNoteEntries = Object.entries(notes).filter(([key]) => {
    const parts = key.split('-');
    return parseInt(parts[0]) === currentYear && parseInt(parts[1]) === currentMonth;
  });

  const handleAddMonthNote = () => {
    if (!noteInput.trim()) return;
    const key = `${currentYear}-${currentMonth}-general`;
    addNoteToDate(key, noteInput.trim());
    setNoteInput('');
  };

  const handleAddDateNote = () => {
    if (!noteInput.trim() || !startDate) return;
    const key = `${startDate.year}-${startDate.month}-${startDate.day}`;
    addNoteToDate(key, noteInput.trim());
    setNoteInput('');
  };

  const handleAddRangeNote = () => {
    if (!noteInput.trim() || !startDate || !endDate) return;
    addRangeNote(noteInput.trim());
    setNoteInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'month') handleAddMonthNote();
    else if (activeTab === 'date') handleAddDateNote();
    else if (activeTab === 'range') handleAddRangeNote();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const generalKey = `${currentYear}-${currentMonth}-general`;
  const generalNotes = notes[generalKey] || [];

  const dateKey = startDate ? `${startDate.year}-${startDate.month}-${startDate.day}` : null;
  const dateNotes = dateKey ? (notes[dateKey] || []) : [];

  const currentRangeNotes = rangeNotes.filter(rn => {
    return rn.startDate.month === currentMonth && rn.startDate.year === currentYear;
  });

  return (
    <div className="notes-section" id="notes-section">
      <div className="notes-header">
        <div className="notes-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h3>Notes</h3>
        </div>
        <div className="notes-tabs">
          <button
            className={`notes-tab ${activeTab === 'month' ? 'active' : ''}`}
            onClick={() => setActiveTab('month')}
            style={{ '--tab-color': theme.primary }}
          >
            Month
          </button>
          <button
            className={`notes-tab ${activeTab === 'date' ? 'active' : ''}`}
            onClick={() => setActiveTab('date')}
            style={{ '--tab-color': theme.primary }}
            disabled={!startDate}
          >
            Date
          </button>
          <button
            className={`notes-tab ${activeTab === 'range' ? 'active' : ''}`}
            onClick={() => setActiveTab('range')}
            style={{ '--tab-color': theme.primary }}
            disabled={!startDate || !endDate}
          >
            Range
          </button>
        </div>
      </div>

      <div className="notes-context">
        {activeTab === 'month' && (
          <span className="context-label">
            Memos for <strong>{MONTH_NAMES[currentMonth]} {currentYear}</strong>
          </span>
        )}
        {activeTab === 'date' && startDate && (
          <span className="context-label">
            Notes for <strong>{formatDate(startDate)}</strong>
          </span>
        )}
        {activeTab === 'range' && startDate && endDate && (
          <span className="context-label">
            Notes for <strong>{formatDate(startDate)} → {formatDate(endDate)}</strong>
          </span>
        )}
      </div>

      <form className="notes-input-area" onSubmit={handleSubmit}>
        <textarea
          className="notes-textarea"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeTab === 'month' ? 'Write a memo for this month...' :
            activeTab === 'date' ? (startDate ? 'Add a note for this date...' : 'Select a date first...') :
            'Add a note for the selected range...'
          }
          rows={2}
          disabled={
            (activeTab === 'date' && !startDate) ||
            (activeTab === 'range' && (!startDate || !endDate))
          }
        />
        <button
          type="submit"
          className="add-note-btn"
          style={{ background: theme.primary }}
          disabled={
            !noteInput.trim() ||
            (activeTab === 'date' && !startDate) ||
            (activeTab === 'range' && (!startDate || !endDate))
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </form>

      <div className="notes-list">
        {activeTab === 'month' && (
          <>
            {generalNotes.length === 0 && monthNoteEntries.length === 0 && (
              <div className="notes-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p>No notes for this month yet</p>
              </div>
            )}
            {generalNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={() => removeNoteFromDate(generalKey, note.id)}
                theme={theme}
              />
            ))}
          </>
        )}

        {activeTab === 'date' && (
          <>
            {dateNotes.length === 0 && (
              <div className="notes-empty">
                <p>{startDate ? 'No notes for this date' : 'Select a date to view notes'}</p>
              </div>
            )}
            {dateNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={() => removeNoteFromDate(dateKey, note.id)}
                theme={theme}
              />
            ))}
          </>
        )}

        {activeTab === 'range' && (
          <>
            {currentRangeNotes.length === 0 && (
              <div className="notes-empty">
                <p>{startDate && endDate ? 'No range notes yet' : 'Select a date range first'}</p>
              </div>
            )}
            {currentRangeNotes.map((note) => (
              <div key={note.id} className="note-item range-note">
                <div className="note-content">
                  <span className="range-label">{note.label}</span>
                  <p className="note-text">{note.text}</p>
                </div>
                <button
                  className="note-delete"
                  onClick={() => removeRangeNote(note.id)}
                  aria-label="Delete note"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Lined paper effect */}
      <div className="notes-lines">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="notes-line" />
        ))}
      </div>
    </div>
  );
}

function NoteItem({ note, onDelete, theme }) {
  return (
    <div className="note-item">
      <div className="note-bullet" style={{ background: theme.primary }} />
      <div className="note-content">
        <p className="note-text">{note.text}</p>
        <span className="note-time">
          {new Date(note.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>
      <button
        className="note-delete"
        onClick={onDelete}
        aria-label="Delete note"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
