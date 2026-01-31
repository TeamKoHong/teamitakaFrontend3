import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import "./Calendar.scss";
import userDefaultImg from "../../assets/icons/user_default_img.svg";
import AddEventModal from "./AddEventModal";

import { getProjectSchedules } from "../../services/projects";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Calendar({ projectId, onDayClick, isModalOpen, onCloseModal, selectedDate: externalSelectedDate }) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(false);



  // ✅ 1. 일정 조회 (GET) - 새로운 API 함수 사용
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        console.log(`📅 일정 조회 요청: Project ID ${projectId}`);

        const schedules = await getProjectSchedules(projectId);
        console.log("✅ 불러온 일정:", schedules);

        const newEvents = {};
        if (Array.isArray(schedules)) {
          schedules.forEach((item) => {
            const dateKey = dayjs(item.date).format("YYYY-MM-DD");
            if (!newEvents[dateKey]) newEvents[dateKey] = [];

            newEvents[dateKey].push({
              id: item.id || item.schedule_id,
              title: item.title,
              desc: item.description,
              author: item.author || "사용자",
              authorProfile: userDefaultImg,
              createdAt: item.date
            });
          });
        }
        setEvents(newEvents);
      } catch (error) {
        console.error("❌ 일정 불러오기 실패:", error);

        if (error.code === 'UNAUTHORIZED') {
          alert("로그인이 필요합니다.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [currentMonth, projectId, navigate]);

  // (중간 달력 계산 로직은 기존과 동일)
  const monthLabel = useMemo(() => currentMonth.format("YYYY.MM"), [currentMonth]);
  const monthStart = currentMonth.startOf("month");
  const offset = (monthStart.day() + 6) % 7;
  const daysInMonth = monthStart.endOf("month").date();
  const weekCount = Math.ceil((offset + daysInMonth) / 7);
  const gridStart = monthStart.subtract(offset, "day");
  const monthDays = useMemo(() => Array.from({ length: weekCount * 7 }).map((_, i) => gridStart.add(i, "day")), [gridStart, weekCount]);
  const isToday = (date) => date.isSame(dayjs(), "day");
  const hasEvents = (date) => { const k = date.format("YYYY-MM-DD"); return events[k] && events[k].length > 0; };
  // externalSelectedDate 또는 내부 selectedDate 사용
  const currentSelectedDate = externalSelectedDate ? dayjs(externalSelectedDate) : selectedDate;

  const selectedDateEvents = useMemo(() => {
    if (!currentSelectedDate) return [];
    const k = currentSelectedDate.format("YYYY-MM-DD");
    return (events[k] || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [currentSelectedDate, events]);

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));

  return (
    <>
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">‹</button>
          <div className="month-label">{monthLabel}</div>
          <button onClick={nextMonth} className="nav-btn">›</button>
        </div>
        <div className="weekday-row">
          {WEEKDAYS.map((wd) => (<div key={wd} className="weekday">{wd}</div>))}
        </div>
        <div className="dates-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#999' }}>
              일정을 불러오는 중...
            </div>
          ) : (
            monthDays.map((day, idx) => {
              const inMonth = day.isSame(currentMonth, "month");
              const isSelected = currentSelectedDate && day.isSame(currentSelectedDate, "date");
              const isTodayDate = isToday(day);
              const hasEventsForDate = hasEvents(day);
              return (
                <div key={idx} className={`date-cell ${inMonth ? "" : "disabled"} ${isSelected ? "selected" : ""} ${isTodayDate ? "today" : ""}`}
                  onClick={() => { if (inMonth) { setSelectedDate(day); onDayClick?.(day.toDate()); } }}>
                  <div className="date-number">{day.format("DD")}</div>
                  {hasEventsForDate && <div className="event-dot"></div>}
                </div>
              );
            })
          )}
        </div>
      </div>
      {currentSelectedDate && (
        <div className="selected-date-container">
          <div className="selected-date-info">
            <div className="date-label">{currentSelectedDate.format("MM")}월 {currentSelectedDate.format("DD")}일</div>
          </div>
          <div className="events-list">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div className="event-item" key={event.id}>
                  <div className="event-profile"><img src={event.authorProfile || userDefaultImg} alt={event.author} /></div>
                  <div className="event-content"><div className="event-title">{event.title}</div><div className="event-desc">{event.desc}</div></div>
                </div>
              ))
            ) : (<div className="no-events">일정이 없습니다.</div>)}
          </div>
        </div>
      )}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        projectId={projectId}
        selectedDate={currentSelectedDate ? currentSelectedDate.toDate() : null}
        onEventCreated={(newEvent, dateKey) => {
          setEvents(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newEvent]
          }));
        }}
      />
    </>
  );
}