import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectSchedules } from "../../services/projects";
import "./SlideContentSchedule.scss";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function SlideContentSchedule({ projectId }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // today를 한 번만 생성하여 참조 고정
  const today = useMemo(() => new Date(), []);
  const [weekOffset] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 이번 주 월요일(weekOffset 주차)~일요일 날짜 배열 생성
  const weekDates = useMemo(() => {
    const base = new Date(today);
    base.setDate(base.getDate() + weekOffset * 7);

    const dayOfWeek = base.getDay(); // 0=Sun,1=Mon...
    const diffToMon = (dayOfWeek + 6) % 7; // Mon=1→0, Sun=0→6
    const mon = new Date(base);
    mon.setDate(base.getDate() - diffToMon);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d;
    });
  }, [today, weekOffset]);

  // API로 일정 불러오기
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);
        console.log(`📅 SlideContentSchedule - 일정 조회: Project ID ${projectId}`);

        const schedules = await getProjectSchedules(projectId);
        console.log("✅ 불러온 일정:", schedules);

        const newEvents = {};
        if (Array.isArray(schedules)) {
          schedules.forEach((item) => {
            // date 필드를 YYYY-MM-DD 형식으로 변환
            const dateKey = item.date ? item.date.slice(0, 10) : null;
            if (!dateKey) return;
            
            if (!newEvents[dateKey]) newEvents[dateKey] = [];
            
            newEvents[dateKey].push({
              id: item.id || item.schedule_id,
              desc: item.description || item.title || "일정",
              title: item.title,
            });
          });
        }
        setEvents(newEvents);
      } catch (error) {
        console.error("❌ 일정 불러오기 실패:", error);
        console.error("❌ 에러 상세:", {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        
        if (error.code === 'UNAUTHORIZED') {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }
        
        // 500 에러 등 서버 오류의 경우 빈 배열로 처리 (에러 메시지 표시하지 않음)
        console.warn("⚠️ 서버에서 일정을 불러올 수 없습니다. 빈 상태로 표시합니다.");
        setEvents({});
        setError(null); // 에러 메시지를 표시하지 않음
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [projectId, navigate]);

  // 마운트 시 오늘 인덱스 설정
  useEffect(() => {
    const idx = weekDates.findIndex(
      (d) => d.toDateString() === today.toDateString()
    );
    setSelectedIdx(idx >= 0 ? idx : 0);
  }, [weekDates, today]);

  // weekOffset이 바뀔 때는 월요일(인덱스 0)으로 리셋
  useEffect(() => {
    if (weekOffset !== 0) {
      setSelectedIdx(0);
    }
  }, [weekOffset]);

  // 헤더 월.년 포맷
  const headerLabel = useMemo(() => {
    const d = weekDates[0];
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, [weekDates]);

  // 선택된 날짜 key, 해당 날짜 이벤트
  const selectedKey = weekDates[selectedIdx].toISOString().slice(0, 10);
  const todaysEvents = events[selectedKey] || [];

  return (
    <div className="slide-card schedule-slide">
      <div className="schedule-header-container">
        <div className="schedule-header">{headerLabel}</div>
      </div>

      <div className="week-row">
        {weekDates.map((d, i) => {
          const dayNum = String(d.getDate()).padStart(2, "0");
          return (
            <div
              key={i}
              className={`week-day ${i === selectedIdx ? "selected" : ""}`}
              onClick={() => setSelectedIdx(i)}
            >
              <div className="abbr">{WEEKDAYS[i]}</div>
              <div className="date">{dayNum}</div>
            </div>
          );
        })}
      </div>

      <div className="events-list">
        {loading && (
          <div className="empty-message">일정을 불러오는 중...</div>
        )}
        {error && (
          <div className="empty-message" style={{ color: '#F76241' }}>{error}</div>
        )}
        {!loading && !error && todaysEvents.length === 0 && (
          <div className="empty-message">일정이 없습니다.</div>
        )}
        {!loading && !error && todaysEvents.map((ev, i) => (
          <div className="event-item" key={i}>
            <div className="bullet"></div>
            <div className="desc">{ev.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
