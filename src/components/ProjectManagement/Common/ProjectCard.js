import React from "react";
import "./ProjectCard.scss";
import { useNavigate } from "react-router-dom";
import { IoPeopleOutline } from "react-icons/io5";
import CircularProgress from "../../Common/CircularProgress";
import { formatDateRange } from "../../../utils/dateFormat";
import defaultProfile from "../../../assets/default_profile.png";
import projectDueIcon from "../../../assets/icons/projectDueIcon.png";

// 진행률 계산 (시작일~종료일 기준)
const calculateProgress = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  if (now < start) return 0;
  if (now > end) return 100;
  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
};

// 남은 일수 계산
const calculateRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const ProjectCard = ({ project, type = "project" }) => {
  const navigate = useNavigate();
  if (!project) return null;

  // Use explicit type prop to determine navigation
  const isRecruitment = type === "recruitment";
  const id = isRecruitment ? project.recruitment_id : project.project_id;
  const {
    title,
    start_date,
    end_date,
    recruitment_start,
    recruitment_end,


    progress_percent,
    applicant_count,
    members = []
  } = project;

  // Use recruitment dates if available, otherwise use project dates
  const startDate = recruitment_start || start_date;
  const endDate = recruitment_end || end_date;

  // Format dates for display
  const formattedPeriod = formatDateRange(startDate, endDate);
  const period = formattedPeriod ||
    (isRecruitment ? "모집 기간 미정" : "프로젝트 기간 미정");


  // Calculate progress and remaining days
  const progressValue = startDate && endDate
    ? Number(calculateProgress(startDate, endDate))
    : (Number(progress_percent) || 0);

  const remainingDays = endDate ? calculateRemainingDays(endDate) : null;

  // Format D-Day text
  const getDdayText = () => {
    if (remainingDays === null) return '완료';
    if (remainingDays === 0) return 'D-Day';
    return `D-${remainingDays}`;
  };

  const handleClick = () => {
    if (isRecruitment) {
      navigate(`/recruitment/${id}/team-select`);
    } else {
      navigate(`/project/${id}`);
    }
  };

  return (
    <div
      className="project-card"
      onClick={handleClick}
    >
      <div className="card-content">
        {/* 프로젝트 정보 */}
        <div className="info">
          <h3 className="title">{title || '프로젝트명'}</h3>
          <p>
            <img src={projectDueIcon} alt="calendar" className="details-icon" /> {period}
          </p>
        </div>

        <div className="details">

          {isRecruitment && (
            <p className="applicant-info">
              <IoPeopleOutline className="details-icon" /> {applicant_count || 0}명 지원
            </p>
          )}
        </div>

        {/* 팀원 아바타 */}
        <div className="team">
          {members.slice(0, 4).map((member, index) => (
            <img
              key={member.id}
              src={member.avatar || defaultProfile}
              alt={member.name}
              className="team-avatar"
              style={{ zIndex: 4 - index }}
            />
          ))}
        </div>
      </div>

      {/* D-Day 원형 프로그레스 */}
      <div className="projectCard-right">
        <p className="time-ago">2시간 전</p>
        <CircularProgress percentage={progressValue}>
          {getDdayText()}
        </CircularProgress>
      </div>
    </div>
  );
};

export default ProjectCard;
