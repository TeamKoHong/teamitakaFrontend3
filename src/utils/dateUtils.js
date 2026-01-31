/**
 * 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환
 * @param {string} dateString - ISO 날짜 문자열 (예: "2025-01-23")
 * @returns {string} - 변환된 날짜 문자열 (예: "2025.01.23")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return dateString.replace(/-/g, '.').slice(0, 10);
}

/**
 * 시작일과 종료일을 "YYYY.MM.DD - YYYY.MM.DD" 형식으로 반환
 * @param {string} startDate - 시작일 (ISO 형식)
 * @param {string} endDate - 종료일 (ISO 형식)
 * @returns {string} - 날짜 범위 문자열
 */
export function formatDateRange(startDate, endDate) {
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }
  return formattedStart || formattedEnd || '';
}

/**
 * 날짜를 한국어 형식으로 변환 (요일 포함)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} - "M월 D일(요일)" 형식 (예: "8월 3일(일)")
 */
export function formatKoreanDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  return `${month}월 ${day}일(${dayOfWeek})`;
}

/**
 * 시작일과 종료일을 한국어 형식으로 변환 (요일 포함)
 * @param {string} startDate - 시작일 (ISO 형식)
 * @param {string} endDate - 종료일 (ISO 형식)
 * @returns {string} - "M월 D일(요일) - M월 D일(요일)" 형식
 */
export function formatKoreanDateRange(startDate, endDate) {
  const start = formatKoreanDate(startDate);
  const end = formatKoreanDate(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }
  return start || end || '';
}

/**
 * 상대 시간 표시 ("방금 전", "1시간 전" 등)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} - 상대 시간 문자열
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}주 전`;
  } else if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  } else {
    return `${diffYears}년 전`;
  }
}
