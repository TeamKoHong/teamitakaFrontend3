import './MyProjectSection.css';
import addIcon from '../../assets/icons/add_note.png';
import { useNativeApp } from '../../hooks/useNativeApp';

export default function MyProjectSection({ onAddProject }) {
  const { hapticFeedback } = useNativeApp();

  const handleAddClick = () => {
    hapticFeedback('light');
    onAddProject?.();
  };

  return (
    <div className="my-project-section">
      <h2 className="section-title">나의 프로젝트</h2>
      <div
        className="project-add-box"
        onClick={handleAddClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleAddClick()}
      >
        <img src={addIcon} alt="프로젝트 추가" className="add-icon" />
        <span className="add-text">프로젝트 등록하기</span>
      </div>
    </div>
  );
}
