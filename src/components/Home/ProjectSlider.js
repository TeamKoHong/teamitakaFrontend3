import React from 'react';

const ProjectSlider = () => {
  const projects = [
    {
      id: 1,
      name: '프로젝트명 A',
      duration: '2024.03 ~ 2024.06',
      meeting: '매주 수요일 21시',
      time: '2시간 전',
      dDay: 'D-07',
      members: ['👩', '🧑', '👨‍💻'],
    },
    {
      id: 2,
      name: '프로젝트명 B',
      duration: '2024.05 ~ 2024.08',
      meeting: '매주 금요일 19시',
      time: '3시간 전',
      dDay: 'D-15',
      members: ['👩‍🎓', '🧑‍🎓'],
    },
  ];

  return (
    <section className="project-slider">
      <h2>진행중인 프로젝트</h2>
      <div className="slider-container">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <div className="project-header">
              <div className="project-title">{project.name}</div>
              <div className="project-time">{project.time}</div>
            </div>
            <div className="project-detail">{project.duration}</div>
            <div className="project-detail">{project.meeting} 고정 회의</div>
            <div className="project-members">{project.members.join(' ')}</div>
            <div className="project-dday">{project.dDay}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectSlider;