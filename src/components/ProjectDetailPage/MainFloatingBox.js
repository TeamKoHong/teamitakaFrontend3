import React from "react";
import "./MainFloatingBox.scss";
import groupCalendarIcon from "../../assets/icons/groupCalendarIcon.png";
import meetingNoteIcon from "../../assets/icons/meetingNoteIcon.png";
import teamMemberIcon from "../../assets/icons/teamMemberIcon.png";

import { useNavigate } from "react-router-dom";
function MainFloatingBox({ projectId }) {
  const navigate = useNavigate();
  return (
    <div className="main-floating-box">
      <div className="box-header-container">
        <div className="icon-container">
          <div className="icon" onClick={() => navigate(`/project/${projectId}/member`)}>
            <img src={teamMemberIcon} alt="팀멤버아이콘" />
          </div>
          <p>팀원 정보</p>
        </div>

        <div className="icon-container">
          <div
            className="icon"
            onClick={() => navigate(`/project/${projectId}/proceedings`)}
          >
            <img src={meetingNoteIcon} alt="회의록" />
          </div>
          <p>팀 회의록</p>
        </div>

        <div className="icon-container">
          <div className="icon">
            <img
              src={groupCalendarIcon}
              alt="공유 캘린더"
              onClick={() => navigate(`/project/${projectId}/calender`)}
            />
          </div>
          <p>공유 캘린더</p>
        </div>
      </div>
    </div>
  );
}

export default MainFloatingBox;
