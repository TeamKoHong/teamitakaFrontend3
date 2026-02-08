import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import { createMeeting } from "../../services/projects";
import "./CreateMeetingPage.scss";
import { showErrorToast, showWarningToast } from '../../utils/toast';

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  const handleNext = async () => {
    if (!isFormValid || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const meetingData = {
        title: formData.title.trim(),
        content: formData.description.trim(),
        meeting_date: getCurrentDate()
      };

      await createMeeting(projectId, meetingData);
      
      // 성공 시 회의록 목록 페이지로 이동
      navigate(`/project/${projectId}/proceedings`);
    } catch (err) {

      if (err.code === 'UNAUTHORIZED') {
        showErrorToast("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      
      if (err.code === 'VALIDATION_ERROR') {
        showWarningToast(err.message || "입력 내용을 확인해주세요.");
        return;
      }
      
      showErrorToast("회의록 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-meeting-page-container">
      <DefaultHeader 
        title="팀 회의록 작성하기" 
        showChat={false} 
        backPath={`/project/${projectId}/proceedings`} 
      />
      
      <div className="create-meeting-content">
        <div className="form-section">
          <div className="create-input-group">
            <label className="input-label">회의 제목</label>
            <input
              type="text"
              className="form-input"
              placeholder="내용을 입력하세요."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              maxLength={18}
            />
          </div>

          <div className="create-input-group">
            <label className="input-label">회의 설명</label>
            <textarea
              className="form-textarea"
              placeholder="내용을 입력하세요."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <button 
          className={`next-button ${isFormValid ? 'active' : 'disabled'}`}
          onClick={handleNext}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "생성 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
