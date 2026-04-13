import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Container from 'react-bootstrap/Container';

const Top = () => {
  return (
    <header>
      <div className="top-nav">
        <Container
          fluid
          className="top-nav-inner px-0 d-flex justify-content-between align-items-center"
        >
          <div className="left-nav-links">
            <Link to="/">Paroisse Muhura</Link>
            <span className="extra-links">
              <span className="text-white divider">|</span>
              <Link to="/">Gatsibo</Link>
              <span className="text-white divider">|</span>
              <Link to="/">Sant&apos;Antonio Maria Zaccaria</Link>
            </span>
          </div>
          <div className="top-nav-end d-flex align-items-center">
            <div className="right-nav-links">
              <Link to="/explore">Barnabite Fathers</Link>
            </div>
            <Link
              to="/newsEvents"
              className="mobile-top-search"
              aria-label="Search news and events"
            >
              <Search size={18} strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Top;
