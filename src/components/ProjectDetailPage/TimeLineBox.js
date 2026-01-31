import React from "react";
import "./TimeLineBox.scss";

function TimeLineBox({ projectName = "프로젝트명" }) {
  const items = [
    { day: "4/15", title: "중간 발표 단체 연습", fullDate: "2025.4.15" },
    {
      day: "4/05",
      title: "추가 회의 및 자료정리 완료 확인",
      fullDate: "2025.1.15",
    },
    {
      day: "4/02",
      title: "아이데이션을 위한 전체 회의",
      fullDate: "2025.1.15",
    },
    {
      day: "4/02",
      title: "아이데이션을 위한 전체 회의",
      fullDate: "2025.1.15",
    },
  ];

  return (
    <div className="timeLineBox-container">
      <div className="timeLineBox-header">
        <h2>[{projectName}] 타임라인</h2>
        <button className="timeLineBox-button">추가하기</button>
      </div>

      {/* 타임라인 아이템 컨테이너 */}
      <div className="timeLineBox-items">
        {/* 전체 타임라인 선 */}
        <div className="timeLineBox-line" />

        {items.map((item, idx) => (
          <div className="timeLineBox-content" key={idx}>
            <div className="day-circle">{item.day}</div>
            <div className="timeLineBox-content-text">
              <h3>{item.title}</h3>
              <p>{item.fullDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeLineBox;
