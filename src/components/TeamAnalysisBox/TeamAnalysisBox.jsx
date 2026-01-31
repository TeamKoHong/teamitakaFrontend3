import './TeamAnalysisBox.css';
import emptyImage from '../../assets/icons/project_empty.png';

export default function TeamAnalysisBox() {
  return (
    <div className="team-analysis-outer">
      <div className="team-analysis-top-text">
        <p>
          프로필을 작성하고<br />
          <span className="highlight">내 팀플 분석</span>을 완성해보세요!
        </p>
        <h2 className="team-analysis-title">팀플 능력치 분석</h2>
        <p className="team-analysis-sub">프로젝트 종합 결과가 없어요.</p>
      </div>

      <div className="team-analysis-wrapper">
        <img src={emptyImage} alt="분석 없음" className="team-analysis-image" />
        <p className="team-analysis-label">프로젝트 정보가 없어요.</p>
      </div>
    </div>
  );
}
