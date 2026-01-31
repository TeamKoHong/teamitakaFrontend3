import React, { useState } from 'react';
import { IoStar, IoStarOutline, IoChevronForward } from 'react-icons/io5';
import './CompletedProjectCard.scss';
// import { ReactComponent as NextArrow } from '../../../assets/icons/next_arrow.svg';

// 더미 아바타 이미지 (실제 프로젝트에서는 API에서 가져올 수 있음)
const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
];

// Hardcoded SVG to ensure visibility
import rightArrow from '../../../assets/icons/right-arrow.svg';

const CompletedProjectCard = ({ project, onClick }) => {
  const isPending = project.evaluation_status === 'PENDING';
  const isCompleted = project.evaluation_status === 'COMPLETED';

  // 팀원 아바타 (API에 members 정보가 없으므로 더미 사용)
  const memberAvatars = project.members || DEFAULT_AVATARS;

  // 프로젝트 설명 (없으면 기본 텍스트)
  const description = project.description || '프로젝트 설명이 들어갑니다.';

  // 별 즐겨찾기 상태 (COMPLETED용)
  const [isStarred, setIsStarred] = useState(false);

  const handleStarClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    setIsStarred(!isStarred);
    // TODO: 즐겨찾기 API 호출
  };

  // COMPLETED 상태일 때 간단한 디자인
  if (isCompleted) {
    return (
      <div
        className="completed-project-card simple"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onClick) onClick();
          }
        }}
      >
        <div className="simple-content">
          <div className="simple-info">
            <h3 className="simple-title">{project.title}</h3>
            <p className="simple-description">{description}</p>
          </div>
          {isStarred ? (
            <IoStar className="star-icon filled" onClick={handleStarClick} />
          ) : (
            <IoStarOutline className="star-icon outline" onClick={handleStarClick} />
          )}
        </div>
      </div>
    );
  }

  // PENDING 상태일 때 기존 디자인
  return (
    <div
      className="completed-project-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
    >
      {isPending && (
        <div className="evaluation-badge">상호평가 진행 전</div>
      )}

      <div className="card-content">
        <div className="completed-project-info">
          <div className="title-row">
            <h3 className="project-title">{project.title}</h3>
            <img src={rightArrow} alt="arrow" className="next-arrow" />
          </div>

          {/* 설명 텍스트 */}
          <p className="project-description">{description}</p>
        </div>

        {/* 하단 영역: 프로필 이미지 */}
        <div className="card-footer">
          <div className="team-avatars">
            {memberAvatars.slice(0, 4).map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`팀원 ${index + 1}`}
                className="avatar"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectCard;
