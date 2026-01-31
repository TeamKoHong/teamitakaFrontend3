import React from 'react';
import './EvaluationAlert.scss';

const EvaluationAlert = ({ pendingCount }) => {
  if (pendingCount === 0) return null;

  return (
    <div className="evaluation-alert">
      <p className="alert-text">
        팀원 평가가 이뤄지지 않은<br />
        프로젝트가 <span className="count-highlight">{pendingCount}개</span> 있어요!
      </p>
    </div>
  );
};

export default EvaluationAlert;
