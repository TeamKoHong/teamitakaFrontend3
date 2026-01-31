// src/components/TeamMatching/MatchingCard.js
import React from 'react';
import PropTypes from 'prop-types';
import './MatchingCard.scss'; // SCSS 파일 임포트

export default function MatchingCard({ matching }) {
  const { type, title, tags, description, roles, dueDate, isBookmarked } = matching;

  return (
    <div className={`matching-card ${type === '매칭 완료' ? 'completed' : ''}`}>
      <div className="card-header">
        <span className={`status-badge ${type === '모집 중' ? 'recruiting' : 'completed'}`}>
          {type}
        </span>
        <span className="bookmark-icon">
          {isBookmarked ? '❤️' : '🤍'} {/* 북마크 아이콘 (예시) */}
        </span>
      </div>
      <h3 className="card-title">{title}</h3>
      <div className="card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>
      <p className="card-description">{description}</p>
      <div className="card-details">
        <span className="roles">👥 {roles}</span>
        <span className="due-date">⏰ {dueDate}</span>
      </div>
      {type === '모집 중' && (
        <button className="apply-button">신청하기</button>
      )}
      {type === '매칭 완료' && (
        <button className="view-button" disabled>매칭 완료</button>
      )}
    </div>
  );
}

MatchingCard.propTypes = {
  matching: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['모집 중', '매칭 완료']).isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    isBookmarked: PropTypes.bool,
    isRecommended: PropTypes.bool,
  }).isRequired,
};