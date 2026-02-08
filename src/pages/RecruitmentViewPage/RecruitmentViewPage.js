import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecruitmentViewPage.scss';

// 아이콘 및 이미지 임포트
import { BsThreeDotsVertical } from "react-icons/bs";
import BackArrow from "../../components/Common/UI/BackArrow";

import viewIcon from "../../assets/view.png"; 
import applyIcon from "../../assets/apply.png"; 

import bookmarkIcon from "../../assets/bookmark.png";           
import bookmarkActiveIcon from "../../assets/bookmark_active.png"; 

import { getRecruitment, deleteRecruitment, toggleRecruitmentScrap } from '../../services/recruitment';
import { getCurrentUser } from '../../services/auth';
import { formatKoreanDateRange, formatRelativeTime } from '../../utils/dateUtils';
import ApplicantListSlide from '../../components/ApplicantListSlide';
import ReportModal from '../../components/Common/ReportModal';
import AlertModal from '../../components/Common/AlertModal';
import { blockUser } from '../../services/report';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../utils/toast';

export default function RecruitmentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showApplicantList, setShowApplicantList] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [error, setError] = useState(null);

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const userData = getCurrentUser();
        if (userData && userData.user) {
            setCurrentUser(userData.user);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMoreMenu && !event.target.closest('.more-menu-container')) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMoreMenu]);

    useEffect(() => {
        const fetchRecruitment = async () => {
            try {
                const response = await getRecruitment(id);
                const data = response.data || response;

                const hashtags = data.Hashtags || data.hashtags || [];
                const keywordList = hashtags.map(h => (typeof h === 'string' ? h : h.name));

                const formattedPost = {
                    id: data.recruitment_id,
                    title: data.title,
                    description: data.description || '',
                    period: (data.recruitment_start && data.recruitment_end)
                        ? formatKoreanDateRange(data.recruitment_start, data.recruitment_end)
                        : '모집 기간 미정',
                    projectInfo: data.description || '', 
                    projectType: data.project_type === 'course'
                        ? '수업 프로젝트'
                        : data.project_type === 'side'
                        ? '사이드 프로젝트'
                        : '프로젝트',
                    imageUrl: data.photo_url || data.photo, 
                    views: data.views || 0,
                    applicantCount: data.applicant_count || 0,
                    bookmarkCount: data.scrap_count || 0,
                    date: data.created_at ? formatRelativeTime(data.created_at) : '',
                    keywords: keywordList,
                    createdBy: data.user_id,
                    recruitmentInfo: { count: data.recruit_count || '-', activity: '-' },
                    activityMethod: data.activity_method || '-'
                };

                setPost(formattedPost);
                setIsBookmarked(!!data.is_scrapped);
            } catch (err) {

                setError(err.message);
            }
        };

        fetchRecruitment();
    }, [id]);

    useEffect(() => {
        if (post && currentUser) {
            setIsOwner(currentUser.userId === post.createdBy);
        }
    }, [post, currentUser]);

    const handleApply = () => {
        if (!post) return;
        if (!currentUser) {
            showErrorToast("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        navigate('/apply2', {
            state: { projectId: id, projectTitle: post.title }
        });
    };

    const handleViewApplicants = () => setShowApplicantList(true);

    const handleBookmarkToggle = async () => {
        if (!currentUser) {
            showErrorToast("로그인이 필요합니다.");
            return;
        }

        const previousState = isBookmarked;
        const previousCount = post.bookmarkCount;
        const newState = !previousState;

        setIsBookmarked(newState);
        setPost(prev => ({
            ...prev,
            bookmarkCount: Math.max(0, newState ? prev.bookmarkCount + 1 : prev.bookmarkCount - 1)
        }));

        if (newState) {
            setToastMessage('현재 게시글을 스크랩 했습니다.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }

        try {
            await toggleRecruitmentScrap(id);
        } catch (error) {
            setIsBookmarked(previousState);
            setPost(prev => ({ ...prev, bookmarkCount: previousCount }));
            setShowToast(false);
        }
    };

    const handleCloseApplicantList = () => setShowApplicantList(false);

    const handleEdit = () => {
        setShowMoreMenu(false);
        showWarningToast('게시글 수정 페이지는 아직 준비 중입니다.');
    };

    const handleDelete = async () => {
        setShowMoreMenu(false);
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deleteRecruitment(id);
            showSuccessToast('게시글이 삭제되었습니다.');
            navigate('/team-matching');
        } catch (err) {
            showErrorToast('삭제에 실패했습니다.');
        }
    };

    const handleReport = () => {
        setShowMoreMenu(false);
        if (!currentUser) {
            showErrorToast("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        setShowReportModal(true);
    };

    const handleBlockUser = () => {
        setShowMoreMenu(false);
        if (!currentUser) {
            showErrorToast("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        setShowBlockConfirm(true);
    };

    const handleBlockConfirm = async () => {
        try {
            await blockUser(post.createdBy);
            setShowBlockConfirm(false);
            setToastMessage('사용자를 차단했습니다.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            showErrorToast(err.message || '차단에 실패했습니다.');
            setShowBlockConfirm(false);
        }
    };

    const handleReportSuccess = () => {
        setToastMessage('신고가 접수되었습니다.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    if (error) return <div className="view-page-status">{error}</div>;
    if (!post) return <div className="view-page-status">로딩 중...</div>;

    return (
        <div className="view-page">
            <header className="topbar">
                <button onClick={() => navigate(-1)} className="back-button">
                    <BackArrow />
                </button>
                <h1 className="title">모집글</h1>
                <div className="more-menu-container">
                    <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="more-button">
                        <BsThreeDotsVertical size={20} />
                    </button>
                    {showMoreMenu && (
                        <div className="more-menu">
                            {isOwner ? (
                                <>
                                    <button onClick={handleEdit} className="menu-item">게시글 수정하기</button>
                                    <button onClick={handleDelete} className="menu-item">게시글 삭제하기</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleReport} className="menu-item">신고하기</button>
                                    <button onClick={handleBlockUser} className="menu-item">작성자 차단하기</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>
            <hr className="divider" />

            <main className="content">
                {post.imageUrl && (
                    <div className="image-container">
                        <img src={post.imageUrl} alt="대표 이미지" className="cover-image" />
                    </div>
                )}
                
                <section className="post-header">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="meta-info">
                        <div className="twoicons">
                            <div className="view-icon"><img src={viewIcon} alt="v" /> {post.views}</div>
                            <div className="apply-icon" onClick={handleViewApplicants}><img src={applyIcon} alt="a" /> {post.applicantCount}</div>
                        </div>
                        <span className="date">{post.date}</span>
                    </div>
                </section>
                                
                <section className="project-details">
                    <div className="detail-item">
                        <span className="label">모집 기간</span>
                        <span className="value">{post.period}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">프로젝트 정보</span>
                        <span className="value">{post.projectInfo}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">프로젝트 유형</span>
                        <span className="value">{post.projectType}</span>
                    </div>
                </section>

                <hr className="divider" />
                <section className="post-body"><p>{post.description}</p></section>
                <hr className="divider" />

                <section className="keywords-section">
                    <h3 className="keywords-label">키워드</h3>
                    <div className="keywords-tags">
                        {post.keywords.length > 0 ? post.keywords.map((tag, index) => (
                            <span key={index} className="keyword-tag">#{tag}</span>
                        )) : <span className="no-keywords">등록된 키워드가 없습니다.</span>}
                    </div>
                </section>
            </main>

            {showToast && (
                <div className="toast-overlay">
                    <div className="toast-box">
                        <div className="check-circle">✓</div>
                        <p>{toastMessage || '현재 게시글을 스크랩 했습니다.'}</p>
                    </div>
                </div>
            )}

            <footer className="footer">
                <div className="footer-buttons-new">
                    {isOwner ? (
                        <>
                            <button onClick={handleViewApplicants} className="apply-btn-expanded">지원자 보기</button>
                            <button onClick={() => navigate(-1)} className="close-btn">닫기</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleBookmarkToggle} className="bookmark-btn">
                                <img src={isBookmarked ? bookmarkActiveIcon : bookmarkIcon} alt="b" />
                                <span className="bookmark-count">{post.bookmarkCount}</span>
                            </button>
                            <button onClick={handleApply} className="apply-btn-expanded">지원하기</button>
                        </>
                    )}
                </div>
            </footer>

            {showApplicantList && (
                <ApplicantListSlide open={showApplicantList} onClose={handleCloseApplicantList} recruitmentId={id} />
            )}

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetType="recruitment"
                targetId={id}
                onSuccess={handleReportSuccess}
            />

            <AlertModal
                isOpen={showBlockConfirm}
                title="사용자를 차단하시겠습니까?"
                description="차단하면 이 사용자의 게시글이 더 이상 표시되지 않습니다."
                primaryLabel="차단"
                secondaryLabel="취소"
                onPrimary={handleBlockConfirm}
                onSecondary={() => setShowBlockConfirm(false)}
                onClose={() => setShowBlockConfirm(false)}
            />
        </div>
    );
}