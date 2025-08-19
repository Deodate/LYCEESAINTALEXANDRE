import React from 'react';
import './DioceseByumba.css';  
import schoolImage from '../../../assets/images/Papias.jpg';

const DioceseByumba = () => {
  return (
    <div className="vision-container">
      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="welcome-title">Byumba Diocese</h1>
          <p className="vision-text">
          Created in 1962, the SNEC is one of the services of the Episcopal Conference of Rwanda, responsible for the guidance of Catholic education. Its mission is to evangelize, teach, and educate. Essentially, the SNEC is composed of other diocesan educational bodies that it coordinates, and together they implement all programs at the administrative, pedagogical, and pastoral levels to promote Catholic education in its entirety. Furthermore, the SNEC manages relations between Catholic education and public authorities.
          </p>
          <div className="links-list">
            <a href="/strategic-plan" className="link-item">
              <span>Byumba Diocese</span>
              <span className="arrow">→</span>
            </a>
            <a href="/values" className="link-item">
              <span>Conference Episcopale du Rwanda</span>
              <span className="arrow">→</span>
            </a>
            <a href="/challenge" className="link-item">
              <span>Muhura Paroisse</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
        <div className="image-sections">
          <img src={schoolImage} alt="School leadership" />
          <p className="from-pope-francis">--- Mgr Papias MUSENGAMANA</p>
        </div>
      </div>
    </div>
  );
};

export default DioceseByumba;