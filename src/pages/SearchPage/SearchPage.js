import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import search_icon from "../../assets/search_icon.png";
import BackArrow from "../../components/Common/UI/BackArrow";
import './SearchPage.scss';
import { getAllRecruitments } from '../../api/recruit';
import { useUniversityFilter } from '../../hooks/useUniversityFilter';
import { showWarningToast } from '../../utils/toast';

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { filterByUniv } = useUniversityFilter();

  const [searchText, setSearchText] = useState('');
  const [recentTags, setRecentTags] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem('recentSearches');
    if (storedHistory) {
      setRecentTags(JSON.parse(storedHistory));
    }

    const fetchPopularKeywords = async () => {
      try {
        const data = await getAllRecruitments();
        // 대학 필터링을 위해 university 필드 추가
        const postsWithUniv = data.map(post => ({
          ...post,
          university: post.university || post.author?.university || post.User?.university || null,
        }));
        // 대학 필터 적용
        const filteredPosts = filterByUniv(postsWithUniv, 'university');

        const tagCounts = {};
        filteredPosts.forEach(post => {
          const tags = post.Hashtags || post.hashtags || [];
          tags.forEach(tagObj => {
             const tagName = typeof tagObj === 'string' ? tagObj : tagObj.name;
             if (tagName) {
                tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
             }
          });
        });
        const sortedTags = Object.entries(tagCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .map(([tag]) => tag)
          .slice(0, 10);

        setPopularTags(sortedTags);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    fetchPopularKeywords();
  }, [filterByUniv]);

  const handleTagRemove = (tagToRemove, e) => {
    e.stopPropagation(); 
    const updatedTags = recentTags.filter(tag => tag !== tagToRemove);
    setRecentTags(updatedTags);
    localStorage.setItem('recentSearches', JSON.stringify(updatedTags));
  };

  const handlePopularRemove = (tagToRemove, e) => {
    e.stopPropagation();
    setPopularTags(popularTags.filter(tag => tag !== tagToRemove));
  };

  const handleSearch = (keyword) => {
    const query = keyword || searchText; 

    if (!query.trim()) {
      showWarningToast("검색어를 입력해주세요.");
      return;
    }

    const newHistory = [query, ...recentTags.filter(tag => tag !== query)].slice(0, 10);
    setRecentTags(newHistory);
    localStorage.setItem('recentSearches', JSON.stringify(newHistory));

    navigate('/team-matching', { 
      state: { searchQuery: query } 
    });
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <button className="back-button" onClick={() => navigate('/team-matching')}>
          <BackArrow />
        </button>
        <h1 className="header-title">검색</h1>
        <div className="spacer"></div>
      </header>

      <div className="search-box-container">
        <div className="search-box" onClick={() => inputRef.current?.focus()}>
            <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="검색어를 입력해주세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={() => handleSearch()}>
              <img src={search_icon} alt="검색" style={{width: '14px', height: '15px'}} />
            </button>
        </div>
      </div>

      <div className="recent-section">
        <h2 className="section-title">최근 검색어</h2>
        <div className="tag-list">
          {recentTags.length === 0 ? (
            <div className="empty-msg">최근 검색 내역이 없습니다.</div>
          ) : (
            recentTags.map(tag => (
              <span key={tag} className="tag-item" onClick={() => handleSearch(tag)}>
                <span className="tag-text">{tag}</span>
                <button onClick={(e) => handleTagRemove(tag, e)} className="remove-btn"></button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="popular-section">
        <h2 className="section-title">인기 검색어</h2>
        <div className="tag-list">
          {loading ? (
             <div className="empty-msg">데이터 분석 중...</div>
          ) : popularTags.length === 0 ? (
             <div className="empty-msg">인기 태그가 없습니다.</div>
          ) : (
            popularTags.map((keyword) => (
              <span key={keyword} className="tag-item" onClick={() => handleSearch(keyword)}>
                <span className="tag-text">{keyword}</span>
                <button onClick={(e) => handlePopularRemove(keyword, e)} className="remove-btn"></button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}