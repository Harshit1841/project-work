import { useCalendar } from '../context/CalendarContext';
import { isSameDate, isInRange, MONTH_THEMES } from '../utils/calendarUtils';
import './DayCell.css';

export default function DayCell({ date }) {
  const {
    startDate,
    endDate,
    hoverDate,
    handleDateClick,
    setHoverDate,
    currentMonth,
    notes,
  } = useCalendar();

  const theme = MONTH_THEMES[currentMonth];
  const isStart = isSameDate(date, startDate);
  const isEnd = isSameDate(date, endDate);
  const isSelected = isStart || isEnd;

  // Determine the effective end for range highlighting
  const effectiveEnd = endDate || (startDate && hoverDate ? hoverDate : null);
  let inRange = false;
  if (startDate && effectiveEnd) {
    const d = new Date(date.year, date.month, date.day);
    const s = new Date(startDate.year, startDate.month, startDate.day);
    const e = new Date(effectiveEnd.year, effectiveEnd.month, effectiveEnd.day);
    const [rangeStart, rangeEnd] = s <= e ? [s, e] : [e, s];
    inRange = d > rangeStart && d < rangeEnd;
  }

  const isWeekend = false; // We'll compute column-based
  const noteKey = `${date.year}-${date.month}-${date.day}`;
  const hasNotes = notes[noteKey] && notes[noteKey].length > 0;

  const classNames = [
    'day-cell',
    !date.isCurrentMonth && 'other-month',
    date.isToday && 'today',
    isStart && 'range-start',
    isEnd && 'range-end',
    inRange && 'in-range',
    isSelected && 'selected',
    date.holiday && 'holiday',
    hasNotes && 'has-notes',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={() => handleDateClick(date)}
      onMouseEnter={() => date.isCurrentMonth && setHoverDate(date)}
      onMouseLeave={() => setHoverDate(null)}
      style={{
        '--theme-primary': theme.primary,
        '--theme-accent': theme.accent,
        '--theme-bg': theme.bg,
      }}
      disabled={!date.isCurrentMonth}
      aria-label={`${date.day} ${date.isCurrentMonth ? '' : '(another month)'}`}
      id={`day-${date.year}-${date.month}-${date.day}`}
    >
      <span className="day-number">{date.day}</span>
      {date.holiday && (
        <span className="holiday-dot" title={date.holiday} />
      )}
      {hasNotes && (
        <span className="note-indicator" />
      )}
    </button>
  );
}
