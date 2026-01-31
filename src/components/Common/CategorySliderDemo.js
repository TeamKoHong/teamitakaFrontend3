import React, { useState } from 'react';
import CategorySlider from './CategorySlider';

const CategorySliderDemo = () => {
  const [ratings, setRatings] = useState({
    participation: 3,
    communication: 3,
    responsibility: 3,
    collaboration: 3,
    individualAbility: 3
  });

  const categories = [
    {
      key: 'participation',
      name: '참여도',
      description: '해당 팀원의 프로젝트 내에서 참여도를 점수로 평가해주세요'
    },
    {
      key: 'communication',
      name: '소통',
      description: '해당 팀원과의 의사소통 태도를 점수로 평가해주세요'
    },
    {
      key: 'responsibility',
      name: '책임감',
      description: '해당 팀원의 프로젝트 책임감을 점수로 평가해주세요'
    },
    {
      key: 'collaboration',
      name: '협력',
      description: '해당 팀원의 팀워크와 협력 능력을 점수로 평가해주세요'
    },
    {
      key: 'individualAbility',
      name: '개인능력',
      description: '해당 팀원의 개인적인 업무 능력을 점수로 평가해주세요'
    }
  ];

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f2f2f2', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>CategorySlider Demo</h2>
      
      {categories.map((category) => (
        <CategorySlider
          key={category.key}
          category={category.key}
          name={category.name}
          description={category.description}
          value={ratings[category.key]}
          onChange={(value) => handleRatingChange(category.key, value)}
        />
      ))}
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3>Current Ratings:</h3>
        <pre>{JSON.stringify(ratings, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CategorySliderDemo;