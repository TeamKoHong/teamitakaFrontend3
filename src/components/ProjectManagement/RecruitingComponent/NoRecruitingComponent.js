import React from "react";
import "./NoRecruitingComponent.scss";

const NoRecruitingComponent = ({ onCreateProject }) => {
  return (
    <div className="no-recruiting-container">
      <h3 className="title">모집중인 프로젝트가 없어요</h3>
      <p className="description">
        모집할 프로젝트가 있다면 생성해서 <br />
        팀원을 구할 수 있어요
      </p>
      <button className="create-project-btn" onClick={onCreateProject}>
        프로젝트 모집하기
      </button>
    </div>
  );
};

export default NoRecruitingComponent;
