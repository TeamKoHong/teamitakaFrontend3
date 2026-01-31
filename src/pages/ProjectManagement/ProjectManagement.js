import React, { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import "./ProjectManagement.scss";
import Header from "../../components/ProjectManagement/Header/Header";
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import ProgressComponent from "../../components/ProjectManagement/ProgressComponent/ProgressComponent";
import RecruitingComponent from "../../components/ProjectManagement/RecruitingComponent/RecruitingComponent";
import CompletedComponent from "../../components/ProjectManagement/CompletedComponent/CompletedComponent";
function ProjectManagement() {
  const [searchParams] = useSearchParams();
  const initialTab = (() => {
    const tab = searchParams.get('tab');
    if (tab === 'completed') return 2;
    if (tab === 'recruiting') return 1;
    return 0; // default: progress
  })();
  const [tabIndex, setTabIndex] = useState(initialTab); // 0: 진행 중, 1: 모집중, 2: 완료된
  const [, setSearchParams] = useSearchParams();

  const handleTabChange = (index) => {
    setTabIndex(index);
    const tabName = index === 2 ? 'completed' : index === 1 ? 'recruiting' : 'progress';
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="project-management-container">
      <Header onTabChange={handleTabChange} activeTabIndex={tabIndex} /> {/* Tab 변경 시 setTabIndex 실행 */}
      <main>
        {tabIndex === 0 && <ProgressComponent />}
        {tabIndex === 1 && <RecruitingComponent />}
        {tabIndex === 2 && <CompletedComponent />}
      </main>
      <BottomNav />
    </div>
  );
}

export default ProjectManagement;
