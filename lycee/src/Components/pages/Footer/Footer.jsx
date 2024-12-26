import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h6>Lycee Saint Alexandre Sauli Muhura</h6>
          <p>Easter Province</p>
          <p>Muhura, Sector</p>
          <Link to="/contact" className="contact-button">Contact Us</Link>
        </div>

        <div className="footer-section">
          <h2>ABOUT Lycee</h2>
          <ul>
            <li><Link to="/apply">Applys</Link></li>
            <li><Link to="/degrees">Degrees</Link></li>
            <li><Link to="/give">Give</Link></li>
            <li><Link to="/news">News</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>QUICK LINKS</h2>
          <ul>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/alumni">Alumni</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>CONNECT WITH US</h2>
          <div className="social-links">
            <Link to="#"><i className="bi bi-facebook"></i></Link>
            <Link to="#"><i className="bi bi-instagram"></i></Link>
            <Link to="#"><i className="bi bi-youtube"></i></Link>
            <Link to="#"><i className="bi bi-twitter-x"></i></Link>
            <Link to="#"><i className="bi bi-linkedin"></i></Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <Link to="/nondiscrimination">Nondiscrimination Statement</Link>
          <div className="footer-bottom-links">
            <button>Cookie Settings</button>
            <Link to="/contact">Contact Lycee</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms of Use</Link>
            <button>Site Login</button>
          </div>
          <p>© 2024 Lycee Saint Alexandre Sauli Muhura</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;