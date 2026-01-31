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
// 🔥 [추가됨] 프로젝트 등록 페이지 import
import ProjectRegisterPage from './pages/Profile/ProjectRegisterPage/ProjectRegisterPage';

import IntroPage from './features/type-test/pages/IntroPage';
import QuizPage from './features/type-test/pages/QuizPage';
import AnalysisCompletePage from './features/type-test/pages/AnalysisCompletePage';
import ResultPage from './features/type-test/pages/ResultPage';

import MainPage from './components/Home/MainPage';

import ProjectApply from "./pages/ProjectApply/ProjectApply";
import ProjectApplySelect from "./pages/ProjectApply/ProjectApplySelect";
import ProjectApplyComplete from "./pages/ProjectApply/ProjectApplyComplete";

import NotificationSettings from './pages/NotificationsPage/NotificationSettings';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';

import ProjectRecruit from './pages/ProjectRecruit/ProjectRecruit/ProjectRecruit';
import ProjectRecruitDetail from './pages/ProjectRecruit/ProjectRecruitDetail/ProjectRecruitDetail';
import ProjectRecruitImage from './pages/ProjectRecruit/ProjectRecruitImage/ProjectRecruitImage';
import ProjectDrafts from './pages/ProjectRecruit/ProjectDrafts/ProjectDrafts';
import ProjectRecruitPreview from './pages/ProjectRecruit/ProjectRecruitPreview/ProjectRecruitPreview';
import ProjectRecruitPublish from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublish";
import ProjectRecruitPublishDone from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublishDone";

import PhoneVerifyPage from './pages/PhoneVerifyPage/PhoneVerifyPage';
import VerificationCodePage from './pages/VerificationCodePage/VerificationCodePage';
import ProfileSetupPage from './pages/ProfileSetupPage/ProfileSetupPage';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import RegisterCompletePage from './pages/RegisterCompletePage/RegisterCompletePage';

import { AuthProvider } from './contexts/AuthContext';
import { UniversityFilterProvider } from './contexts/UniversityFilterContext';
import GlobalToastSystem from './components/Common/GlobalToastSystem';
import AuthEventBridge from './components/Common/AuthEventBridge';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import ProfileVerificationPage from './pages/Profile/ProfileVerificationPage';

import {
  MAIN_ROUTES,
  PROJECT_ROUTES,
  EVALUATION_ROUTES,
  OTHER_ROUTES,
  PROFILE_ROUTES,
  isEvaluationRoute
} from './constants/routes';

const EvaluationGuard = ({ children }) => {
  const location = useLocation();
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEvaluationRoute(location.pathname)) {
        e.preventDefault();
        e.returnValue = '평가 작성 중입니다. 페이지를 나가시겠습니까?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location]);
  return children;
};

const ProjectPermissionGuard = ({ children, projectId }) => {
  const [hasPermission] = React.useState(true);
  return hasPermission ? children : <Navigate to={PROJECT_ROUTES.MANAGEMENT} replace />;
};

const ProjectEvaluationGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage mode="received" />
    </ProjectPermissionGuard>
  );
};

const ProjectEvaluationGivenGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage mode="given" />
    </ProjectPermissionGuard>
  );
};

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

const EvaluationStatusGuard = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const mode = location.pathname.includes('/given') ? 'given' : 'received';
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectStatusPage mode={mode} />
    </ProjectPermissionGuard>
  );
};

const NativeAppInitializer = ({ children }) => {
  useNativeApp();
  return children;
};

