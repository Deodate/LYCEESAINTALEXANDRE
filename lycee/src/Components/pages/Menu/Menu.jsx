import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { MessageCircle } from 'lucide-react';
import logo from '../../../assets/images/logo.png';

const Menu = ({ onNavigate, messageCount = 0 }) => {
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
                            <Nav.Link onClick={() => handleNavigation('/')}>Home</Nav.Link>
                            <Nav.Link onClick={() => handleNavigation('/about')}>History</Nav.Link>
                            <Link to="/babyeyi">
                                <button
                                    type="button"
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleNavigation('/babyeyi')}
                                >
                                    BABYEYI
                                </button>
                            </Link>
                            <Nav.Link onClick={() => handleNavigation('/arts')}>News & Events</Nav.Link>
                            <NavDropdown
                                title="Staff"
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
                            <Nav.Link
                                onClick={() => handleNavigation('/messages')}
                                className="position-relative"
                            >
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-container position-relative">
                                        <MessageCircle className="me-1" size={26} style={{ color: 'red' }} />
                                        <span className="icon-number position-absolute top-50 start-50 translate-middle">
                                            5
                                        </span>
                                    </div>
                                    Message
                                    {messageCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {messageCount > 99 ? '99+' : messageCount}
                                        </span>
                                    )}
                                </div>



                            </Nav.Link>
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