import React from 'react';
import './VisionValues.css';
import schoolImage from '../../../assets/images/PereMario.jpg';

const VisionValues = () => {
  return (
    <div className="vision-container">
      <div className="content-wrapper">
        <div className="text-sectionV">
          <h1 className="welcomes-title">Vision and Values</h1>
          <p className="vision-text">
            At Lycée Saint Alexandre Sauli de Muhura, our goal is sustaining strategic growth that 
            positively impacts students' lives. From practical education to skill development to 
            community engagement, we are committed to improving the quality of education in 
            Muhura, Rwanda, and beyond. We strive for excellence, innovation, and integrity in all we 
            do.
          </p>
          <div className="links-list">
            <a href="/strategic-plan" className="link-item">
              <span>Achievement</span>
              <span className="arrow">→</span>
            </a>
            <a href="/values" className="link-item">
              <span>Shared Values</span>
              <span className="arrow">→</span>
            </a>
            <a href="/challenge" className="link-item">
              <span>Grand Challenge</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
        <div className="image-section">
          <img src={schoolImage} alt="School leadership" />
        </div>
      </div>
    </div>
  );
};

export default VisionValues;