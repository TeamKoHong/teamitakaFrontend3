import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './TeamMatchingPage.scss';

// --- 컴포넌트 및 에셋 임포트 ---
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import BackArrow from "../../components/Common/UI/BackArrow";
import Header from "../../components/TeamMatching/Header/Header";
import recruit_write from "../../assets/recruit_write.png";
import bookmark from "../../assets/bookmark.png";
import bookmarkActive from "../../assets/bookmark_active.png";
import view from "../../assets/view.png";
import apply from "../../assets/apply.png";
import back from "../../assets/back.png"; // 수정: back.png 사용을 위해 임포트
import task_empty from "../../assets/task_empty.png";
import { getAllRecruitments } from '../../api/recruit';
import { toggleRecruitmentScrap } from '../../services/recruitment';
import { useAuth } from '../../contexts/AuthContext';
import { getShortSchoolName } from '../../constants/schools';
import { useUniversityFilter } from '../../hooks/useUniversityFilter';

const CreateProjectBanner = () => {
    const navigate = useNavigate();
    return (
        <div className="create-project-banner" onClick={() => navigate('/recruit')}>
            <img src={recruit_write} alt="생성" className="banner-icon" />
            <div className="banner-text">
                <div className="banner-title">프로젝트 생성하기</div>
                <p className="banner-description">잘 맞는 티미를 구하고 싶다면 직접 생성해보세요!</p>
            </div>
        </div>
    );
};

const HotTopicCard = ({ item, onBookmarkToggle }) => {
    const navigate = useNavigate();
    const handleCardClick = () => navigate(`/recruitment/${item.id}`);
    const displayTag = (item.tags && item.tags.length > 0) ? `#${item.tags[0]}` : (item.category || '프로젝트');

    return (
        <div className="hot-topic-card" onClick={handleCardClick}>
            <div className="hot-topic-card-header">
                <span className="tag marketing">{displayTag}</span>
                <img
                    src={item.isBookmarked ? bookmarkActive : bookmark}
                    alt="북마크"
                    className="bookmark-icon"
                    onClick={(e) => { e.stopPropagation(); onBookmarkToggle(item.id); }}
                />
            </div>
            <div className="hot-topic-card-title">{item.title}</div>
            <div className="hot-topic-card-desc">{item.description}</div>
            <div className="hot-topic-card-info">
                <div className="twoicons">
                    <div className="view-icon"><img src={view} alt="조회수" /> {item.views}</div>
                    <div className="apply-icon"><img src={apply} alt="지원자" /> {item.applicantCount} </div>
                </div>
            </div>
        </div>
    );
};

const MatchingCard = ({ item }) => {
    const navigate = useNavigate();
    const handleCardClick = () => navigate(`/recruitment/${item.id}`);
    const imageSource = item.imageUrl || task_empty;

    return (
        <div className="matching-card" onClick={handleCardClick}>
            <div className="matching-card-thumbnail">
                <img
                    src={imageSource}
                    alt={item.title}
                    className="card-img"
                    onError={(e) => { e.target.src = task_empty; }} />
                {item.isBest && <span className="best-badge">Best</span>}
            </div>
            <div className="matching-card-content">
                <div className="matching-card-title">{item.title}</div>
                <div className="matching-card-desc">
                    {item.description || "설명 없음"}
                </div>
                <div className="card-footer">
                    <div className="twoicons">
                        <div className="view-icon"><img src={view} alt="조회수" /> {item.views}</div>
                        <div className="apply-icon"><img src={apply} alt="지원자" /> {item.applicantCount} </div>
                    </div>
                    <div className="date-icon">{item.date}</div>
                </div></div>
        </div>
    );
};

