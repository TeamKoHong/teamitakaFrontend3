import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import projectDefaultImg from "../../assets/icons/project_default_img.png";
import SmallBookmarkIcon from "../../assets/icons/small_bookMark.svg";
import BookmarkCheckCircleIcon from "../../assets/icons/bookMark_checkCircle.svg";
import BookmarkCalendarIcon from "../../assets/icons/bookMark_calendar.svg";
import ApplicationHistorySlide from "../../components/BookmarkPage/ApplicationHistorySlide";
import MyRecruitmentSlide from "../../components/BookmarkPage/MyRecruitmentSlide";
import { getBookmarkedRecruitments, getMyApplications, toggleRecruitmentScrap } from "../../services/recruitment";
import { useUniversityFilter } from "../../hooks/useUniversityFilter";
import "./BookmarkPage.scss";

function BookmarkPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recruiting"); // "recruiting" | "completed"
  const [isApplicationHistoryOpen, setIsApplicationHistoryOpen] = useState(false);
  const [isMyRecruitmentOpen, setIsMyRecruitmentOpen] = useState(false);
  const { filterByUniv } = useUniversityFilter();

  const [bookmarks, setBookmarks] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 북마크와 지원 내역을 병렬로 조회
        const [bookmarksResponse, applicationsResponse] = await Promise.all([
          getBookmarkedRecruitments(),
          getMyApplications().catch(() => ({ data: [] })), // 지원 내역 실패해도 북마크는 표시
        ]);

        // 북마크 처리 - 백엔드가 이미 평탄화된 데이터를 반환함
        const bookmarksData = bookmarksResponse.data || [];
        const bookmarksWithUniv = bookmarksData.map(item => {
          return {
            scrap_id: item.scrap_id,
            recruitment_id: item.recruitment_id,
            id: item.recruitment_id, // 호환성을 위해
            title: item.title || '제목 없음',
            description: item.description || '',
            status: item.status, // 'ACTIVE' or 'CLOSED'
            photo_url: item.photo_url,
            imageUrl: item.photo_url, // 호환성을 위해
            scrap_count: item.scrap_count,
            created_at: item.created_at,
            start_date: item.start_date || item.created_at,
            deadline: item.deadline,
            end_date: item.deadline,
            university: item.university || null, // 백엔드에서 User 정보 미포함 시 null
          };
        });
        setBookmarks(bookmarksWithUniv);

        // 지원 내역 카운트 설정
        const applicationsData = applicationsResponse.data || [];
        setApplicationCount(applicationsData.length);
      } catch (err) {
        console.error('북마크 목록 조회 실패:', err);
        if (err.message === 'UNAUTHORIZED' || err.code === 'UNAUTHORIZED') {
          setError('로그인이 필요합니다.');
        } else {
          setError('북마크 목록을 불러오는데 실패했습니다.');
        }
        setBookmarks([]);
        setApplicationCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 대학 필터 적용
  const univFilteredBookmarks = useMemo(() => {
    return filterByUniv(bookmarks, 'university');
  }, [bookmarks, filterByUniv]);

  // 모집 중/마감 필터링 (백엔드 status: 'ACTIVE', 'CLOSED', 'FILLED')
  const filteredProjects = univFilteredBookmarks.filter(project => {
    if (activeTab === "recruiting") {
      return project.status === 'ACTIVE' || project.status === 'open' || project.status === 'recruiting' || !project.status;
    } else {
      return project.status === 'CLOSED' || project.status === 'FILLED' || project.status === 'closed' || project.status === 'completed';
    }
  });

  // 통계 계산 (대학 필터 적용된 데이터 기준)
  const bookmarkStats = {
    totalBookmarks: univFilteredBookmarks.length,
    appliedProjects: applicationCount,
    myRecruitmentPosts: 0, // TODO: 내 모집글 API 연동 시 업데이트
    urgentDeadlines: univFilteredBookmarks.filter(b => {
      if (!b.deadline) return false;
      const deadline = new Date(b.deadline);
      const today = new Date();
      return deadline.toDateString() === today.toDateString();
    }).length
  };

  const handleProjectClick = (projectId) => {
    navigate(`/recruitment/${projectId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '00.00';
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleBookmarkToggle = async (e, recruitmentId) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    try {
      await toggleRecruitmentScrap(recruitmentId);
      // 북마크 해제 후 목록에서 제거
      setBookmarks(prev => prev.filter(b => b.recruitment_id !== recruitmentId));
    } catch (err) {
      console.error('북마크 토글 실패:', err);
      alert('북마크 해제에 실패했습니다.');
    }
  };

  return (
    <div className="bookmark-page-container">
      <DefaultHeader title="북마크" />

      <main className="bookmark-main">
        {/* 북마크 요약 */}
        <div className="bookmark-summary">
          <p className="summary-text">
            오늘 지원 마감인 북마크
            <br />
            프로젝트가 총{" "}
            <span className="urgent-count">{bookmarkStats.urgentDeadlines}건</span>
            {" "}있습니다
          </p>
        </div>

        {/* 통계 섹션 */}
        <div className="bookmark-stats">
          <div className="stat-item">
            <div className="stat-top">
              <div className="stat-icon">
                <img src={SmallBookmarkIcon} alt="북마크" />
              </div>
              <span className="stat-number">{bookmarkStats.totalBookmarks}</span>
            </div>
            <div className="stat-label">북마크수</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item" onClick={() => setIsApplicationHistoryOpen(true)}>
            <div className="stat-top">
              <div className="stat-icon">
                <img src={BookmarkCheckCircleIcon} alt="지원완료" />
              </div>
              <span className="stat-number">{bookmarkStats.appliedProjects}</span>
            </div>
            <div className="stat-label">지원완료</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item" onClick={() => setIsMyRecruitmentOpen(true)}>
            <div className="stat-top">
              <div className="stat-icon">
                <img src={BookmarkCalendarIcon} alt="내가올린모집" />
              </div>
              <span className="stat-number">{bookmarkStats.myRecruitmentPosts}</span>
            </div>
            <div className="stat-label">내가올린 모집</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "recruiting" ? "active" : ""}`}
            onClick={() => setActiveTab("recruiting")}
          >
            모집 중
          </button>
          <button
            className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            모집 마감
          </button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="bookmark-project-list">
          {isLoading ? (
            <div className="bookmark-loading">로딩 중...</div>
          ) : error ? (
            <div className="bookmark-error">{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="bookmark-empty">
              {activeTab === "recruiting"
                ? "모집 중인 북마크가 없습니다."
                : "마감된 북마크가 없습니다."}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.recruitment_id || project.id}
                className="bookmark-project-card"
                onClick={() => handleProjectClick(project.recruitment_id || project.id)}
              >
                <div className="bookmark-project-content">
                  <div className="bookmark-project-dates">
                    {formatDate(project.start_date || project.created_at)} ~ {formatDate(project.deadline || project.end_date)}
                  </div>
                  <h3 className="bookmark-project-title">{project.title}</h3>
                  <p className="bookmark-project-description">{project.description}</p>
                </div>
                <div className="bookmark-project-image">
                  <img
                    src={project.photo_url || project.imageUrl || projectDefaultImg}
                    alt={project.title}
                    onError={(e) => { e.target.src = projectDefaultImg; }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="22"
                    viewBox="0 0 16 22"
                    fill="none"
                    className="bookmark-toggle-icon"
                    onClick={(e) => handleBookmarkToggle(e, project.recruitment_id)}
                  >
                    <path d="M0 2C0 0.89543 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V19.8851C16 21.5539 14.0766 22.4888 12.7644 21.4577L9.23564 18.6851C8.51042 18.1153 7.48958 18.1153 6.76436 18.6851L3.23564 21.4577C1.92338 22.4888 0 21.5539 0 19.8851V2Z" fill="#F76241"/>
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 지원 내역 슬라이드 */}
      <ApplicationHistorySlide
        isOpen={isApplicationHistoryOpen}
        onClose={() => setIsApplicationHistoryOpen(false)}
      />

      {/* 내가 올린 모집글 슬라이드 */}
      <MyRecruitmentSlide
        isOpen={isMyRecruitmentOpen}
        onClose={() => setIsMyRecruitmentOpen(false)}
      />
    </div>
  );
}

export default BookmarkPage;
