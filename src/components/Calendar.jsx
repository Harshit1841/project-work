import { useCalendar } from '../context/CalendarContext';
import SpiralBinding from './SpiralBinding';
import CalendarHeader from './CalendarHeader';
import MonthNavigation from './MonthNavigation';
import CalendarGrid from './CalendarGrid';
import SelectionInfo from './SelectionInfo';
import NotesSection from './NotesSection';
import './Calendar.css';

export default function Calendar() {
  const { darkMode } = useCalendar();

  // Set theme on root element
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }

  return (
    <div className="calendar-container" id="calendar-container">
      <div className="calendar-wall">
        <div className="calendar-card">
          {/* Spiral Binding */}
          <SpiralBinding />

          {/* Top Section: Hero Image + Month/Year */}
          <div className="calendar-top">
            <CalendarHeader />
          </div>

          {/* Bottom Section: Notes + Grid side by side on desktop */}
          <div className="calendar-bottom">
            {/* Notes Panel (left side on desktop like reference) */}
            <div className="calendar-notes-panel">
              <NotesSection />
            </div>

            {/* Calendar Grid Panel (right side on desktop) */}
            <div className="calendar-grid-panel">
              <MonthNavigation />
              <SelectionInfo />
              <CalendarGrid />
            </div>
          </div>
        </div>

        {/* Shadow effect for depth */}
        <div className="calendar-shadow" />
      </div>
    </div>
  );
}
