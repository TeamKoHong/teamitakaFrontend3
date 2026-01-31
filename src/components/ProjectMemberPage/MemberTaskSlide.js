// src/components/MemberTaskSlide/MemberTaskSlide.jsx
import React, { useState } from "react";
import DefaultHeader from "../Common/DefaultHeader";
import MemberDetailCard from "./MemberDetailCard"; // 기존 카드 컴포넌트
import "./MemberTaskSlide.scss";
import { updateProjectMembers } from "../../services/projects";

export default function MemberTaskSlide({ open, member, onClose, projectId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  const handleComplete = async () => {
    if (!editedData || !projectId || !member) {
      setIsEditing(false);
      return;
    }

    try {
      console.log('💾 팀원 정보 수정 시작:', editedData);
      
      // API 형식에 맞게 데이터 변환
      const taskString = `${editedData.responsibility || ''}${editedData.responsibility && editedData.tasks ? ' - ' : ''}${editedData.tasks || ''}`.trim();
      
      const memberToUpdate = [{
        user_id: member.id,
        task: taskString
      }];

      console.log('📤 API 전송 데이터:', memberToUpdate);

      // API 호출
      const response = await updateProjectMembers(projectId, memberToUpdate);
      console.log('✅ 팀원 정보 수정 성공:', response);

      // 편집 모드 종료
      setIsEditing(false);
      
      // 슬라이드 닫기 (목록 새로고침을 위해)
      handleClose();
    } catch (error) {
      console.error('❌ 팀원 정보 수정 실패:', error);
      
      // 에러 메시지 표시
      if (error.code === 'NOT_PROJECT_LEADER') {
        alert('팀장만 멤버 역할을 수정할 수 있습니다.');
      } else if (error.code === 'MEMBER_NOT_FOUND') {
        alert('해당 멤버를 찾을 수 없습니다.');
      } else if (error.code === 'VALIDATION_ERROR') {
        alert('입력값이 올바르지 않습니다.');
      } else {
        alert('팀원 정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleClose = () => {
    // 슬라이드 닫을 때 편집 모드도 초기화
    setIsEditing(false);
    onClose();
  };

  return (
    <>
      {/* 1) 오버레이 */}
      <div className={`mts-overlay ${open ? "open" : ""}`} onClick={handleClose} />

      {/* 2) 사이드 패널 */}
      <div className={`mts-panel ${open ? "open" : ""}`}>
        {/* 헤더: 편집 모드일 때 완료 버튼 표시 */}
        <DefaultHeader 
          title={isEditing ? "팀원 정보 편집" : "팀원 정보"}
          showChat={false} 
          onBack={handleClose}
          rightElement={
            isEditing ? (
              <button 
                className="header-complete-btn"
                onClick={handleComplete}
              >
                완료
              </button>
            ) : null
          }
        />

        {/* 상세 카드 */}
        <div className="mts-content">
          <MemberDetailCard 
            member={member} 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onDataChange={setEditedData}
          />
        </div>
      </div>
    </>
  );
}
