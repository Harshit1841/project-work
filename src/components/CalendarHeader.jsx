import { useCalendar } from '../context/CalendarContext';
import { MONTH_NAMES, MONTH_IMAGES, MONTH_THEMES } from '../utils/calendarUtils';
import './CalendarHeader.css';

export default function CalendarHeader() {
  const { currentMonth, currentYear, isFlipping, flipDirection } = useCalendar();

  const theme = MONTH_THEMES[currentMonth];
  const imageSrc = MONTH_IMAGES[currentMonth];

  return (
    <div
      className={`calendar-header ${isFlipping ? `flipping-${flipDirection}` : ''}`}
      id="calendar-header"
    >
      <div className="header-image-container">
        <img
          src={imageSrc}
          alt={`${MONTH_NAMES[currentMonth]} landscape`}
          className="header-image"
          loading="eager"
        />
        <div className="header-overlay" />
        <div
          className="header-wave"
          style={{ '--wave-color': theme.primary }}
        >
          <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="wave-svg">
            <path
              d="M0,50 C100,80 200,0 300,40 C400,80 450,20 500,40 L500,80 L0,80 Z"
              fill={theme.primary}
              opacity="0.9"
            />
          </svg>
        </div>
        <div className="header-info">
          <span className="header-year">{currentYear}</span>
          <h1 className="header-month">{MONTH_NAMES[currentMonth].toUpperCase()}</h1>
        </div>
      </div>
    </div>
  );
}
