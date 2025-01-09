// Menu.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import logo from '../../../assets/images/logo.png';

const Menu = ({ onNavigate }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <menu>
            <Navbar expand="lg" bg="white" className="py-0 position-relative">
                <Container>
                    <Navbar.Brand as={Link} to="/" onClick={() => handleNavigation('/')}>
                        <img
                            src={logo}
                            alt="School panoramic view"
                            height="80"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {/* Modified About link */}
                            <Nav.Link onClick={() => handleNavigation('/about')}>History</Nav.Link>
                            {/* <Link to="/about">About</Link> */}
                            <NavDropdown
                                title="Academics"
                                id="academics-dropdown"
                                className="nav-item"
                            >
                                <NavDropdown.Item onClick={() => handleNavigation('/academics/programs')}>
                                    Programs
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleNavigation('/academics/faculty')}>
                                    Faculty
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link onClick={() => handleNavigation('/research')}>BABYEYI</Nav.Link>
                            <Nav.Link onClick={() => handleNavigation('/arts')}>News & Events</Nav.Link>
                            <NavDropdown
                                title="Students"
                                id="students-dropdown"
                                className="nav-item"
                            >
                                <NavDropdown.Item onClick={() => handleNavigation('/students/life')}>
                                    Student Life
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleNavigation('/students/resources')}>
                                    Resources
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link onClick={() => handleNavigation('/athletics')}>Contact</Nav.Link>
                            <Nav.Link onClick={() => handleNavigation('/search')} className="search-link">
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