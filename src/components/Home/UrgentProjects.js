import React from 'react';
import eyeIcon from '../../assets/icons/eye.png';
import applyIcon from '../../assets/icons/apply.png';
import sampleImg from '../../assets/icons/sample.jpg';

const urgentProjects = [
  {
    id: 1,
    label: 'Best',
    title: '김혜현 교수님｜비주얼 마케터 디자인 팀 프로젝트 인원 구합니다!',
    company: '얼리버드',
    views: 302,
    comments: 79,
    date: '25.03.24',
    image: sampleImg,
  },
  // ...2, 3번 카드도 추가
];

const UrgentProjects = () => {
  return (
    <section className="urgent-projects">
      <h2 className="section-title">모집 마감 임박 프로젝트🔥</h2>
      <ul className="project-list">
        {urgentProjects.map((project) => (
          <li key={project.id} className="project-card">
            <img src={project.image} alt="썸네일" className="thumbnail" />
            <div className="project-info">
              <div className="badge">{project.label}</div>
              <div className="title">{project.title}</div>
              <div className="info-row">
              <div className="company">{project.company}</div>
              <div className="meta">
                <span>
                  <img src={eyeIcon} alt="조회수" className="meta-icon" />
                  {project.views}
                </span>
                <span>
                  <img src={applyIcon} alt="지원수" className="meta-icon" />
                  {project.comments}
                </span>
                <span>{project.date}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UrgentProjects;
