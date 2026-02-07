// [src/components/MainPage/MainProjectCard.js]
import React from "react";
import "./MainProjectCard.scss";

import projectPeriodIcon from "../../assets/icons/ProjectPeriod.png";
import defaultThumbnail from "../../assets/icons/DefaultImage.png";
import CircularProgress from "../Common/CircularProgress";
import { formatDateRange } from "../../utils/dateFormat";

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

// D-day 텍스트
const calcDDay = (endStr) => {
  if (!endStr) return "D-??";
  const end = new Date(endStr);
  if (Number.isNaN(end.getTime())) return "D-??";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${String(diff).padStart(2, "0")}`;
  if (diff === 0) return "D-DAY";
  return `D+${String(Math.abs(diff)).padStart(2, "0")}`;
};

// 날짜 유효성 체크
const isValidDate = (value) => {
  if (!value) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
};

const MainProjectCard = ({ project, onClick }) => {
  if (!project) return null;

  const title = project?.title || project?.name || project?.project_name || "프로젝트명";

  const startDate =
    project?.recruitment_start ||
    project?.startDate ||
    project?.start_date ||
    project?.start ||
    "";

  const endDate =
    project?.recruitment_end ||
    project?.endDate ||
    project?.end_date ||
    project?.end ||
    "";

  const thumbnail =
    project?.thumbnailUrl ||
    project?.thumbnail_url ||
    project?.imageUrl ||
    project?.image_url ||
    project?.coverImage ||
    project?.cover_image ||
    defaultThumbnail;

  const formattedPeriod = formatDateRange?.(startDate, endDate);
  const periodText =
    formattedPeriod ||
    (startDate && endDate ? `${startDate} ~ ${endDate}` : startDate ? `${startDate}` : "프로젝트 기간");

  // ✅ 기간이 "정해진" 프로젝트인지 (시작/종료 모두 있고, 둘 다 유효한 날짜)
  const hasPeriod = isValidDate(startDate) && isValidDate(endDate);

  const ddayText = hasPeriod ? calcDDay(endDate) : "";
  const progressValue = hasPeriod ? Number(calculateProgress(startDate, endDate)) : 0;

  return (
    <button type="button" className="main-project-card" onClick={onClick}>
      <div className="thumb">
        <img src={thumbnail} alt={`${title} 썸네일`} />
      </div>

      <div className="body">
        <div className="left">
          <h3 className="title">{title}</h3>

          <div className="meta">
            <div className="meta-row">
              <img src={projectPeriodIcon} alt="" className="meta-icon" aria-hidden />
              <span className="meta-text">{periodText}</span>
            </div>
          </div>
        </div>

        {/* ✅ 기간 없으면 오른쪽 원형바 자체를 렌더링 안 함 */}
        {hasPeriod && (
          <div className="right">
            <div className="progress-wrap" aria-label={`진행률 ${progressValue}%`}>
              <CircularProgress percentage={progressValue} />
              <span className="progress-center-text">{ddayText}</span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default MainProjectCard;
