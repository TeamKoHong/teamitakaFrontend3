import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestLandingPage.scss';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import mascotImg from '../../assets/icons/project_empty.png';
import schoolIcon from '../../assets/icons/school.png';
import defaultProfile from '../../assets/default_profile.png';

const GuestLandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="guest-landing-page">
            {/* Fixed header matching MainPage */}
            <header className="header">
                <h1 className="logo">Teamitaka</h1>
            </header>

            {/* Welcome card matching MainPage profile-card structure */}
            <div className="top-card">
                <section className="welcome-card">
                    <div className="welcome-content">
                        <div className="welcome-title">
                            회원 가입하고
                            <br />
                            프로필을 만들어보세요.
                        </div>
                        <div className="status-badge">
                            <img src={schoolIcon} alt="" className="school-icon" />
                            대학 미인증
                        </div>
                        <button
                            className="register-btn"
                            onClick={() => navigate('/register')}
                        >
                            회원가입
                        </button>
                    </div>
                    <div className="welcome-illustration">
                        <img src={defaultProfile} alt="" className="profile-img" />
                    </div>
                </section>
            </div>

            {/* Section title matching MainPage */}
            <h2 className="section-title">내가 참여 중인 프로젝트</h2>

            {/* Projects preview matching MainPage my-projects */}
            <section className="projects-preview">
                <div className="empty-card">
                    <img src={mascotImg} alt="" className="empty-img" />
                    <p className="empty-text">
                        진행 중인 프로젝트가 없어요.
                        <br />
                        지금 바로 프로젝트를 시작해보세요!
                    </p>
                    <button
                        className="primary-btn"
                        onClick={() => navigate('/recruit')}
                    >
                        팀 프로젝트 시작하기
                    </button>
                </div>
            </section>

            <div className="bottom-spacer" />
            <BottomNav />
        </div>
    );
};

export default GuestLandingPage;
