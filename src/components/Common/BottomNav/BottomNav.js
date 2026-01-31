// src/components/Common/BottomNav/BottomNav.js
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { FaRegFolder } from "react-icons/fa6";
import { MdOutlinePerson } from "react-icons/md";
import { PiShareNetworkLight } from "react-icons/pi";

import styles from "./BottomNav.module.scss";

function BottomNav() {
  const location = useLocation();

  // Helper to determine active state
  const isTabActive = (path) => {
    if (path === '/project-management') {
      return location.pathname.startsWith('/project-management') || location.pathname.startsWith('/project/');
    }
    if (path === '/team-matching') {
      return location.pathname.startsWith('/team-matching');
    }
    if (path === '/profile') {
      return location.pathname.startsWith('/profile');
    }
    return location.pathname === path; // For /main
  };

  const navItems = [
    { path: '/main', label: '메인', icon: RiHome2Line },
    { path: '/project-management', label: '프로젝트 관리', icon: FaRegFolder },
    { path: '/team-matching', label: '팀매칭', icon: PiShareNetworkLight },
    { path: '/profile', label: '프로필', icon: MdOutlinePerson },
  ];

  return (
    <nav className={styles.bottomNavRoot} aria-label="Bottom Navigation" role="navigation">
      <div className={styles.visualRail}>
        <div className={styles.navItems}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = isTabActive(path);

            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive: linkActive }) =>
                  `${styles.navItem} ${isActive || linkActive ? styles.active : ""}`
                }
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={styles.navIcon} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className={styles.safeInset} />
    </nav>
  );
}

export default BottomNav;