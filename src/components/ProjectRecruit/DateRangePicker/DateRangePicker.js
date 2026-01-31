// src/components/ProjectRecruit/DateRangePicker/DateRangePicker.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import './DateRangePicker.scss';
import { showWarningToast } from '../../../utils/toast';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function DateRangePicker({
  startDate,
  endDate,
  onDateSelect,
  maxRangeWeeks = 2,
  minDate = dayjs(),
}) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [tempStart, setTempStart] = useState(startDate ? dayjs(startDate) : null);
  const [tempEnd, setTempEnd] = useState(endDate ? dayjs(endDate) : null);

  // Prevent duplicate clicks
  const lastClickRef = useRef(0);

  // Sync with props
  useEffect(() => {
    if (startDate) setTempStart(dayjs(startDate));
    if (endDate) setTempEnd(dayjs(endDate));
  }, [startDate, endDate]);

  // Month label (YYYY년 M월 format)
  const monthLabel = useMemo(
    () => currentMonth.format('YYYY년 M월'),
    [currentMonth]
  );

  // Calendar grid calculation
  const monthStart = currentMonth.startOf('month');
  const offset = (monthStart.day() + 6) % 7; // Mon→0, ..., Sun→6
  const daysInMonth = monthStart.endOf('month').date();
  const weekCount = Math.ceil((offset + daysInMonth) / 7);
  const gridStart = monthStart.subtract(offset, 'day');

  const monthDays = useMemo(
    () =>
      Array.from({ length: weekCount * 7 }).map((_, i) =>
        gridStart.add(i, 'day')
      ),
    [gridStart, weekCount]
  );

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, 'month'));

  // Date selection logic
  const handleDayClick = (day) => {
    // Prevent duplicate clicks within 300ms
    const now = Date.now();
    if (now - lastClickRef.current < 300) {
      return;
    }
    lastClickRef.current = now;

    // Can't select past dates
    if (day.isBefore(minDate, 'day')) {
      return;
    }

    // Can't select dates outside current month
    if (!day.isSame(currentMonth, 'month')) {
      return;
    }

    // Two-stage selection
    if (!tempStart || (tempStart && tempEnd)) {
      // First click or reset
      setTempStart(day);
      setTempEnd(null);
      onDateSelect(day.toDate(), null);
    } else {
      // Second click
      if (day.isBefore(tempStart, 'day')) {
        // Check max range before swapping
        const diffDays = tempStart.diff(day, 'day');
        const maxDays = maxRangeWeeks * 7;

        if (diffDays > maxDays) {
          showWarningToast(`모집 기간은 최대 ${maxRangeWeeks}주까지 설정할 수 있어요.`);
          return;
        }

        // Swap if valid
        setTempStart(day);
        setTempEnd(tempStart);
        onDateSelect(day.toDate(), tempStart.toDate());
      } else {
        // Check max range
        const diffDays = day.diff(tempStart, 'day');
        const maxDays = maxRangeWeeks * 7;

        if (diffDays > maxDays) {
          showWarningToast(`모집 기간은 최대 ${maxRangeWeeks}주까지 설정할 수 있어요.`);
          return;
        }

        setTempEnd(day);
        onDateSelect(tempStart.toDate(), day.toDate());
      }
    }
  };

  // Check if date is in selected range
  const isInRange = (day) => {
    if (!tempStart || !tempEnd) return false;
    return day.isAfter(tempStart, 'day') && day.isBefore(tempEnd, 'day');
  };

  // Check if date is start or end
  const isStartDate = (day) => {
    return tempStart && day.isSame(tempStart, 'day');
  };

  const isEndDate = (day) => {
    return tempEnd && day.isSame(tempEnd, 'day');
  };

  // Check if date is today
  const isToday = (day) => {
    return day.isSame(dayjs(), 'day');
  };

  // Check if date is disabled (past)
  const isDisabled = (day) => {
    return day.isBefore(minDate, 'day');
  };

  // Check if date is in-range start (first day after start date)
  const isInRangeStart = (day) => {
    if (!tempStart || !tempEnd) return false;
    return day.isSame(tempStart.add(1, 'day'), 'day');
  };

  // Check if date is in-range end (last day before end date)
  const isInRangeEnd = (day) => {
    if (!tempStart || !tempEnd) return false;
    return day.isSame(tempEnd.subtract(1, 'day'), 'day');
  };

  // Check if date is at the start of a row (Monday)
  const isRowStart = (day) => {
    return (day.day() + 6) % 7 === 0;
  };

  // Check if date is at the end of a row (Sunday)
  const isRowEnd = (day) => {
    return (day.day() + 6) % 7 === 6;
  };

  return (
    <div className="date-range-picker">
      {/* Header */}
      <div className="picker-header">
        <div className="month-label">{monthLabel}</div>
        <div className="nav-controls">
          <button onClick={prevMonth} className="nav-btn" aria-label="이전 달">
            ‹
          </button>
          <button onClick={nextMonth} className="nav-btn" aria-label="다음 달">
            ›
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="weekday-row">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="weekday">
            {wd}
          </div>
        ))}
      </div>

      {/* Dates grid */}
      <div className="dates-grid">
        {monthDays.map((day, idx) => {
          const inMonth = day.isSame(currentMonth, 'month');
          const disabled = isDisabled(day);
          const start = isStartDate(day);
          const end = isEndDate(day);
          const inRange = isInRange(day);
          const inRangeStart = isInRangeStart(day);
          const inRangeEnd = isInRangeEnd(day);
          const today = isToday(day);
          const rowStart = isRowStart(day);
          const rowEnd = isRowEnd(day);

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day)}
              disabled={disabled || !inMonth}
              className={`
                day-cell
                ${!inMonth ? 'out-of-month' : ''}
                ${disabled ? 'disabled' : ''}
                ${start ? 'start-date' : ''}
                ${end ? 'end-date' : ''}
                ${inRange ? 'in-range' : ''}
                ${inRangeStart ? 'in-range-start' : ''}
                ${inRangeEnd ? 'in-range-end' : ''}
                ${today ? 'today' : ''}
                ${rowStart ? 'row-start' : ''}
                ${rowEnd ? 'row-end' : ''}
              `}
            >
              <span className="day-number">{day.date()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
