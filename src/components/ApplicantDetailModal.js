import React from "react";
import "./ApplicantDetailModal.scss";

const ApplicantDetailModal = ({ isOpen, onClose, applicant, onInvite }) => {
  if (!isOpen || !applicant) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 경력 표시 텍스트
  const getExperienceText = () => {
    if (!applicant.experience_years || applicant.experience_years === 0) {
      return "신입";
    }
    return `${applicant.experience_years}년차`;
  };

  return (
    <div className="applicant-modal-overlay" onClick={handleOverlayClick}>
      <div className="applicant-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          {/* 프로필 섹션 */}
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={applicant.img} alt={applicant.name} />
            </div>
            <div className="profile-info">
              <h3 className="applicant-name">{applicant.name}</h3>
              <div className="experience-badge">{getExperienceText()}</div>
              {(applicant.university || applicant.major) && (
                <div className="education-info">
                  {applicant.university && <span>{applicant.university}</span>}
                  {applicant.university && applicant.major && <span> · </span>}
                  {applicant.major && <span>{applicant.major}</span>}
                </div>
              )}
            </div>
          </div>

          {/* 소개 섹션 */}
          <div className="section-caption">소개</div>
          <div className="introduction">
            <p>
              {applicant.introduction || "자기소개가 없습니다."}
            </p>
          </div>

          {/* 기술 스택 */}
          {applicant.skills && Array.isArray(applicant.skills) && applicant.skills.length > 0 && (
            <div className="skills-section">
              <div className="section-caption">기술 스택</div>
              <div className="skills-badges">
                {applicant.skills.map((skill, index) => (
                  <span key={index} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* 포트폴리오 */}
          {applicant.portfolios && applicant.portfolios.length > 0 && (
            <div className="portfolio-section">
              <div className="section-caption">포트폴리오</div>
              {applicant.portfolios.map((portfolio) => (
                <div key={portfolio.project_id || portfolio.Project?.project_id} className="portfolio-card">
                  <div className="portfolio-texts">
                    <div className="portfolio-title">{portfolio.Project?.title || "프로젝트"}</div>
                    <div className="portfolio-sub">{portfolio.Project?.description || ""}</div>
                  </div>
                  <div className="portfolio-arrow">›</div>
                </div>
              ))}
            </div>
          )}

          {/* 팀원으로 초대하기 버튼 */}
          {applicant.status === 'ACCEPTED' ? (
            <button className="invite-button disabled" disabled>
              이미 초대된 팀원입니다
            </button>
          ) : (
            <button
              className="invite-button"
              onClick={() => {
                if (onInvite && applicant) {
                  onInvite(applicant);
                }
                onClose();
              }}
            >
              팀원으로 초대하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
