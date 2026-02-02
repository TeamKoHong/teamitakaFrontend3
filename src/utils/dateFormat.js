/**
 * 날짜 포맷팅 유틸리티
 * ISO 8601 날짜 문자열을 사용자 친화적인 형식으로 변환
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

/**
 * ISO 날짜 문자열을 읽기 쉬운 형식으로 변환
 * @param {string} isoString - ISO 8601 날짜 문자열 (예: "2025-10-26T00:00:00.000Z")
 * @param {string} format - 'dot' (2025.10.26) 또는 'dash' (2025-10-26)
 * @returns {string|null} 포맷된 날짜 문자열 또는 null
 *
 * @example
 * formatDate("2025-10-26T00:00:00.000Z", "dot") // "2025.10.26"
 * formatDate("2025-10-26T00:00:00.000Z", "dash") // "2025-10-26"
 */
export const formatDate = (isoString, format = 'dot') => {
  if (!isoString) return null;

  try {
    const date = new Date(isoString);

    // Invalid date check
    if (isNaN(date.getTime())) {

      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const separator = format === 'dot' ? '.' : '-';
    return `${year}${separator}${month}${separator}${day}`;
  } catch (error) {

    return null;
  }
};

/**
 * 날짜 범위를 포맷팅
 * @param {string} startDate - 시작 날짜 ISO 문자열
 * @param {string} endDate - 종료 날짜 ISO 문자열
 * @param {string} format - 날짜 형식 ('dot' 또는 'dash')
 * @returns {string|null} 포맷된 날짜 범위 (예: "2025.10.26 ~ 2025.12.03") 또는 null
 *
 * @example
 * formatDateRange("2025-10-26T00:00:00.000Z", "2025-12-03T00:00:00.000Z")
 * // "2025.10.26 ~ 2025.12.03"
 */
export const formatDateRange = (startDate, endDate, format = 'dot') => {
  const formattedStart = formatDate(startDate, format);
  const formattedEnd = formatDate(endDate, format);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} ~ ${formattedEnd}`;
  }

  return null;
};

/**
 * 상대적인 날짜 상태를 반환 (선택적 기능)
 * @param {string} startDate - 시작 날짜 ISO 문자열
 * @param {string} endDate - 종료 날짜 ISO 문자열
 * @returns {string} 상태 문자열 ("D-3", "진행 중", "종료됨")
 *
 * @example
 * getRelativeDate("2025-12-01T00:00:00.000Z", "2025-12-31T00:00:00.000Z")
 * // "D-10" 또는 "진행 중" 또는 "종료됨"
 */
export const getRelativeDate = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  try {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    // 시작 전
    if (now < start) {
      const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
      return `D-${daysUntil}`;
    }
    // 진행 중
    else if (now >= start && now <= end) {
      return '진행 중';
    }
    // 종료
    else {
      return '종료됨';
    }
  } catch (error) {

    return null;
  }
};

/**
 * 상대적인 시간을 반환 (예: "2시간 전", "3일 전")
 * @param {string} dateString - ISO 8601 날짜 문자열
 * @returns {string|null} 상대 시간 문자열 또는 null
 *
 * @example
 * getRelativeTime("2025-12-20T10:00:00.000Z") // "2시간 전"
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return null;

  try {
    const date = dayjs(dateString);
    if (!date.isValid()) {

      return null;
    }
    return date.fromNow();
  } catch (error) {

    return null;
  }
};