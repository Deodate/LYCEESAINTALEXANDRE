import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

const Top = () => {
  return (
    <header>
      <div className="top-nav">
        <Container fluid className="px-0 d-flex justify-content-between align-items-center">
          <div className="left-nav-links">
            <Link to="/">Paroisse Muhura</Link>
            <span className="text-white divider">|</span>
            <Link to="/">Gatsibo</Link>
            <span className="text-white divider">|</span>
            <Link to="/">Sant'Antonio Maria Zaccaria</Link>
          </div>
          <div className="right-nav-links">
            <Link to="/explore">Barnabite Fathers</Link>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Top;