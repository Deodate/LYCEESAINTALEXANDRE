import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h6>Lycee Saint Alexandre Sauli Muhura</h6>
          <p><i class="bi bi-phone text-info"></i>+250 788 000 000 </p>
          <p><i class="bi bi-envelope text-danger"></i> lyce@gmail.com  </p>
          <p>Easter Province</p>
          <p>Muhura, Sector</p>
          <Link to="/contact" className="contact-button">Contact Us</Link>
        </div>

        <div className="footer-section">
          <h2>ABOUT Lycee</h2> 
          <ul>
            <li><Link to="/apply">Diocese Byumba</Link></li>
            <li><Link to="/give">Conference Episcopale du Rwanda</Link></li>
            <li><Link to="/news">Vatican</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>QUICK LINKS</h2>
          <ul>
            <li><Link to="/apply">WDA - Workforce Development Authority</Link></li>
            <li><Link to="/give">NESA - National Examination and School Inspection Authority</Link></li>
            <li><Link to="/news">MINEDUC</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>CONNECT WITH US</h2>
          <div className="social-links">
            <Link to="#"><i className="bi bi-facebook"></i></Link>
            <Link to="#"><i className="bi bi-instagram"></i></Link>
            <Link to="#"><i className="bi bi-youtube"></i></Link>
            <Link to="#"><i className="bi bi-x"></i></Link>
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
            <Link to="/signin">Site Login</Link>
          </div>
          <p>© 2024 Lycee Saint Alexandre Sauli Muhura</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;