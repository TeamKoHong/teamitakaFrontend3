import React from "react";
import projectDefaultImg from "../../assets/icons/project_default_img.png";
import "./MyRecruitmentSlide.scss";

function MyRecruitmentSlide({ isOpen, onClose }) {
  if (!isOpen) return null;

  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const recruitments = [
    {
      id: 1,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg,
      status: "recruiting", // recruiting, confirmed, ended
      statusText: "팀원 모집 중",
      hasAction: true,
      actionText: "지원자 보기 >"
    },
    {
      id: 2,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg,
      status: "confirmed",
      statusText: "팀 확정 완료",
      hasAction: false,
      actionText: ""
    },
    {
      id: 3,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg,
      status: "ended",
      statusText: "모집 종료",
      hasAction: false,
      actionText: ""
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "recruiting":
        return "#ff6b35"; // 주황색
      case "confirmed":
      case "ended":
        return "#140805"; // 검은색
      default:
        return "#140805";
    }
  };

  return (
    <div className="my-recruitment-overlay">
      <div className="my-recruitment-slide">
        {/* 헤더 */}
        <div className="my-recruitment-header">
          <h2 className="my-recruitment-title">내가 올린 모집 글</h2>
          <button className="my-recruitment-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="my-recruitment-list">
          {recruitments.map((recruitment) => (
            <div key={recruitment.id} className="my-recruitment-card">
              {/* 프로젝트 정보와 이미지 */}
              <div className="my-recruitment-top">
                <div className="my-recruitment-content">
                  <div className="my-recruitment-dates">
                    {recruitment.startDate} ~ {recruitment.endDate}
                  </div>
                  <h3 className="my-recruitment-title-text">{recruitment.title}</h3>
                  <p className="my-recruitment-description">{recruitment.description}</p>
                </div>
                <div className="my-recruitment-image">
                  <img src={recruitment.image} alt={recruitment.title} />
                </div>
              </div>

              {/* 구분선 */}
              <div className="my-recruitment-divider"></div>

              {/* 하단 상태와 액션 */}
              <div className="my-recruitment-bottom">
                <div className="my-recruitment-status">
                  <span 
                    className="status-text"
                    style={{ color: getStatusColor(recruitment.status) }}
                  >
                    {recruitment.statusText}
                  </span>
                </div>
                {recruitment.hasAction && (
                  <div className="my-recruitment-action">
                    <span className="view-applicants">{recruitment.actionText}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyRecruitmentSlide;
