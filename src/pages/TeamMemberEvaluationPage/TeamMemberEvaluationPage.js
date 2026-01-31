import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchEvaluationTargets } from '../../services/evaluation';
import { fetchProjectDetails } from '../../services/projects';
import { getTeamMemberEvaluationUrl } from '../../constants/routes';
import styles from './TeamMemberEvaluationPage.module.scss';
import avatar1 from '../../assets/icons/avatar1.png';
import avatar2 from '../../assets/icons/avatar2.png';
import avatar3 from '../../assets/icons/avatar3.png';
import PageLayout from '../../components/DesignSystem/Layout/PageLayout'; // New Layout
import EvaluationStep1 from './components/EvaluationStep1';
import EvaluationStep2 from './components/EvaluationStep2';
import EvaluationStep3 from './components/EvaluationStep3';

function TeamMemberEvaluationPage() {
  const { projectId, memberId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // 1: 카테고리, 2: 전체/역할, 3: 완료
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [nextPendingMemberAfterSubmit, setNextPendingMemberAfterSubmit] = useState(null);
  const [remainingCount, setRemainingCount] = useState(0);
  const [evaluationData, setEvaluationData] = useState({
    categoryRatings: {
      participation: 0,
      communication: 0,
      responsibility: 0,
      collaboration: 0,
      individualAbility: 0
    },
    overallRating: 0,
    roleDescription: '',
    extractedKeywords: [],
    encouragementMessage: ''
  });

  useEffect(() => {
    // skipFetch 플래그 확인 - 팀원 전환 시 불필요한 데이터 fetch 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (location.state?.skipFetch) {
      // 브라우저 히스토리 state 정리
      window.history.replaceState({}, document.title);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!user || !user.userId) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

        // Fetch evaluation targets first
        const evalTargets = await fetchEvaluationTargets(projectId, user.userId);

        // Try to get project details from location.state first (passed from navigation)
        let projectDetails = null;
        if (location.state?.projectSummary) {
          if (process.env.NODE_ENV === 'development') {
            console.log('📦 Using project data from location.state:', location.state.projectSummary);
          }
          // Use data passed via navigation state
          const stateProject = location.state.projectSummary;
          projectDetails = {
            title: stateProject.title || stateProject.name,
            start_date: stateProject.start_date || stateProject.startDate,
            end_date: stateProject.end_date || stateProject.endDate,
            meeting_time: stateProject.meeting_schedule || stateProject.meetingSchedule || stateProject.meeting_time
          };
        } else {
          // Fallback: Try to fetch project details from API
          try {
            console.log('🌐 Fetching project details from API...');
            projectDetails = await fetchProjectDetails(projectId);
          } catch (projectErr) {
            console.warn('프로젝트 상세 정보를 불러오지 못했습니다. 기본 정보를 사용합니다:', projectErr);
            // Fallback to basic project data
            projectDetails = {
              title: '프로젝트',
              start_date: null,
              end_date: null,
              meeting_time: '회의 시간 미정'
            };
          }
        }

        // Merge project details with members from evalTargets
        const projectData = {
          id: projectId,
          name: projectDetails.title || '프로젝트',
          startDate: projectDetails.start_date,
          endDate: projectDetails.end_date,
          meetingSchedule: projectDetails.meeting_time || projectDetails.meetingSchedule,
          members: evalTargets.targets.map((member, index) => ({
            id: member.id,
            name: member.name,
            position: member.role,
            status: member.status, // 'pending' or 'completed'
            avatar: [avatar1, avatar2, avatar3][index % 3] // Cycle through avatars
          }))
        };

        // Find the member to evaluate
        let targetMember;
        if (memberId) {
          targetMember = projectData.members.find(m => m.id === memberId);
        } else {
          if (evalTargets.nextPendingMember) {
            targetMember = projectData.members.find(m => m.id === evalTargets.nextPendingMember.id);
          }
        }

        if (!targetMember && projectData.members.length > 0) {
          targetMember = projectData.members[0];
        }

        if (!targetMember) {
          throw new Error('평가할 팀원을 찾을 수 없습니다.');
        }

        setProjectData(projectData);
        setMemberData(targetMember);

        const pendingCount = evalTargets.targets.filter(t => t.status === 'pending').length;
        setRemainingCount(pendingCount);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId && user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, memberId, user]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleCategoryRatingChange = (category, rating) => {
    setEvaluationData(prev => ({
      ...prev,
      categoryRatings: {
        ...prev.categoryRatings,
        [category]: rating
      }
    }));
  };

  const handleOverallRatingChange = (rating) => {
    setEvaluationData(prev => ({
      ...prev,
      overallRating: rating
    }));
  };

  const handleRoleDescriptionChange = (description) => {
    setEvaluationData(prev => ({
      ...prev,
      roleDescription: description
    }));
  };

  const handleSubmitEvaluation = async () => {
    // MOCK SUBMISSION
    setCurrentStep(3);
  };

  const handleGoNext = () => {
    if (nextPendingMemberAfterSubmit) {
      setCurrentStep(1);
      setEvaluationData({
        categoryRatings: {
          participation: 0,
          communication: 0,
          responsibility: 0,
          collaboration: 0,
          individualAbility: 0
        },
        overallRating: 0,
        roleDescription: '',
        extractedKeywords: [],
        encouragementMessage: ''
      });
      navigate(getTeamMemberEvaluationUrl(projectId, nextPendingMemberAfterSubmit.id));
    }
  };

  const handleGoHome = () => {
    navigate('/project-management?tab=completed');
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  if (!projectData || !memberData) {
    return <div className={styles.noData}>데이터를 찾을 수 없습니다.</div>;
  }

  const handleMemberSelect = (targetMemberId) => {
    if (targetMemberId !== memberId) {
      // Optimistic UI: 즉시 로컬 state 업데이트
      const targetMember = projectData.members.find(m => m.id === targetMemberId);

      if (targetMember) {
        // 즉시 UI 업데이트
        setMemberData(targetMember);
      }

      // Reset current step to 1 when switching members
      setCurrentStep(1);

      // Reset evaluation data
      setEvaluationData({
        categoryRatings: {
          participation: 0,
          communication: 0,
          responsibility: 0,
          collaboration: 0,
          individualAbility: 0
        },
        overallRating: 0,
        roleDescription: '',
        extractedKeywords: [],
        encouragementMessage: ''
      });

      // URL 변경 (skipFetch 플래그로 불필요한 데이터 fetch 방지)
      navigate(getTeamMemberEvaluationUrl(projectId, targetMemberId), {
        state: { skipFetch: true }
      });
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      projectData,
      memberData,
      evaluationData,
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      onCategoryRatingChange: handleCategoryRatingChange,
      onOverallRatingChange: handleOverallRatingChange,
      onRoleDescriptionChange: handleRoleDescriptionChange,
      onSubmit: handleSubmitEvaluation,
      onMemberSelect: handleMemberSelect,
      isLocked: currentStep > 1  // Step 2 이상에서 멤버 선택 잠금
    };

    switch (currentStep) {
      case 1:
        return <EvaluationStep1 {...commonProps} />;
      case 2:
        return <EvaluationStep2 {...commonProps} />;
      case 3:
        return (
          <EvaluationStep3
            memberData={memberData}
            evaluationData={evaluationData}
            nextPendingMember={nextPendingMemberAfterSubmit}
            remainingCount={remainingCount}
            onGoNext={handleGoNext}
            onGoHome={handleGoHome}
            onClose={handleGoHome}
          />
        );
      default:
        return <EvaluationStep1 {...commonProps} />;
    }
  };

  return (
    <PageLayout
      title={currentStep === 3 ? "" : "팀원 평가"}
      onBack={currentStep < 3 ? handleBack : undefined}
      onClose={currentStep === 3 ? undefined : undefined}
      backPath={currentStep === 3 ? null : undefined}
      hideHeader={currentStep === 3}
    >
      {renderCurrentStep()}
    </PageLayout>
  );
}

export default TeamMemberEvaluationPage;