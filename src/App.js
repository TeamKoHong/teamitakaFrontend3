// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useLocation } from "react-router-dom";
import { useNativeApp } from './hooks/useNativeApp';
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/Profile/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
import ProjectMemberPage from "./pages/ProjectMemberPage/ProjectMemberPage";
import ProceedingsPage from "./pages/ProceedingsPage/ProceedingsPage";
import CreateMeetingPage from "./pages/CreateMeetingPage/CreateMeetingPage";
import ProjectCalender from "./pages/ProjectCalendar/ProjectCalendar";

import RatingManagementPage from './pages/RatingManagementPage/RatingManagementPage';
import RatingProjectPage from './pages/RatingProjectPage/RatingProjectPage';
import RatingProjectStatusPage from './pages/RatingProjectStatusPage/RatingProjectStatusPage';
import TeamMemberEvaluationPage from './pages/TeamMemberEvaluationPage/TeamMemberEvaluationPage';
import ReceivedFeedbackDetailPage from './pages/ReceivedFeedbackDetailPage/ReceivedFeedbackDetailPage';
import CategorySliderDemo from './components/Common/CategorySliderDemo';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import FindIdPage from './pages/FindIdPage/FindIdPage';
import FindPasswordPage from './pages/FindPasswordPage/FindPasswordPage';
import TeamMatchingPage from './pages/TeamMatchingPage/TeamMatchingPage';
import RecruitmentPage from './pages/RecruitmentPage/RecruitmentPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ProfileMainPage from './pages/Profile/ProfileMainPage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import BookmarkPage from './pages/BookmarkPage/BookmarkPage';
import RecruitmentViewPage from './pages/RecruitmentViewPage/RecruitmentViewPage';
import TeamSelectPage from './pages/TeamSelectPage/TeamSelectPage';
import ProjectRegisterPage from './pages/Profile/ProjectRegisterPage/ProjectRegisterPage';

// Type Test Pages
import QuizPage from './features/type-test/pages/QuizPage';
import AnalysisCompletePage from './features/type-test/pages/AnalysisCompletePage';
import ResultPage from './features/type-test/pages/ResultPage';

// 메인 페이지 임포트
import MainPage from './components/Home/MainPage';

// 프로젝트 지원하기 임포트
import ProjectApply from "./pages/ProjectApply/ProjectApply";
import ProjectApplySelect from "./pages/ProjectApply/ProjectApplySelect";
import ProjectApplyComplete from "./pages/ProjectApply/ProjectApplyComplete";

// 알림 페이지 임포트
import NotificationSettings from './pages/NotificationsPage/NotificationSettings';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';

// 프로젝트 생성하기 임포트
import ProjectRecruit from './pages/ProjectRecruit/ProjectRecruit/ProjectRecruit';
import ProjectRecruitDetail from './pages/ProjectRecruit/ProjectRecruitDetail/ProjectRecruitDetail';
import ProjectRecruitImage from './pages/ProjectRecruit/ProjectRecruitImage/ProjectRecruitImage';
import ProjectDrafts from './pages/ProjectRecruit/ProjectDrafts/ProjectDrafts';
import ProjectRecruitPreview from './pages/ProjectRecruit/ProjectRecruitPreview/ProjectRecruitPreview';
import ProjectRecruitPublish from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublish";
import ProjectRecruitPublishDone from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublishDone";

// Firebase 전화번호 인증 테스트 페이지
import PhoneAuthTestPage from './pages/PhoneAuthTestPage/PhoneAuthTestPage';

// 휴대폰 본인인증 페이지
import PhoneVerifyPage from './pages/PhoneVerifyPage/PhoneVerifyPage';
import VerificationCodePage from './pages/VerificationCodePage/VerificationCodePage';
import ProfileSetupPage from './pages/ProfileSetupPage/ProfileSetupPage';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import RegisterCompletePage from './pages/RegisterCompletePage/RegisterCompletePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage/TermsOfServicePage';

