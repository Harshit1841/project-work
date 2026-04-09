import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatDate } from '../utils/calendarUtils';

const CalendarContext = createContext();

/**
 * Load notes from localStorage
 */
function loadNotes() {
  try {
    const stored = localStorage.getItem('calendar-notes');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save notes to localStorage
 */
function saveNotes(notes) {
  localStorage.setItem('calendar-notes', JSON.stringify(notes));
}

/**
 * Load range notes from localStorage
 */
function loadRangeNotes() {
  try {
    const stored = localStorage.getItem('calendar-range-notes');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRangeNotes(rangeNotes) {
  localStorage.setItem('calendar-range-notes', JSON.stringify(rangeNotes));
}

export function CalendarProvider({ children }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [notes, setNotes] = useState(loadNotes);
  const [rangeNotes, setRangeNotes] = useState(loadRangeNotes);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('calendar-dark-mode') === 'true';
    } catch {
      return false;
    }
  });

  // Persist notes
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveRangeNotes(rangeNotes);
  }, [rangeNotes]);

  useEffect(() => {
    localStorage.setItem('calendar-dark-mode', darkMode.toString());
  }, [darkMode]);

  const goToNextMonth = useCallback(() => {
    if (isFlipping) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
      setIsFlipping(false);
    }, 500);
  }, [currentMonth, isFlipping]);

  const goToPrevMonth = useCallback(() => {
    if (isFlipping) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
      setIsFlipping(false);
    }, 500);
  }, [currentMonth, isFlipping]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }, []);

  const handleDateClick = useCallback((date) => {
    if (!date.isCurrentMonth) return;

    if (!startDate || (startDate && endDate)) {
      // Start fresh selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Set end date
      const clickedDate = new Date(date.year, date.month, date.day);
      const start = new Date(startDate.year, startDate.month, startDate.day);

      if (clickedDate < start) {
        setEndDate(startDate);
        setStartDate(date);
      } else if (clickedDate.getTime() === start.getTime()) {
        // Same date - toggle off
        setStartDate(null);
      } else {
        setEndDate(date);
      }
    }
  }, [startDate, endDate]);

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
  }, []);

  const addNoteToDate = useCallback((dateKey, noteText) => {
    setNotes(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { id: Date.now(), text: noteText, createdAt: new Date().toISOString() }]
    }));
  }, []);

  const removeNoteFromDate = useCallback((dateKey, noteId) => {
    setNotes(prev => {
      const updated = { ...prev };
      updated[dateKey] = updated[dateKey].filter(n => n.id !== noteId);
      if (updated[dateKey].length === 0) delete updated[dateKey];
      return updated;
    });
  }, []);

  const addRangeNote = useCallback((noteText) => {
    if (!startDate || !endDate) return;
    setRangeNotes(prev => [
      ...prev,
      {
        id: Date.now(),
        text: noteText,
        startDate,
        endDate,
        label: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        createdAt: new Date().toISOString()
      }
    ]);
  }, [startDate, endDate]);

  const removeRangeNote = useCallback((noteId) => {
    setRangeNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const value = {
    currentMonth,
    currentYear,
    startDate,
    endDate,
    hoverDate,
    notes,
    rangeNotes,
    isFlipping,
    flipDirection,
    darkMode,
    setHoverDate,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    handleDateClick,
    clearSelection,
    addNoteToDate,
    removeNoteFromDate,
    addRangeNote,
    removeRangeNote,
    toggleDarkMode,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}

export default CalendarContext;
