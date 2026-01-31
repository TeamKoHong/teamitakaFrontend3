import React, { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import "./AddEventModal.scss";
import { getApiConfig } from "../../services/auth";
import userDefaultImg from "../../assets/icons/user_default_img.svg";

export default function AddEventModal({ isOpen, onClose, projectId, selectedDate, onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { API_BASE_URL } = getApiConfig();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");
      return;
    }

    try {
      setLoading(true);

      // 선택한 날짜가 없으면 오늘 날짜 사용
      const eventDate = selectedDate ? dayjs(selectedDate) : dayjs();
      
      // ISO 8601 형식으로 변환 (백엔드 요구사항)
      // 시간은 00:00:00으로 설정
      const dateString = eventDate.format("YYYY-MM-DD") + "T00:00:00Z";
      
      const payload = {
        project_id: projectId,
        title: title.trim(),
        date: dateString,
        description: description.trim()
      };

      console.log("📝 전송 데이터:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/api/schedule/create`, 
        payload, 
        {
          headers: getAuthHeader(),
          withCredentials: true
        }
      );

      console.log("✅ 저장 성공:", response.data);

      // 성공 시 화면 즉시 반영
      const dateKey = eventDate.format("YYYY-MM-DD");
      const createdEvent = {
        id: response.data.id || response.data.schedule_id,
        title: title.trim(),
        desc: description.trim(),
        author: "나", 
        authorProfile: userDefaultImg,
        createdAt: dateString
      };

      // Calendar 컴포넌트에 이벤트 추가 알림
      if (onEventCreated) {
        onEventCreated(createdEvent, dateKey);
      }

      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("❌ 일정 저장 실패:", error);
      if (error.response) {
        alert(`저장 실패 (${error.response.status}): ${error.response.data.message || "오류 발생"}`);
      } else {
        alert("서버와 통신할 수 없습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        
        <div className="modal-header">
          <h2>일정 추가</h2>
        </div>

        <div className="form-group">
          <label htmlFor="event-title">일정 제목</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="내용을 입력하세요."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-description">일정 설명</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="내용을 입력하세요."
            className="form-textarea"
            rows="3"
          />
        </div>

        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={!title.trim() || !description.trim() || loading}
        >
          {loading ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