export default function TeamMatchingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const passedSearchQuery = location.state?.searchQuery || '';

    const [activeFilter, setActiveFilter] = useState('전체');
    const [allPosts, setAllPosts] = useState([]);
    const [hotProjects, setHotProjects] = useState([]);
    const [filterTabs, setFilterTabs] = useState(['전체']);
    const [isLoading, setIsLoading] = useState(true);

    const { user: currentUser } = useAuth();
    const { filterByUniv, userUniversity } = useUniversityFilter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllRecruitments();
                const formattedData = data.map(post => {
                    const viewCount = Number(post.views || 0);
                    const appCount = Number(post.applicationCount || 0);
                    // 작성자 학교 정보 추출 (API 응답 구조에 따라 조정 필요)
                    const authorUniversity = post.university || post.author?.university || post.User?.university || null;
                    return {
                        id: post.recruitment_id,
                        title: post.title,
                        description: post.description,
                        imageUrl: post.photo_url || post.imageUrl || null,
                        views: viewCount,
                        applicantCount: appCount,
                        date: post.created_at ? (typeof post.created_at === 'string' ? post.created_at.substring(0, 10) : '') : '',
                        tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
                        score: viewCount + (appCount * 10),
                        isBookmarked: !!post.is_scrapped,
                        isBest: appCount >= 5,
                        university: authorUniversity, // 작성자 학교 정보 추가
                    };
                });

                const sortedByScore = [...formattedData].sort((a, b) => b.score - a.score);
                setHotProjects(sortedByScore.slice(0, 3));

                const tagCounts = {};
                formattedData.forEach(post => {
                    if (post.tags) post.tags.forEach(tag => {
                        if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                });
                const sortedTags = Object.entries(tagCounts)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([tag]) => tag)
                    .slice(0, 5);

                setFilterTabs(sortedTags.length > 0 ? sortedTags : ['전체']);
                setActiveFilter(sortedTags.length > 0 ? sortedTags[0] : '전체');
                setAllPosts(formattedData);
            } catch (error) {

            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleBookmarkToggle = async (id) => {
        if (!currentUser) return alert('로그인이 필요합니다.');
        setHotProjects(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
        setAllPosts(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
        try { await toggleRecruitmentScrap(id); } catch { /* 북마크 실패 무시 */ }
    };

    // 학교 필터 적용된 게시물 목록
    const schoolFilteredPosts = useMemo(() => {
        return filterByUniv(allPosts, 'university');
    }, [allPosts, filterByUniv]);

    // 학교 필터 적용된 HOT 프로젝트
    const schoolFilteredHotProjects = useMemo(() => {
        return filterByUniv(hotProjects, 'university');
    }, [hotProjects, filterByUniv]);

    const filteredMatching = schoolFilteredPosts.filter(item => {
        if (passedSearchQuery) {
            const query = passedSearchQuery.toLowerCase();
            return item.title.toLowerCase().includes(query) || (item.description?.toLowerCase().includes(query)) || (item.tags?.some(t => t.toLowerCase().includes(query)));
        }
        return activeFilter === '전체' || (item.tags && item.tags.includes(activeFilter));
    });

    return (
        <div className="team-matching-app">
            {!passedSearchQuery && <Header />}

            <main className="app-content">
                {!passedSearchQuery && (
                    <>
                        <section className="section section-project-banner">
                            <div className="section-header"><h2 className="section-title">팀원 구하기</h2></div>
                            <CreateProjectBanner />
                        </section>

                        <section className="section section--panel">
                            <div className="section-header">
                                <h2 className="section-title">
                                    {userUniversity
                                        ? `${getShortSchoolName(userUniversity)} HOT 공고`
                                        : 'HOT 공고'
                                    }
                                </h2>
                            </div>
                            <div className="horizontal-scroll-list">
                                {isLoading ? <div style={{ padding: '20px', color: '#999' }}>로딩 중...</div> :
                                    schoolFilteredHotProjects.length > 0 ? schoolFilteredHotProjects.map(item => (
                                        <HotTopicCard key={item.id} item={item} onBookmarkToggle={handleBookmarkToggle} />
                                    )) : <div style={{ padding: '20px', color: '#999' }}>
                                        {userUniversity ? '교내 공고가 없습니다.' : '등록된 공고가 없습니다.'}
                                    </div>}
                            </div>
                        </section>
                    </>
                )}

                <section className="section">
                    {passedSearchQuery ? (
                        <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
                            <button onClick={() => navigate('/search')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px', display: 'flex', alignItems: 'center', padding: '4px' }}><BackArrow /></button>
                            <h2 className="section-title" style={{ margin: 0 }}>"{passedSearchQuery}" 검색 결과</h2>
                        </div>
                    ) : (
                        <div className="section-top">
                            <div className="section-header">
                                <div className="banner-text">
                                    <h2 className="section-title">키워드 별 모집</h2>
                                    <p className="banner-description">가장 인기 있는 키워드를 모아봤어요!</p>
                                </div>
                                <Link to="/recruitment" state={{ filter: activeFilter }} className="section-more">
                                    자세히보기 <img src={back} alt="아이콘" />
                                </Link>
                            </div>
                            <div className="horizontal-scroll-list filter-tags">
                                {filterTabs.map(filter => (
                                    <div key={filter} className={`filter-tag ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="matching-list">
                        {isLoading ? <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div> :
                            filteredMatching.length > 0 ? filteredMatching.map(item => <MatchingCard key={item.id} item={item} />) :
                                <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>{passedSearchQuery ? `'${passedSearchQuery}' 결과 없음` : '모집글 없음'}</div>}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}