// 인증 관련 임포트
import { AuthProvider } from './contexts/AuthContext';
import { UniversityFilterProvider } from './contexts/UniversityFilterContext';
import { PushNotificationProvider } from './contexts/PushNotificationContext';
import GlobalToastSystem from './components/Common/GlobalToastSystem';
import AuthEventBridge from './components/Common/AuthEventBridge';
import ErrorBoundary from './components/Common/ErrorBoundary';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import ProfileVerificationPage from './pages/Profile/ProfileVerificationPage';

// 라우팅 상수 임포트
import {
  MAIN_ROUTES,
  PROJECT_ROUTES,
  EVALUATION_ROUTES,
  LEGACY_EVALUATION_ROUTES,
  OTHER_ROUTES,
  DEMO_ROUTES,
  PROFILE_ROUTES,
  isEvaluationRoute
} from './constants/routes';

// ===== 네비게이션 가드 컴포넌트 =====

// 평가 플로우 가드
const EvaluationGuard = ({ children, projectId, memberId }) => {
  const location = useLocation();

  React.useEffect(() => {
    // 평가 플로우에서 뒤로가기 시 경고
    const handleBeforeUnload = (e) => {
      if (isEvaluationRoute(location.pathname)) {
        e.preventDefault();
        e.returnValue = '평가 작성 중입니다. 페이지를 나가시겠습니까?';
        return e.returnValue;
      }
    };

    // 브라우저 뒤로가기 버튼 처리
    const handlePopState = (e) => {
      if (isEvaluationRoute(location.pathname)) {
        const confirmLeave = window.confirm('평가 작성 중입니다. 페이지를 나가시겠습니까?');
        if (!confirmLeave) {
          window.history.pushState(null, '', location.pathname);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]);

  return children;
};

// 프로젝트 권한 검증 가드
const ProjectPermissionGuard = ({ children, projectId }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const checkPermission = async () => {
      try {
        setIsLoading(true);
        // 임시로 true 반환 (실제로는 권한 검증 로직 구현)
        setHasPermission(true);
      } catch (err) {
        setError('프로젝트 접근 권한을 확인할 수 없습니다.');
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      checkPermission();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        권한 확인 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <div style={{ fontSize: '16px', color: '#666' }}>{error}</div>
        <button
          onClick={() => window.location.href = PROJECT_ROUTES.MANAGEMENT}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f76241',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          프로젝트 관리로 돌아가기
        </button>
      </div>
    );
  }

  if (!hasPermission) {
    return <Navigate to={PROJECT_ROUTES.MANAGEMENT} replace />;
  }

  return children;
};

// ===== 가드 래퍼 컴포넌트들 =====

// 프로젝트 평가 페이지 가드 (내가 받은 평가)
const ProjectEvaluationGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage mode="received" />
    </ProjectPermissionGuard>
  );
};

// 프로젝트 평가 페이지 가드 (내가 한 평가)
const ProjectEvaluationGivenGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage mode="given" />
    </ProjectPermissionGuard>
  );
};

// 팀원 평가 페이지 가드
const TeamMemberEvaluationGuard = () => {
  const { projectId, memberId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <EvaluationGuard projectId={projectId} memberId={memberId}>
        <TeamMemberEvaluationPage />
      </EvaluationGuard>
    </ProjectPermissionGuard>
  );
};

// 평가 상태 페이지 가드
const EvaluationStatusGuard = () => {
  const { projectId } = useParams();
  const location = useLocation();

  if (location.pathname.includes('/given')) {
    return (
      <ProjectPermissionGuard projectId={projectId}>
        <RatingProjectStatusPage />
      </ProjectPermissionGuard>
    );
  } else if (location.pathname.includes('/received')) {
    return (
      <ProjectPermissionGuard projectId={projectId}>
        <RatingProjectStatusPage />
      </ProjectPermissionGuard>
    );
  } else {
    return (
      <ProjectPermissionGuard projectId={projectId}>
        <RedirectToReceived />
      </ProjectPermissionGuard>
    );
  }
};

// ===== 리다이렉트 함수 =====

