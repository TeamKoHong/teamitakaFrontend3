import React, { useState, useEffect, useRef } from 'react';
import './CollapsibleHeader.css';

const CollapsibleHeader = ({
  largeTitle,
  smallTitle,
  children,
  rightElement,
  threshold = 100,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const progress = Math.min(scrollTop / threshold, 1);

      setScrollProgress(progress);
      setCollapsed(scrollTop > threshold);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [threshold]);

  return (
    <div className="collapsible-container" ref={containerRef}>
      <header className={`collapsible-header ${collapsed ? 'collapsed' : ''}`}>
        <div
          className="collapsible-header__small"
          style={{ opacity: scrollProgress }}
        >
          <h1 className="collapsible-header__small-title">
            {smallTitle || largeTitle}
          </h1>
          {rightElement && (
            <div className="collapsible-header__right">{rightElement}</div>
          )}
        </div>
      </header>

      <div className="collapsible-content">
        <div
          className="collapsible-header__large"
          style={{
            opacity: 1 - scrollProgress,
            transform: `translateY(${-scrollProgress * 20}px)`,
          }}
        >
          <h1 className="collapsible-header__large-title">{largeTitle}</h1>
        </div>

        {children}
      </div>
    </div>
  );
};

export default CollapsibleHeader;
