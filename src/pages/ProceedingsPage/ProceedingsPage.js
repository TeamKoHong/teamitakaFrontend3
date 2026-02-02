import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import addNoteIcon from "../../assets/icons/add_note.png";
import userDefaultImg from "../../assets/icons/user_default_img.svg";
import { getProjectMeetings } from "../../services/projects";
import "./ProceedingPage.scss";

export default function ProceedingsPage() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [meetingData, setMeetingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleCreateMeeting = () => {
    navigate(`/project/${projectId}/proceedings/create`);
  };

  // 회의록 데이터를 가져오는 함수
  const loadMeetingData = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProjectMeetings(projectId);
      const meetings = result.items || [];
      
      // 회의록을 월/일별로 그룹화
      const groupedData = {};
      
      meetings.forEach(meeting => {
        const meetingDate = new Date(meeting.meeting_date || meeting.createdAt);
        const month = `${String(meetingDate.getMonth() + 1).padStart(2, '0')}월`;
        const day = `${String(meetingDate.getDate()).padStart(2, '0')}일`;
        
        if (!groupedData[month]) {
          groupedData[month] = {};
        }
        
        if (!groupedData[month][day]) {
          groupedData[month][day] = [];
        }
        
        groupedData[month][day].push({
          id: meeting.meeting_id,
          title: meeting.title || "회의록",
          author: meeting.Creator?.username || "작성자",
          avatar: meeting.Creator?.avatar || userDefaultImg,
          description: meeting.content || "회의에 대한 간단 메모",
          createdAt: meeting.createdAt,
          updatedAt: meeting.updatedAt
        });
      });
      
      // 데이터를 컴포넌트 형식으로 변환
      const formattedData = Object.keys(groupedData)
        .sort((a, b) => parseInt(b) - parseInt(a)) // 최신 월이 위로
        .map(month => ({
          month,
          meetings: Object.keys(groupedData[month])
            .sort((a, b) => parseInt(b) - parseInt(a)) // 최신 일이 위로
            .map(day => ({
              day,
              entries: groupedData[month][day]
            }))
        }));
      
      setMeetingData(formattedData);
    } catch (err) {

      if (err.code === 'UNAUTHORIZED') {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      
      setError("회의록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    loadMeetingData();
  }, [loadMeetingData]);

  // 페이지 포커스 시 데이터 새로고침 (새 회의록 생성 후 돌아올 때)
  useEffect(() => {
    const handleFocus = () => {
      loadMeetingData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadMeetingData]);

  return (
    <div className="proceedings-page-container">
      <DefaultHeader title="팀 회의록" showChat={false} backPath={`/project/${projectId}`} />
      
      <div className="proceedings-content">
        {loading && (
          <div className="empty-state">
            <p>회의록을 불러오는 중...</p>
          </div>
        )}
        
        {error && (
          <div className="empty-state">
            <p style={{ color: '#F76241' }}>{error}</p>
          </div>
        )}
        
        {!loading && !error && meetingData.length === 0 && (
          <div className="empty-state">
            <p>아직 작성된 회의록이 없습니다.</p>
            <p className="empty-description">회의록을 작성해보세요!</p>
          </div>
        )}
        
        {!loading && !error && meetingData.length > 0 && meetingData.map((monthData, monthIndex) => (
          <div key={monthData.month} className="month-section">
            <h2 className="month-header">{monthData.month}</h2>
            
            {monthData.meetings.map((dayData) => (
              <div key={dayData.day} className="day-group">
                <span className="day-label">{dayData.day}</span>
                <div className="meeting-cards">
                  {dayData.entries.map((meeting) => (
                    <div key={meeting.id} className="meeting-card">
                      <h3 className="meeting-title">{meeting.title}</h3>
                      <div className="meeting-author">
                        <img src={meeting.avatar || userDefaultImg} alt="사용자 아바타" />
                        <span>{meeting.author}</span>
                      </div>
                      <p className="meeting-description">{meeting.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {monthIndex < meetingData.length - 1 && (
              <div className="month-divider"></div>
            )}
          </div>
        ))}
      </div>

      {/* 플로팅 액션 버튼 */}
      <button className="floating-action-btn" onClick={handleCreateMeeting}>
        <img src={addNoteIcon} alt="회의록 추가" />
      </button>
    </div>
  );
}
