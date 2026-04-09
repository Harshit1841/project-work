import { useCalendar } from '../context/CalendarContext';
import { generateCalendarGrid, DAY_NAMES, MONTH_THEMES } from '../utils/calendarUtils';
import DayCell from './DayCell';
import './CalendarGrid.css';

export default function CalendarGrid() {
  const { currentMonth, currentYear, isFlipping, flipDirection } = useCalendar();
  const grid = generateCalendarGrid(currentYear, currentMonth);
  const theme = MONTH_THEMES[currentMonth];

  return (
    <div
      className={`calendar-grid-wrapper ${isFlipping ? `grid-flipping-${flipDirection}` : ''}`}
      id="calendar-grid"
    >
      <div className="calendar-day-headers">
        {DAY_NAMES.map((day, idx) => (
          <div
            key={day}
            className={`day-header ${idx >= 5 ? 'weekend-header' : ''}`}
            style={{ '--header-color': theme.primary }}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {grid.map((date, idx) => (
          <DayCell key={idx} date={date} />
        ))}
      </div>
    </div>
  );
}
