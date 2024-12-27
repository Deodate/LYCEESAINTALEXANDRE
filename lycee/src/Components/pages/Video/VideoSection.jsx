import React from 'react';
import studentsImage from '../../../assets/images/students.jpeg';

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="container">
        <div className="content-wrapper">
          <div className="text-content">
          <h2 className="transform-title">Become our Student!</h2>
            <div className="white-line"></div>
            <p>
              At our Lycee in Kigali, we provide a transformative educational experience with diverse academic tracks, proven excellence shown by our 96% national exam pass rate, and a thriving community of over 800 students. Our comprehensive curriculum prepares students for success while fostering critical thinking and leadership skills in Rwanda's dynamic educational landscape.
            </p>
          </div>
          <div className="image-content">
            <img
              src={studentsImage}
              alt="Students walking on school"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;