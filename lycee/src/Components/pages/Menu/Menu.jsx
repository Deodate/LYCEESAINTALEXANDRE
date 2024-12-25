import React from 'react';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import logo from '../../../assets/images/logo.png';

const Menu = () => {
  return (
    <menu>
      <Navbar expand="lg" bg="white" className="py-0 position-relative">
        <Container>
          <Navbar.Brand as={Link} to="/">
          <img
          src={logo}
          alt="School panoramic view"
          height="40"
          // width="40"
          className="d-inline-block align-top"
        />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                title="About"
                id="about-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item as={Link} to="/about/our-school">Our School</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/about/history">History</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/admissions">Admissions</Nav.Link>
              <NavDropdown
                title="Academics"
                id="academics-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item as={Link} to="/academics/programs">Programs</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/academics/faculty">Faculty</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/research">Research</Nav.Link>
              <Nav.Link as={Link} to="/arts">Art</Nav.Link>
              <NavDropdown
                title="Students"
                id="students-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item as={Link} to="/students/life">Student Life</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/students/resources">Resources</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/athletics">Athletics</Nav.Link>
              <Nav.Link as={Link} to="/search" className="search-link">
                <i className="bi bi-search"></i>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </menu>
  );
};

export default Menu;