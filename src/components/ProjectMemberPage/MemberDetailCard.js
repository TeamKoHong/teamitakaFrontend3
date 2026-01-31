import React, { useState, useEffect } from "react";
import { ReactComponent as EditIcon } from "../../assets/icons/editIcon.svg";
import "./MemberDetailCard.scss";
import avatar1 from "../../assets/icons/avatar1.png";
// import UnderArrow from "../Common/UI/UnderArrow"; // 현재 사용 안 함

export default function MemberDetailCard({ member, isEditing, setIsEditing, onDataChange }) {
  // member의 task를 파싱하여 역할과 업무로 분리
  const parseTask = (task, role, taskDisplay) => {
    // role에 따른 기본 역할명 설정
    const defaultRole = role === 'LEADER' ? '조장' : '팀원';
    
    // taskDisplay가 "업무 미입력"이면 빈 문자열로
    const taskContent = taskDisplay === "업무 미입력" ? "" : (taskDisplay || "");
    
    if (!task) return { responsibility: defaultRole, tasks: taskContent };
    if (task.includes(' - ')) {
      const [responsibility, tasks] = task.split(' - ');
      return { 
        responsibility: responsibility.trim() || defaultRole, 
        tasks: tasks.trim() 
      };
    }
    // ' - '가 없으면 role 기반 역할과 taskDisplay 사용
    return { responsibility: defaultRole, tasks: taskContent };
  };

  const parsedTask = parseTask(member?.task, member?.role, member?.taskDisplay);
  
  const [memberData, setMemberData] = useState({
    name: member?.name || "팀원명",
    responsibility: parsedTask.responsibility,
    tasks: parsedTask.tasks
  });

  // member가 변경될 때마다 memberData 업데이트
  useEffect(() => {
    if (member) {
      const parsedTask = parseTask(member.task, member.role, member.taskDisplay);
      setMemberData({
        name: member.name || "팀원명",
        responsibility: parsedTask.responsibility,
        tasks: parsedTask.tasks
      });
    }
  }, [member]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...memberData,
      [field]: value
    };
    setMemberData(updatedData);
    
    // 부모 컴포넌트에 변경사항 전달
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  return (
    <div className="member-detail-card">
      {!isEditing && (
        <button className="edit-btn" onClick={handleEditToggle}>
          <EditIcon />
        </button>
      )}
      <div className="avatar-wrapper">
        <img src={member?.avatar || avatar1} alt="이미지" className="avatar-large" />
      </div>
      <p className="member-name">{memberData.name}</p>

      <ul className="member-meta">
        <li>
          <span className="meta-label">담당 역할</span>
          <span 
            className={`meta-value ${isEditing ? 'editable' : ''}`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInputChange('responsibility', e.target.textContent)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
              }
            }}
          >
            {memberData.responsibility}
          </span>
        </li>
        <li>          
          <span className="meta-label">담당 업무</span>
          <span 
            className={`meta-value ${isEditing ? 'editable' : ''}`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInputChange('tasks', e.target.textContent)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
              }
            }}
          >
            {memberData.tasks}
          </span>
        </li>
      </ul>

      
      
      {/* 여기 아래에 실제 타임라인 컴포넌트를 조건부로 렌더하면 됩니다 */}
    </div>
  );
}
