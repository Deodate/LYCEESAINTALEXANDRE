import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

const Top = () => {
  return (
    <header>
      <div className="top-nav">
        <Container className="d-flex justify-content-between align-items-center">
          <div>
            <Link to="/">Muhura Paroisse</Link>
            <Link to="/">Gatsibo</Link>
            <Link to="/">Sant'Antonio Maria Zaccaria</Link>
          </div>
          <div>
            <Link to="/explore">Barnabite Fathers</Link>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Top;