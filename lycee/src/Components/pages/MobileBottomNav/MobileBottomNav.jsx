import React from 'react';
import { Link } from 'react-router-dom';

/**
 * UAB-style fixed bottom shortcuts (visible below 992px via CSS only).
 */
const MobileBottomNav = () => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Quick links">
      <Link to="/VisionValues">Vision & Values</Link>
      <span className="mobile-bottom-nav-divider" aria-hidden="true">
        |
      </span>
      <Link to="/newsEvents">News & Events</Link>
      <span className="mobile-bottom-nav-divider" aria-hidden="true">
        |
      </span>
      <Link to="/babyeyi" className="babyeyi-mobile-btn">
        BABYEYI
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