const App = () => {
  return (
    <Router>
      <NativeAppInitializer>
      <AuthProvider>
        <UniversityFilterProvider>
          <GlobalToastSystem />
          <AuthEventBridge />

          <Routes>
            <Route path={MAIN_ROUTES.HOME} element={<PublicRoute><OnboardingPage /></PublicRoute>} />
            <Route path={MAIN_ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path={MAIN_ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/find-id" element={<PublicRoute><FindIdPage /></PublicRoute>} />
            <Route path="/find-password" element={<PublicRoute><FindPasswordPage /></PublicRoute>} />
            <Route path="/register-complete" element={<RegisterCompletePage />} />

            <Route path="/main" element={<MainPage />} />
            <Route path={MAIN_ROUTES.MAIN} element={<MainPage />} />
            
            <Route path={PROFILE_ROUTES.MAIN} element={<ProfileMainPage />} />
            <Route path={PROFILE_ROUTES.EDIT} element={<ProfileEditPage />} />
            <Route path={PROFILE_ROUTES.VERIFICATION || "/profile/verification"} element={<ProfileVerificationPage />} />
            {/* 🔥 [추가됨] 프로젝트 등록 페이지 라우트 */}
            <Route path="/profile/register-project" element={<ProtectedRoute><ProjectRegisterPage /></ProtectedRoute>} />
            <Route path="/profile/project/view/:projectId" element={<ProjectDetailPage />} />
            
            <Route path={PROJECT_ROUTES.MANAGEMENT} element={<ProjectManagement />} />
            <Route path={PROJECT_ROUTES.DETAIL} element={<ProjectDetailPage />} /> 
            <Route path={PROJECT_ROUTES.MEMBER} element={<ProjectMemberPage />} />
            <Route path={PROJECT_ROUTES.PROCEEDINGS} element={<ProceedingsPage />} />
            <Route path={PROJECT_ROUTES.CREATE_MEETING} element={<CreateMeetingPage />} />
            <Route path={PROJECT_ROUTES.CALENDAR} element={<ProjectCalender />} />

            <Route path={EVALUATION_ROUTES.MANAGEMENT} element={<ProtectedRoute><RatingManagementPage /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.PROJECT} element={<ProtectedRoute><ProjectEvaluationGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.PROJECT_GIVEN} element={<ProtectedRoute><ProjectEvaluationGivenGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.FEEDBACK_DETAIL} element={<ProtectedRoute><ReceivedFeedbackDetailPage /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.TEAM_MEMBER} element={<ProtectedRoute><TeamMemberEvaluationGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS_GIVEN} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS_RECEIVED} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />

            <Route path={OTHER_ROUTES.TEAM_MATCHING} element={<TeamMatchingPage />} />
            <Route path={OTHER_ROUTES.RECRUITMENT} element={<RecruitmentPage />} />
            <Route path={OTHER_ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={OTHER_ROUTES.BOOKMARK} element={<BookmarkPage />} />
            <Route path="/recruitment/:id" element={<RecruitmentViewPage />} />
            <Route path="/recruitment/:id/team-select" element={<TeamSelectPage />} />

            <Route path="/phone-verify" element={<PublicRoute><PhoneVerifyPage /></PublicRoute>} />
            <Route path="/phone-verify/code" element={<PublicRoute><VerificationCodePage /></PublicRoute>} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
            <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />

            <Route path="/type-test" element={<IntroPage />} />
            <Route path="/type-test/quiz" element={<QuizPage />} />
            <Route path="/type-test/complete" element={<AnalysisCompletePage />} />
            <Route path="/type-test/result/:type" element={<ResultPage />} />

            <Route path="/apply2" element={<ProjectApply />} />
            <Route path="/apply2/select" element={<ProjectApplySelect />} />
            <Route path="/apply2/complete" element={<ProjectApplyComplete />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/settings" element={<NotificationSettings />} />

            <Route path="/recruit" element={<ProtectedRoute><ProjectRecruit /></ProtectedRoute>} />
            <Route path="/recruit/detail" element={<ProtectedRoute><ProjectRecruitDetail /></ProtectedRoute>} />
            <Route path="/recruit/image" element={<ProtectedRoute><ProjectRecruitImage /></ProtectedRoute>} />
            <Route path="/recruit/drafts" element={<ProtectedRoute><ProjectDrafts /></ProtectedRoute>} />
            <Route path="/recruit/preview" element={<ProtectedRoute><ProjectRecruitPreview /></ProtectedRoute>} />
            <Route path="/recruit/publish" element={<ProtectedRoute><ProjectRecruitPublish /></ProtectedRoute>} />
            <Route path="/recruit/publish/done" element={<ProtectedRoute><ProjectRecruitPublishDone /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
            <Route path="*" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
          </Routes>
        </UniversityFilterProvider>
      </AuthProvider>
      </NativeAppInitializer>
    </Router>
  );
};

export default App;