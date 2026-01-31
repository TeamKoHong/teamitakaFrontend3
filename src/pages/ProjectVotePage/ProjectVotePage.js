import DefaultHeader from "../../components/Common/DefaultHeader";

export default function ProjectVotePage() {
  return (
    <div className="project-vote-page-container">
      <DefaultHeader title="투표하기" showChat={false} />
      <div className="vote-list">
        <div className="vote-item">
          <h3>투표 제목</h3>
          <p>투표 설명</p>
          <button className="vote-button">투표하기</button>
        </div>
        {/* Add more vote items as needed */}
      </div>
    </div>
  );
}
