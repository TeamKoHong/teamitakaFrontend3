import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import view from "../../assets/view.png";
import apply from "../../assets/apply.png";
import task_empty from "../../assets/task_empty.png";
import './RecruitmentPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import BackArrow from "../../components/Common/UI/BackArrow";
import { getAllRecruitments } from '../../api/recruit';
import { useUniversityFilter } from '../../hooks/useUniversityFilter';

export default function RecruitmentPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('전체');
  const [recruitments, setRecruitments] = useState([]);
  const [filterOptions, setFilterOptions] = useState(['전체']);
  const [loading, setLoading] = useState(true);
  const { filterByUniv } = useUniversityFilter();

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);
        const data = await getAllRecruitments();
        const formatted = data.map(post => {
            const viewCount = Number(post.views || post.view_count || 0);
            const appCount = Number(post.applicationCount || post.applicant_count || post.applicantCount || 0);
            const authorUniversity = post.university || post.author?.university || post.User?.university || null;

            return {
              id: post.recruitment_id,
              title: post.title,
              description: post.description || post.content || '설명 없음',
              imageUrl: post.photo_url,
              views: viewCount,
              applicantCount: appCount,
              date: post.created_at?.substring(0, 10).replace(/-/g, '.').substring(2),
              category: post.project_type === 'course' ? '수업' : '사이드',
              tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
              isBest: viewCount > 100,
              university: authorUniversity,
            };
        });
        setRecruitments(formatted);

        const allTags = new Set();
        formatted.forEach(item => {
          if (item.tags) {
            item.tags.forEach(tag => {
              if (tag) allTags.add(tag);
            });
          }
        });
        const sortedTags = Array.from(allTags).sort();
        setFilterOptions(['전체', ...sortedTags]);
      } catch (error) {
        console.error('Failed to fetch recruitments:', error);
        setRecruitments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruitments();
  }, []);

  // 대학 필터 적용
  const univFilteredRecruitments = useMemo(() => {
    return filterByUniv(recruitments, 'university');
  }, [recruitments, filterByUniv]);

  // 태그 필터 적용
  const filtered = univFilteredRecruitments.filter(item => {
    if (activeFilter === '전체') return true;
    return item.tags && item.tags.includes(activeFilter);
  });

  return (
    <div className="recruitment-page">
      <header className="recruitment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <BackArrow width={10} height={18} />
        </button>
        <h1 className="header-title">모집글</h1>
      </header>

      <div className="filter-tags horizontal-scroll">
        {filterOptions.map(tag => (
          <div
            key={tag}
            className={`filter-tag ${activeFilter === tag ? 'active' : ''}`}
            onClick={() => setActiveFilter(tag)}
          >
            {tag}
          </div>
        ))}
      </div>

      <ul className="recruitment-list">
        {loading ? (
          <div className="loading-message">로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-message">해당하는 모집글이 없습니다.</div>
        ) : (
          filtered.map(item => (
            <li key={item.id} className="recruit-item" onClick={() => navigate(`/recruitment/${item.id}`)}>
              <div className="thumbnail-wrapper">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="thumbnail-image" />
                ) : (
                  <div className="thumbnail-placeholder">
                    <img src={task_empty} alt="no-img" className="empty-img-icon" />
                  </div>
                )}
                {item.isBest && <span className="best-badge">Best</span>}
              </div>
              <div className="item-content">
                <h2 className="item-title">{item.title}</h2>
                <p className="item-desc">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="item-tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="tag-item">#{tag}</span>
                    ))}
                  </div>
                )}
                <div className="item-info">
                  <div className="twoicons">
                    <div className="view-icon"><img src={view} alt="조회수"/> {item.views}</div>
                    <div className="apply-icon"><img src={apply} alt="지원자"/> {item.applicantCount} </div>
                  </div>
                  <span className="item-date">{item.date}</span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <BottomNav />
    </div>
  );
}