import React, { useEffect, useState } from "react";
import "./RecruitingComponent.scss";
import SectionHeader from "../Common/SectionHeader";
import RecruitingProjectCard from "./RecruitingProjectCard";
import RecruitingProjectSlide from "../../RecruitingProjectSlide";
import ApplicantListSlide from "../../ApplicantListSlide";
import { useNavigate } from "react-router-dom";
import { getMyRecruitments, deleteRecruitment } from "../../../services/recruitment";

const RecruitingComponent = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecruitingProject, setShowRecruitingProject] = useState(false);
  const [selectedRecruitment, setSelectedRecruitment] = useState(null);
  const [showApplicantSlide, setShowApplicantSlide] = useState(false);

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyRecruitments({ limit: page.limit || 10, offset: nextOffset });

      if (process.env.NODE_ENV === 'development') {

      }

      if (res?.success) {
        setItems(nextOffset === 0 ? res.items : [...items, ...res.items]);
        setPage(res.page || { total: 0, limit: 10, offset: nextOffset });
      } else {
        throw new Error('SERVER_ERROR');
      }
    } catch (e) {

      if (e?.code === 'UNAUTHORIZED') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      setError('일시적인 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(0);
    // eslint-disable-next-line
  }, []);

  // 마감 여부 확인 함수
  const isExpired = (recruitment) => {
    if (!recruitment.recruitment_end) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(recruitment.recruitment_end);
    endDate.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  // 마감된 프로젝트와 진행 중인 프로젝트 분리
  const expiredRecruitments = items.filter(isExpired);
  const activeRecruitments = items.filter(item => !isExpired(item));

  const handleDelete = async (recruitmentId) => {
    if (!window.confirm('정말 이 모집글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await deleteRecruitment(recruitmentId);

      if (result.success) {
        // 삭제 성공 시 목록 새로고침
        await load(0);
        alert('모집글이 삭제되었습니다.');
      }
    } catch (error) {

      if (error.code === 'UNAUTHORIZED') {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      } else if (error.code === 'NOT_FOUND') {
        alert('모집글을 찾을 수 없습니다.');
        await load(0); // 목록 새로고침
      } else {
        alert(error.message || '모집글 삭제에 실패했습니다.');
      }
    }
  };

  const handleReRecruit = (recruitmentId) => {

    navigate(`/recruit?edit=${recruitmentId}`);
  };

  const handleCardClick = (recruitment) => {
    setSelectedRecruitment(recruitment);
    setShowRecruitingProject(true);
  };

  const handleCloseRecruitingProject = () => {
    setShowRecruitingProject(false);
    setSelectedRecruitment(null);
  };

  const handleSelectTeam = () => {
    setShowApplicantSlide(true);
  };

  const handleCloseApplicantSlide = () => {
    setShowApplicantSlide(false);
  };

  return (
    <div className="recruiting-container">
      {!isLoading && !error && activeRecruitments.length > 0 && (
        <div className="recruiting-top">
          <div className="recruiting-top-info">
            <SectionHeader
              explainText={`지원자를 모으고 있어요.`}
              highlightText="지원자를"
            />
          </div>
        </div>
      )}

      <div className="recruiting-list">
        {isLoading && items.length === 0 && <div className="loading-state">불러오는 중...</div>}

        {error && (
          <div className="error-state">
            <p style={{ color: '#F76241', marginBottom: '12px' }}>{error}</p>
            <button onClick={() => load(page.offset || 0)}>다시 시도</button>
          </div>
        )}

        {!isLoading && !error && activeRecruitments.length === 0 && expiredRecruitments.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-title">모집중인 프로젝트가 없어요</h3>
            <p className="empty-description">
              모집글을 작성하고 프로젝트를 시작해보세요.
            </p>
            <button className="create-project-btn" onClick={() => navigate('/recruit')}>
              프로젝트 모집하기
            </button>
          </div>
        )}

        <div className="recruiting-cards-wrapper">
          {activeRecruitments.map((recruitment) => (
            <RecruitingProjectCard
              key={recruitment.recruitment_id}
              recruitment={recruitment}
              onClick={() => handleCardClick(recruitment)}
            />
          ))}
        </div>
      </div>

      {/* 마감된 프로젝트 섹션 */}
      {!isLoading && !error && expiredRecruitments.length > 0 && (
        <>
          <hr />
          <div className="recruiting-deadline-container">
            <div className="recruiting-deadline-title">
              <p className="title-text">모집 인원이 아쉽게 다 모이지 않았어요</p>
              <p className="title-text">
                <span className="highlight">다시 한번 모집</span>해보세요
              </p>
            </div>

            {expiredRecruitments.map((recruitment) => (
              <div key={recruitment.recruitment_id} className="recruiting-deadline-card">
                <p className="recruiting-deadline-card-description">목표 모집 인원에 도달하지 못했어요.</p>
                <p className="recruiting-deadline-card-title">{recruitment.title}</p>
                <div className="recruiting-deadline-card-buttons">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(recruitment.recruitment_id)}
                  >
                    삭제하기
                  </button>
                  <button
                    className="rerecruit-btn"
                    onClick={() => handleReRecruit(recruitment.recruitment_id)}
                  >
                    다시 모집하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <RecruitingProjectSlide
        open={showRecruitingProject}
        onClose={handleCloseRecruitingProject}
        recruitment={selectedRecruitment}
        onSelectTeam={handleSelectTeam}
      />

      <ApplicantListSlide
        open={showApplicantSlide}
        onClose={handleCloseApplicantSlide}
        recruitmentId={selectedRecruitment?.recruitment_id}
      />
    </div>
  );
};

export default RecruitingComponent;
