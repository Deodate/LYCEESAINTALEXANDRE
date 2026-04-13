import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../../../assets/images/logo.png';

/** True when `pathname` is exactly `to` or a nested path under `to` (except home: exact `/` only). */
function pathMatches(pathname, to) {
    const p = pathname.split('?')[0] || '/';
    if (to === '/') {
        return p === '/' || p === '';
    }
    if (to === '/students/life') {
        return p === '/students/life' || p === '/students' || p.startsWith('/students/');
    }
    return p === to || p.startsWith(`${to}/`);
}

const NavigationMenu = ({ onNavigate }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = location;

    const closeMenu = () => setIsMenuOpen(false);

    const handleNavigation = (path) => {
        navigate(path);
        closeMenu();
        if (onNavigate) {
            onNavigate();
        }
    };

    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    useEffect(() => {
        if (!isMenuOpen) {
            document.body.style.overflow = '';
            return undefined;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };
        const onResize = () => {
            if (window.innerWidth >= 992) {
                closeMenu();
            }
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, [isMenuOpen]);

    return (
        <nav className="main-navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link
                        to="/"
                        className="nav-brand-link"
                        aria-label="Lycée Saint Alexandre Sauli de Muhura — Home"
                        onClick={() => handleNavigation('/')}
                    >
                        <span className="nav-brand-logo-slot" aria-hidden="true">
                            <img
                                src={logo}
                                alt=""
                                className="navbar-logo"
                            />
                        </span>
                        <span className="nav-brand-wordmark">
                            <span className="nav-brand-wordmark-line1">Lycée Saint Alexandre</span>
                            <span className="nav-brand-wordmark-line2">Sauli de Muhura</span>
                        </span>
                    </Link>
                </div>

                <button
                    type="button"
                    className="nav-toggle"
                    onClick={() => setIsMenuOpen(true)}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu-overlay"
                    aria-label="Open menu"
                >
                    <Menu size={24} aria-hidden="true" />
                </button>

                <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
                    <Link
                        to="/"
                        className={`nav-link${pathMatches(pathname, '/') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/') ? 'page' : undefined}
                        onClick={() => handleNavigation('/')}
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className={`nav-link${pathMatches(pathname, '/about') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/about') ? 'page' : undefined}
                        onClick={() => handleNavigation('/about')}
                    >
                        About
                    </Link>

                    <Link
                        to="/VisionValues"
                        className={`nav-link${pathMatches(pathname, '/VisionValues') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/VisionValues') ? 'page' : undefined}
                        onClick={() => handleNavigation('/VisionValues')}
                    >
                        Vision & Values
                    </Link>

                    <Link
                        to="/DioceseByumba"
                        className={`nav-link${pathMatches(pathname, '/DioceseByumba') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/DioceseByumba') ? 'page' : undefined}
                        onClick={() => handleNavigation('/DioceseByumba')}
                    >
                        Diocese Byumba
                    </Link>

                    <Link
                        to="/students/life"
                        className={`nav-link${pathMatches(pathname, '/students/life') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/students/life') ? 'page' : undefined}
                        onClick={() => handleNavigation('/students/life')}
                    >
                        Student Life
                    </Link>

                    <Link
                        to="/newsEvents"
                        className={`nav-link${pathMatches(pathname, '/newsEvents') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/newsEvents') ? 'page' : undefined}
                        onClick={() => handleNavigation('/newsEvents')}
                    >
                        News & Events
                    </Link>

                    <Link
                        to="/Inspiration"
                        className={`nav-link${pathMatches(pathname, '/Inspiration') ? ' nav-link-active' : ''}`}
                        aria-current={pathMatches(pathname, '/Inspiration') ? 'page' : undefined}
                        onClick={() => handleNavigation('/Inspiration')}
                    >
                        Inspiration
                    </Link>

                    <Link
                        to="/babyeyi"
                        className={`babyeyi-button babyeyi-desktop-only${pathMatches(pathname, '/babyeyi') ? ' babyeyi-nav-active' : ''}`}
                        aria-current={pathMatches(pathname, '/babyeyi') ? 'page' : undefined}
                        onClick={() => handleNavigation('/babyeyi')}
                    >
                        <button type="button" className="btn btn-primary btn-sm">
                            BABYEYI
                        </button>
                    </Link>
                </div>
            </div>

            <div
                id="mobile-menu-overlay"
                className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-hidden={!isMenuOpen}
            >
                <div className="mobile-menu-header">
                    <button
                        type="button"
                        className="mobile-menu-close"
                        onClick={closeMenu}
                    >
                        Close
                    </button>
                </div>

                <div className="mobile-menu-links">
                    <Link
                        to="/"
                        className={pathMatches(pathname, '/') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/') ? 'page' : undefined}
                        onClick={() => handleNavigation('/')}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={pathMatches(pathname, '/about') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/about') ? 'page' : undefined}
                        onClick={() => handleNavigation('/about')}
                    >
                        About
                    </Link>
                    <Link
                        to="/VisionValues"
                        className={pathMatches(pathname, '/VisionValues') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/VisionValues') ? 'page' : undefined}
                        onClick={() => handleNavigation('/VisionValues')}
                    >
                        Vision & Values
                    </Link>
                    <Link
                        to="/DioceseByumba"
                        className={pathMatches(pathname, '/DioceseByumba') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/DioceseByumba') ? 'page' : undefined}
                        onClick={() => handleNavigation('/DioceseByumba')}
                    >
                        Diocese Byumba
                    </Link>
                    <Link
                        to="/students/life"
                        className={pathMatches(pathname, '/students/life') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/students/life') ? 'page' : undefined}
                        onClick={() => handleNavigation('/students/life')}
                    >
                        Student Life
                    </Link>
                    <Link
                        to="/newsEvents"
                        className={pathMatches(pathname, '/newsEvents') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/newsEvents') ? 'page' : undefined}
                        onClick={() => handleNavigation('/newsEvents')}
                    >
                        News & Events
                    </Link>
                    <Link
                        to="/Inspiration"
                        className={pathMatches(pathname, '/Inspiration') ? 'mobile-menu-link-active' : undefined}
                        aria-current={pathMatches(pathname, '/Inspiration') ? 'page' : undefined}
                        onClick={() => handleNavigation('/Inspiration')}
                    >
                        Inspiration
                    </Link>
                </div>

                <div className="mobile-menu-cta">
                    <Link
                        to="/babyeyi"
                        className={pathMatches(pathname, '/babyeyi') ? 'mobile-menu-cta-active' : undefined}
                        aria-current={pathMatches(pathname, '/babyeyi') ? 'page' : undefined}
                        onClick={() => handleNavigation('/babyeyi')}
                    >
                        BABYEYI
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavigationMenu;
