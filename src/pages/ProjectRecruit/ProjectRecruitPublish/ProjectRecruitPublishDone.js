import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectRecruitPublish.scss";
import doneIcon from "../../../assets/done.png"; 

export default function ProjectRecruitPublishDone() {
  const nav = useNavigate();
  const { state } = useLocation();
  const recruitmentId = state?.recruitmentId;

  return (
    <div className="publish-page">
      {/* 중앙에 아이콘 + 텍스트 */}
      <div className="publish-body">
        <img src={doneIcon} alt="게시 완료" className="done-icon" />
        <h2 className="done-title">모집글 게시 완료!</h2>
      </div>

      {/* 하단: 흰색 배경, 별도 박스/라인 없음 */}
      <div className="publish-footer">
        <button
          type="button"
          className="ghost-link"
          onClick={() => nav("/main")}
        >
          메인 화면으로 갈래요
        </button>

        <button
          type="button"
          className="cta"
          onClick={() => nav(`/recruitment/${recruitmentId}`)}
        >
          확인하러 가기
        </button>
      </div>
    </div>
  );
}
