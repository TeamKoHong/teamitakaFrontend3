import React from 'react';
import './PageTransition.css';

const PageTransition = ({ children, direction = 'forward' }) => {
  return (
    <div className={`page-transition page-transition--${direction}`}>
      {children}
    </div>
  );
};

export default PageTransition;
