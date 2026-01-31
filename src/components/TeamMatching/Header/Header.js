// src/components/TeamMatching/Header/Header.js
import React from 'react';
import './Header.scss';
import search_icon from "../../../assets/search_icon.png";

import { useNavigate } from 'react-router-dom';

function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="teamheader">
      <div className="header-first">
        <div className="header-left">
          <h1 className="title">{title || '모집하기'}</h1>
        </div>
        <div className="header-right">
          <button
            className="btn-search"
            onClick={() => navigate('/search')}
            type="button"
          >
            <img src={search_icon} alt="알림" className="icon-search" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
