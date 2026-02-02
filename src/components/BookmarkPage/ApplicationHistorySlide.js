import React, { useState, useEffect } from "react";
import projectDefaultImg from "../../assets/icons/project_default_img.png";
import { getMyApplications } from "../../services/recruitment";
import "./ApplicationHistorySlide.scss";

/**
 * 지원 상태 매핑
 * - 팀원 모집 중 (recruiting): Application.status = PENDING AND Recruitment.status = ACTIVE
 * - 팀 확정 완료 (confirmed): Application.status = APPROVED
 * - 모집 종료 (ended): Application.status = REJECTED OR (PENDING AND Recruitment.status ≠ ACTIVE)
 */
const mapApplicationStatus = (application) => {
  const appStatus = application.status;
  const recruitStatus = application.Recruitment?.status;

  if (appStatus === 'APPROVED') {
    return { status: 'confirmed', statusText: '팀 확정 완료' };
  }
  if (appStatus === 'REJECTED') {
    return { status: 'ended', statusText: '모집 종료' };
  }
  // PENDING
  if (recruitStatus === 'ACTIVE') {
    return { status: 'recruiting', statusText: '팀원 모집 중' };
  }
  return { status: 'ended', statusText: '모집 종료' };
};

const formatDate = (dateString) => {
  if (!dateString) return '00.00';
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

function ApplicationHistorySlide({ isOpen, onClose }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMyApplications();
        const data = response.data || [];

        // API 응답을 화면에 맞는 형식으로 변환
        const mappedApplications = data.map((app) => {
          const { status, statusText } = mapApplicationStatus(app);
          return {
            id: app.application_id,
            recruitmentId: app.Recruitment?.recruitment_id,
            title: app.Recruitment?.title || '프로젝트',
            description: app.Recruitment?.description || '',
            startDate: formatDate(app.Recruitment?.recruitment_start),
            endDate: formatDate(app.Recruitment?.recruitment_end),
            image: app.Recruitment?.photo_url || projectDefaultImg,
            status,
            statusText,
          };
        });

        setApplications(mappedApplications);
      } catch (err) {

        if (err.message === 'UNAUTHORIZED' || err.code === 'UNAUTHORIZED') {
          setError('로그인이 필요합니다.');
        } else {
          setError('지원 내역을 불러오는데 실패했습니다.');
        }
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "recruiting":
        return "#ff6b35"; // 주황색
      case "confirmed":
      case "ended":
        return "#140805"; // 검은색
      default:
        return "#140805";
    }
  };

  return (
    <div className="application-history-overlay">
      <div className="application-history-slide">
        {/* 헤더 */}
        <div className="application-history-header">
          <h2 className="application-history-title">지원 내역</h2>
          <button className="application-history-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="application-history-list">
          {isLoading ? (
            <div className="application-history-loading">로딩 중...</div>
          ) : error ? (
            <div className="application-history-error">{error}</div>
          ) : applications.length === 0 ? (
            <div className="application-history-empty">지원 내역이 없습니다.</div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="application-history-card">
                {/* 프로젝트 정보와 이미지 */}
                <div className="application-history-top">
                  <div className="application-history-content">
                    <div className="application-history-dates">
                      {application.startDate} ~ {application.endDate}
                    </div>
                    <h3 className="application-history-title-text">{application.title}</h3>
                    <p className="application-history-description">{application.description}</p>
                  </div>
                  <div className="application-history-image">
                    <img
                      src={application.image}
                      alt={application.title}
                      onError={(e) => { e.target.src = projectDefaultImg; }}
                    />
                  </div>
                </div>

                {/* 구분선 */}
                <div className="application-history-divider"></div>

                {/* 하단 상태와 액션 */}
                <div className="application-history-bottom">
                  <div className="application-history-status">
                    <span
                      className="status-text"
                      style={{ color: getStatusColor(application.status) }}
                    >
                      {application.statusText}
                    </span>
                  </div>
                  <div className="application-history-action">
                    <span className="view-application">지원서 보기</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationHistorySlide;