function RedirectToReceived() {
  const { projectId } = useParams();
  return <Navigate to={`${EVALUATION_ROUTES.STATUS_RECEIVED.replace(':projectId', projectId)}`} replace />;
}

// ===== Frontend3 전용: NativeApp 초기화 =====

const NativeAppInitializer = ({ children }) => {
  useNativeApp();
  return children;
};

// ===== 메인 앱 컴포넌트 =====

const App = () => {
  return (
    <ErrorBoundary>
    <Router>
      <NativeAppInitializer>
      <PushNotificationProvider>
      <AuthProvider>
        <UniversityFilterProvider>
          <GlobalToastSystem />
          <AuthEventBridge />

          <Routes>
            {/* ===== 공개 페이지 (로그인하지 않은 사용자만) ===== */}
            <Route path={MAIN_ROUTES.HOME} element={<PublicRoute><OnboardingPage /></PublicRoute>} />
            <Route path={MAIN_ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path={MAIN_ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/find-id" element={<PublicRoute><FindIdPage /></PublicRoute>} />
            <Route path="/find-password" element={<PublicRoute><FindPasswordPage /></PublicRoute>} />

            {/* ===== 회원가입 완료 (PublicRoute 밖) ===== */}
            <Route path="/register-complete" element={<RegisterCompletePage />} />

            {/* ===== 메인/프로필 (인증 필요) ===== */}
            <Route path={MAIN_ROUTES.MAIN} element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
            <Route path={PROFILE_ROUTES.MAIN} element={<ProtectedRoute><ProfileMainPage /></ProtectedRoute>} />
            <Route path={PROFILE_ROUTES.EDIT} element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
            <Route path={PROFILE_ROUTES.VERIFICATION || "/profile/verification"} element={<ProfileVerificationPage />} />
            <Route path="/profile/register-project" element={<ProtectedRoute><ProjectRegisterPage /></ProtectedRoute>} />
            <Route path="/profile/project/view/:projectId" element={<ProjectDetailPage />} />

            {/* ===== 테스트용 메인 (로그인 불필요) ===== */}
            <Route path="/main" element={<MainPage />} />

            {/* ===== 프로젝트 관리 라우트 (로그인 제한 없음) ===== */}
            <Route path={PROJECT_ROUTES.MANAGEMENT} element={<ProjectManagement />} />
            <Route path={PROJECT_ROUTES.DETAIL} element={<ProjectDetailPage />} />
            <Route path={PROJECT_ROUTES.MEMBER} element={<ProjectMemberPage />} />
            <Route path={PROJECT_ROUTES.PROCEEDINGS} element={<ProceedingsPage />} />
            <Route path={PROJECT_ROUTES.CREATE_MEETING} element={<CreateMeetingPage />} />
            <Route path={PROJECT_ROUTES.CALENDAR} element={<ProjectCalender />} />

            {/* ===== 평가 시스템 라우트 (인증 필요) ===== */}
            <Route path={EVALUATION_ROUTES.MANAGEMENT} element={<ProtectedRoute><RatingManagementPage /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.PROJECT} element={<ProtectedRoute><ProjectEvaluationGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.PROJECT_GIVEN} element={<ProtectedRoute><ProjectEvaluationGivenGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.FEEDBACK_DETAIL} element={<ProtectedRoute><ReceivedFeedbackDetailPage /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.TEAM_MEMBER} element={<ProtectedRoute><TeamMemberEvaluationGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS_GIVEN} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS_RECEIVED} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />

            {/* ===== 기존 URL 호환성 리다이렉트 ===== */}
            <Route path={LEGACY_EVALUATION_ROUTES.RATING_MANAGEMENT} element={<Navigate to={EVALUATION_ROUTES.MANAGEMENT} replace />} />
            <Route path={LEGACY_EVALUATION_ROUTES.RATING_PROJECT} element={<Navigate to={EVALUATION_ROUTES.PROJECT} replace />} />
            <Route path={LEGACY_EVALUATION_ROUTES.EVALUATE_MEMBER} element={<Navigate to={EVALUATION_ROUTES.TEAM_MEMBER} replace />} />
            <Route path={LEGACY_EVALUATION_ROUTES.RATING_STATUS_GIVEN} element={<Navigate to={EVALUATION_ROUTES.STATUS_GIVEN} replace />} />
            <Route path={LEGACY_EVALUATION_ROUTES.RATING_STATUS_RECEIVED} element={<Navigate to={EVALUATION_ROUTES.STATUS_RECEIVED} replace />} />
            <Route path={LEGACY_EVALUATION_ROUTES.RATING_STATUS} element={<Navigate to={EVALUATION_ROUTES.STATUS} replace />} />

            {/* ===== 팀 매칭 및 기타 라우트 (로그인 제한 없음) ===== */}
            <Route path={OTHER_ROUTES.TEAM_MATCHING} element={<TeamMatchingPage />} />
            <Route path={OTHER_ROUTES.RECRUITMENT} element={<RecruitmentPage />} />
            <Route path={OTHER_ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={OTHER_ROUTES.BOOKMARK} element={<BookmarkPage />} />
            <Route path={OTHER_ROUTES.TEAM} element={<Navigate to={OTHER_ROUTES.TEAM_MATCHING} replace />} />
            <Route path="/recruitment/:id" element={<RecruitmentViewPage />} />
            <Route path="/recruitment/:id/team-select" element={<TeamSelectPage />} />

            {/* ===== 데모 및 개발 도구 라우트 (개발용) ===== */}
            <Route path={DEMO_ROUTES.CATEGORY_SLIDER} element={<CategorySliderDemo />} />
            <Route path="/phone-auth-test" element={<PhoneAuthTestPage />} />

            {/* ===== 휴대폰 본인인증 라우트 ===== */}
            <Route path="/phone-verify" element={<PublicRoute><PhoneVerifyPage /></PublicRoute>} />
            <Route path="/phone-verify/code" element={<PublicRoute><VerificationCodePage /></PublicRoute>} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
            <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />

            {/* ===== Type Test Routes ===== */}
            <Route path="/type-test" element={<QuizPage />} />
            <Route path="/type-test/complete" element={<AnalysisCompletePage />} />
            <Route path="/type-test/result/:type" element={<ResultPage />} />

            {/* ===== 프로젝트 지원 라우트 ===== */}
            <Route path="/apply2" element={<ProjectApply />} />
            <Route path="/apply2/select" element={<ProjectApplySelect />} />
            <Route path="/apply2/complete" element={<ProjectApplyComplete />} />

            {/* ===== 알림 라우트 ===== */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/settings" element={<NotificationSettings />} />

            {/* ===== 프로젝트 생성하기 (로그인 필요) ===== */}
            <Route path="/recruit" element={<ProtectedRoute><ProjectRecruit /></ProtectedRoute>} />
            <Route path="/recruit/detail" element={<ProtectedRoute><ProjectRecruitDetail /></ProtectedRoute>} />
            <Route path="/recruit/image" element={<ProtectedRoute><ProjectRecruitImage /></ProtectedRoute>} />
            <Route path="/recruit/drafts" element={<ProtectedRoute><ProjectDrafts /></ProtectedRoute>} />
            <Route path="/recruit/preview" element={<ProtectedRoute><ProjectRecruitPreview /></ProtectedRoute>} />
            <Route path="/recruit/publish" element={<ProtectedRoute><ProjectRecruitPublish /></ProtectedRoute>} />
            <Route path="/recruit/publish/done" element={<ProtectedRoute><ProjectRecruitPublishDone /></ProtectedRoute>} />

            {/* ===== 법적 페이지 (로그인 없이 접근 가능) ===== */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />

            {/* ===== 기본 리다이렉트 ===== */}
            <Route path="/" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
            <Route path="*" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
          </Routes>
        </UniversityFilterProvider>
      </AuthProvider>
      </PushNotificationProvider>
      </NativeAppInitializer>
    </Router>
    </ErrorBoundary>
  );
};

export default App;
