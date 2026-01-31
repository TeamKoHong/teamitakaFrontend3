import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamMemberInfoSlide.scss';
import DefaultHeader from '../Common/DefaultHeader';
import defaultProfile from '../../assets/default_profile.png';
import NextArrow from '../Common/UI/NextArrow';
import { ReactComponent as EditIcon } from '../../assets/icons/editIcon.svg';
import { updateProjectMembers } from '../../services/projects';

export default function TeamMemberInfoSlide({ open, onClose, selectedMembers, projectId }) {
  const navigate = useNavigate();

  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 TeamMemberInfoSlide 렌더링:', { open, projectId, membersCount: selectedMembers?.length });
  }

  const [memberInfo, setMemberInfo] = useState(
    selectedMembers?.map(member => {
      // role에 따른 기본 역할명 설정
      const defaultPosition = member.role === 'LEADER' ? '조장' : '팀원';
      return {
        ...member,
        position: defaultPosition,
        tasks: ''
      };
    }) || []
  );
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSkip = () => {
    // 건너뛰기 - 프로젝트 상세 페이지로 이동
    navigate(`/project/${projectId}`);
    onClose();
  };

  const handleComplete = async () => {
    try {
      console.log('💾 팀원 정보 저장 시작:', memberInfo);

      // API 형식에 맞게 데이터 변환
      const membersToUpdate = memberInfo.map(member => ({
        user_id: member.user_id,
        task: `${member.position || ''}${member.position && member.tasks ? ' - ' : ''}${member.tasks || ''}`.trim()
      }));

      console.log('📤 API 전송 데이터:', membersToUpdate);

      // API 호출
      const response = await updateProjectMembers(projectId, membersToUpdate);
      console.log('✅ 팀원 정보 저장 성공:', response);

      // 프로젝트 상세 페이지로 이동
      navigate(`/project/${projectId}`);
      onClose();
    } catch (error) {
      console.error('❌ 팀원 정보 저장 실패:', error);

      // 에러 메시지 표시
      if (error.code === 'NOT_PROJECT_LEADER') {
        alert('팀장만 멤버 역할을 수정할 수 있습니다.');
      } else if (error.code === 'MEMBER_NOT_FOUND') {
        alert('해당 멤버를 찾을 수 없습니다.');
      } else if (error.code === 'VALIDATION_ERROR') {
        alert('입력값이 올바르지 않습니다.');
      } else {
        alert('팀원 정보 저장에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setEditingMember(memberInfo.find(m => m.user_id === member.user_id));
    setIsEditMode(false); // 팀원 선택 시 편집 모드 초기화
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditComplete = () => {
    setIsEditMode(false);
  };

  const handleSaveMemberInfo = (memberId, field, value) => {
    setMemberInfo(prev =>
      prev.map(m =>
        m.user_id === memberId ? { ...m, [field]: value } : m
      )
    );
  };

  // 모든 팀원의 역할과 업무가 입력되었는지 확인
  const isAllMemberInfoFilled = memberInfo.every(
    member => member.position?.trim() && member.tasks?.trim()
  );

  if (!projectId || !selectedMembers || selectedMembers.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ TeamMemberInfoSlide - 필수 데이터 없음');
    }
    return null;
  }

  return (
    <>
      <div className={`team-info-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`team-info-panel ${open ? "open" : ""}`}>
        <DefaultHeader
          title="팀원 정보"
          onBack={onClose}
          rightElement={
            <button className="skip-button-header" onClick={handleSkip}>
              건너뛰기
            </button>
          }
        />

        <div className="team-info-content">
          <ul className="team-list">
            {memberInfo.map((member) => (
              <li
                key={member.user_id}
                className="team-list-item"
                onClick={() => handleMemberClick(member)}
              >
                <div className="team-info">
                  <img
                    src={member.img || member.User?.avatar || defaultProfile}
                    alt={member.name}
                    className="avatar"
                  />
                  <div className="text">
                    <p className="name">{member.name}</p>
                    <p className="role">{member.tasks || '업무 미입력'}</p>
                  </div>
                </div>
                <NextArrow className="chevron" />
              </li>
            ))}
          </ul>
        </div>

        {/* 하단 버튼 */}
        <div className="team-info-footer">
          <button
            className={`complete-button ${isAllMemberInfoFilled ? 'active' : ''}`}
            onClick={handleComplete}
            disabled={!isAllMemberInfoFilled}
          >
            완료
          </button>
        </div>

        {/* 팀원 정보 편집 슬라이드 */}
        {selectedMember && editingMember && (
          <>
            <div
              className="member-edit-overlay"
              onClick={() => setSelectedMember(null)}
            />
            <div className="member-edit-panel">
              <DefaultHeader
                title={isEditMode ? "팀원 정보 편집" : "팀원 정보"}
                onBack={() => {
                  setSelectedMember(null);
                  setIsEditMode(false);
                }}
                rightElement={
                  isEditMode ? (
                    <button
                      className="header-complete-btn"
                      onClick={handleEditComplete}
                    >
                      완료
                    </button>
                  ) : null
                }
              />

              <div className="member-edit-content">
                <div className="member-detail-card">
                  {!isEditMode && (
                    <button className="edit-btn" onClick={handleEditToggle}>
                      <EditIcon />
                    </button>
                  )}
                  <div className="avatar-wrapper">
                    <img
                      src={editingMember.img || editingMember.User?.avatar || defaultProfile}
                      alt={editingMember.name}
                      className="avatar-large"
                    />
                  </div>
                  <p className="member-name">{editingMember.name}</p>

                  <ul className="member-meta">
                    <li>
                      <span className="meta-label">담당 역할</span>
                      <input
                        type="text"
                        className={`meta-value ${isEditMode ? 'editable' : ''}`}
                        placeholder="역할 입력"
                        value={editingMember.position}
                        onChange={(e) => {
                          setEditingMember({ ...editingMember, position: e.target.value });
                          handleSaveMemberInfo(editingMember.user_id, 'position', e.target.value);
                        }}
                        disabled={!isEditMode}
                        maxLength={20}
                      />
                    </li>
                    <li>
                      <span className="meta-label">담당 업무</span>
                      <input
                        type="text"
                        className={`meta-value ${isEditMode ? 'editable' : ''}`}
                        placeholder="업무 입력"
                        value={editingMember.tasks}
                        onChange={(e) => {
                          setEditingMember({ ...editingMember, tasks: e.target.value });
                          handleSaveMemberInfo(editingMember.user_id, 'tasks', e.target.value);
                        }}
                        disabled={!isEditMode}
                        maxLength={50}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

