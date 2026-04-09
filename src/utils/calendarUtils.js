/**
 * Calendar utility functions
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const MONTH_IMAGES = {
  0: '/images/january.png',
  1: '/images/february.png',
  2: '/images/march.png',
  3: '/images/april.png',
  4: '/images/may.png',
  5: '/images/june.png',
  6: '/images/july.png',
  7: '/images/august.png',
  8: '/images/september.png',
  9: '/images/october.png',
  10: '/images/november.png',
  11: '/images/december.png',
};

// Theme colors for each month
export const MONTH_THEMES = {
  0: { primary: '#2196F3', accent: '#1565C0', bg: '#E3F2FD' },   // January - Blue
  1: { primary: '#E91E63', accent: '#AD1457', bg: '#FCE4EC' },   // February - Pink
  2: { primary: '#4CAF50', accent: '#2E7D32', bg: '#E8F5E9' },   // March - Green
  3: { primary: '#8BC34A', accent: '#558B2F', bg: '#F1F8E9' },   // April - Light Green
  4: { primary: '#9C27B0', accent: '#6A1B9A', bg: '#F3E5F5' },   // May - Purple
  5: { primary: '#00BCD4', accent: '#00838F', bg: '#E0F7FA' },   // June - Cyan
  6: { primary: '#FF9800', accent: '#E65100', bg: '#FFF3E0' },   // July - Orange
  7: { primary: '#FF5722', accent: '#BF360C', bg: '#FBE9E7' },   // August - Deep Orange
  8: { primary: '#795548', accent: '#4E342E', bg: '#EFEBE9' },   // September - Brown
  9: { primary: '#F44336', accent: '#C62828', bg: '#FFEBEE' },   // October - Red
  10: { primary: '#FF9800', accent: '#E65100', bg: '#FFF8E1' },  // November - Amber
  11: { primary: '#607D8B', accent: '#37474F', bg: '#ECEFF1' },  // December - Blue Grey
};

// Public holidays (US)
export const HOLIDAYS = {
  '1-1': 'New Year\'s Day',
  '2-14': 'Valentine\'s Day',
  '3-17': 'St. Patrick\'s Day',
  '7-4': 'Independence Day',
  '10-31': 'Halloween',
  '12-25': 'Christmas Day',
  '12-31': 'New Year\'s Eve',
  '1-26': 'Republic Day',
  '8-15': 'Independence Day',
  '10-2': 'Gandhi Jayanti',
  '11-14': 'Children\'s Day',
};

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week for the first day of a month (0 = Monday, 6 = Sunday)
 */
export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0 based
}

/**
 * Generate the calendar grid data for a given month
 */
export function generateCalendarGrid(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const grid = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({
      day: daysInPrevMonth - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const holidayKey = `${month + 1}-${i}`;
    grid.push({
      day: i,
      month,
      year,
      isCurrentMonth: true,
      isToday: isToday(year, month, i),
      holiday: HOLIDAYS[holidayKey] || null,
    });
  }

  // Next month leading days
  const remaining = 42 - grid.length; // 6 rows * 7 days
  for (let i = 1; i <= remaining; i++) {
    grid.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  return grid;
}

/**
 * Check if a date is today
 */
export function isToday(year, month, day) {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
}

/**
 * Check if a date falls within a range
 */
export function isInRange(date, startDate, endDate) {
  if (!startDate || !endDate) return false;
  const d = new Date(date.year, date.month, date.day);
  const start = new Date(startDate.year, startDate.month, startDate.day);
  const end = new Date(endDate.year, endDate.month, endDate.day);
  return d > start && d < end;
}

/**
 * Check if two dates are the same
 */
export function isSameDate(date1, date2) {
  if (!date1 || !date2) return false;
  return date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
}

/**
 * Format date for display
 */
export function formatDate(date) {
  if (!date) return '';
  return `${MONTH_NAMES[date.month]} ${date.day}, ${date.year}`;
}

/**
 * Get number of days between two dates
 */
export function getDaysBetween(start, end) {
  if (!start || !end) return 0;
  const d1 = new Date(start.year, start.month, start.day);
  const d2 = new Date(end.year, end.month, end.day);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
