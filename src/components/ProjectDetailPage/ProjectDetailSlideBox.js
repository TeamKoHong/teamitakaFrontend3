import React, { useRef, useEffect, useState } from "react";
import "./ProjectDetailSlideBox.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TodayIcon from "../Common/UI/TodayIcon";
import {
  calculateElapsedDays,
  calculateProgress,
  calculateRemainingDays,
} from "../../utils/calculateProgress";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import SlideContentSchedule from "./SlideContentSchedule";
// import NotificationBox from "./NotificationBox"; // 현재 사용 안 함 (주석 처리된 슬라이드)
function ProjectDetailSlideBox({ project }) {
  // 프로젝트에서 날짜 가져오기 (없으면 기본값 사용)
  const startDate = project?.start_date || "2025-05-01";
  const endDate = project?.end_date || "2025-06-20";
  const progressPercent = calculateProgress(startDate, endDate);
  const elapsedDays = calculateElapsedDays(startDate);
  const remainingDays = calculateRemainingDays(endDate);
  const barRef = useRef(null);
  const [iconLeft, setIconLeft] = useState(0);

  useEffect(() => {
    if (barRef.current) {
      const fullWidth = barRef.current.offsetWidth;

      const fillWidth = (parseFloat(progressPercent) / 100) * fullWidth;

      setIconLeft(fillWidth - 28); // 28은 아이콘 절반
    }
  }, [progressPercent]);

  return (
    <div className="project-detail-slide-box">
      <Swiper
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
      >
        <SwiperSlide className="slide-wrapper">
          <div className="slide-card">
            <div className="start-date">시작한지 +{elapsedDays}일</div>
            <div className="project-name">{project?.title || "프로젝트명"}</div>
            <div className="project-subtitle">
              {project?.description || "프로젝트 설명 또는 다짐이 들어가는 입력란입니다."}
            </div>

            <div className="progress-wrapper">
              <div className="progress-bar-bg" ref={barRef}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <TodayIcon
                className="today-icon"
                style={{ left: `${iconLeft}px` }}
                text={remainingDays === 0 ? "D-day" : `D-${remainingDays}`}
              />
            </div>

            <p className="progress-subtext">
              목표일 {endDate.replace(/-/g, ".")}까지 {remainingDays}일
              남았어요!
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="slide-wrapper">
          <SlideContentSchedule projectId={project?.project_id} />
        </SwiperSlide>
        {/* 3번째 슬라이드 (알림) - 기능적으로 제외 */}
        {/* <SwiperSlide className="slide-wrapper">
          <NotificationBox />
        </SwiperSlide> */}
        <div className="custom-swiper-pagination" />
      </Swiper>
    </div>
  );
}

export default ProjectDetailSlideBox;
