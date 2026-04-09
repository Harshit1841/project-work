import { useCalendar } from '../context/CalendarContext';
import { formatDate, getDaysBetween, MONTH_THEMES } from '../utils/calendarUtils';
import './SelectionInfo.css';

export default function SelectionInfo() {
  const { startDate, endDate, currentMonth, clearSelection } = useCalendar();
  const theme = MONTH_THEMES[currentMonth];

  if (!startDate) return null;

  const dayCount = endDate ? getDaysBetween(startDate, endDate) : 1;

  return (
    <div
      className="selection-info"
      id="selection-info"
      style={{ '--sel-color': theme.primary, '--sel-bg': theme.bg }}
    >
      <div className="selection-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <div className="selection-text">
          <span className="sel-label">
            {endDate ? 'Selected Range' : 'Start Date'}
          </span>
          <span className="sel-dates">
            {formatDate(startDate)}
            {endDate && (
              <>
                <span className="sel-arrow"> → </span>
                {formatDate(endDate)}
              </>
            )}
          </span>
        </div>
      </div>
      <div className="selection-meta">
        <span className="day-count" style={{ background: theme.primary }}>
          {dayCount} {dayCount === 1 ? 'day' : 'days'}
        </span>
        {!endDate && (
          <span className="sel-hint">Click another date to set range</span>
        )}
      </div>
    </div>
  );
}
