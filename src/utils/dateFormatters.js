/**
 * Date and time formatting utilities for Team Itaka
 */

/**
 * Format date range as "YYYY.MM.DD ~ YYYY.MM.DD"
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {string} Formatted date range or fallback message
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '기간 미정';

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
};

/**
 * Calculate days from start date as "D+n"
 * @param {string} startDate - ISO date string
 * @returns {string} Formatted days indicator (e.g., "D+47")
 */
export const calculateDaysFromStart = (startDate) => {
  // Return D+0 if no start date provided
  if (!startDate) {
    if (process.env.NODE_ENV === 'development') {

    }
    return 'D+0';
  }

  try {
    const start = new Date(startDate);

    // Check if date is valid
    if (isNaN(start.getTime())) {

      return 'D+0';
    }

    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `D+${diffDays}`;
  } catch (error) {

    return 'D+0';
  }
};

/**
 * Format meeting schedule to Korean
 * @param {string|object} meetingSchedule - Meeting schedule string or object
 * @returns {string} Formatted meeting time or fallback message
 *
 * Examples:
 * - String: "매주 월요일 19:00" → "매주 월요일 19:00"
 * - Object: { day: 'monday', time: '19:00', frequency: 'weekly' } → "매주 월요일 19:00"
 */
export const formatMeetingTime = (meetingSchedule) => {
  if (!meetingSchedule) return '회의 시간 미정';

  // If already a formatted string, return as is
  if (typeof meetingSchedule === 'string') {
    return meetingSchedule;
  }

  // If object, format it
  const { day, time, frequency } = meetingSchedule;

  const dayMap = {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일'
  };

  const frequencyMap = {
    weekly: '매주',
    biweekly: '격주',
    monthly: '매월'
  };

  const dayKr = dayMap[day] || day;
  const freq = frequencyMap[frequency] || frequency;

  return `${freq} ${dayKr} ${time}`;
};
