import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../../assets/images/logo.png';

const NavigationMenu = ({ onNavigate, messageCount = 0 }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <nav className="main-navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/" onClick={() => handleNavigation('/')}>
                        <img
                            src={logo}
                            alt="LSASM Logo"
                            className="navbar-logo"
                        />
                    </Link>
                </div>
                
                                <button
                    className="nav-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
                    <Link 
                        to="/"
                        className="nav-link"
                        onClick={() => handleNavigation('/')}
                    >
                        Home
                    </Link>
                    
                    <Link 
                        to="/about"
                        className="nav-link"
                        onClick={() => handleNavigation('/about')}
                    >
                        About
                    </Link>
                    
                    <Link 
                        to="/VisionValues"
                        className="nav-link"
                        onClick={() => handleNavigation('/VisionValues')}
                    >
                        Vision & Values
                    </Link>
                    
                    <Link 
                        to="/DioceseByumba"
                        className="nav-link"
                        onClick={() => handleNavigation('/DioceseByumba')}
                    >
                        Diocese Byumba
                    </Link>
                    
                    <Link 
                        to="/students/life"
                        className="nav-link"
                        onClick={() => handleNavigation('/students/life')}
                    >
                        Student Life
                    </Link>
                    
                    <Link 
                        to="/newsEvents"
                        className="nav-link"
                        onClick={() => handleNavigation('/newsEvents')}
                    >
                        News & Events
                    </Link>
                    
                    <Link 
                        to="/Inspiration"
                        className="nav-link"
                        onClick={() => handleNavigation('/Inspiration')}
                    >
                        Inspiration
                    </Link>
                    
                    <Link 
                        to="/babyeyi"
                        className="babyeyi-button"
                                    onClick={() => handleNavigation('/babyeyi')}
                                >
                        <button type="button" className="btn btn-primary btn-sm">
                                    BABYEYI
                                </button>
                            </Link>
                                    </div>
                                </div>
        </nav>
    );
};

export default NavigationMenu;