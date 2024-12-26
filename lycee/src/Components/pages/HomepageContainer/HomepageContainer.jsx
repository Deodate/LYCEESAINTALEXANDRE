import React from 'react';
import bg from '../../../assets/images/txtimg.png';
import teacherImage from '../../../assets/images/PereMario.jpg'; // Update with your image path
import studentsImage from '../../../assets/images/teacher.jpg';

const HomepageContainer = () => {
  return (
    <>
      <div className="homepage-banner">
        <div className="banner-container">
          <img
            src={bg}
            alt="School panoramic view"
            className="banner-image"
          />
        </div>
      </div>
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to LSASM</h1>
        <p className="welcome-text">
          Approximately 3,200 yearly students of all genders reside and study as boarders at Lycee St. Alexandre Sauli Muhura, fostering a vibrant and engaging environment that makes building new friendships effortless!
        </p>
      </div>
      
      <div className="container-fluid excellence-section">
        <div className="row align-items-center">
          <div className="col-lg-6 p-0">
            <img
              src={teacherImage}
              alt="Teacher instructing students"
              className="img-fluid excellence-image"
            />
          </div>
          <div className="col-lg-6 excellence-content">
            <h2 className="excellence-title">Defined by Excellence</h2>
            <div className="green-line"></div>
            <p className="excellence-description">
              LSASM's comprehensive academic programs are rigorous, interdisciplinary, and practical. Our expert faculty provide a supportive learning environment that fosters curiosity, encourages innovative thinking, and cultivates lifelong learning.
            </p>
            <div className="program-links">
              <a href="#" className="program-link d-flex justify-content-between">
                <span>O'Level Programs</span>
                <span className="arrow">→</span>
              </a>
              <a href="#" className="program-link d-flex justify-content-between">
                <span>A'Level Programs</span>
                <span className="arrow">→</span>
              </a>
              <a href="#" className="program-link d-flex justify-content-between">
                <span>Special Programs</span>
                <span className="arrow">→</span>
              </a>
              <a href="#" className="program-link d-flex justify-content-between">
                <span>Find Your Program</span>
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

     {/* Previous sections remain the same */}
      
     <div className="container-fluid numbers-section">
     <div className="row align-items-center">
       <div className="col-lg-6 numbers-content">
         <div className="impact-subtitle">REAL IMPACTS</div>
         <h2 className="numbers-title">By the Numbers</h2>
         <div className="white-line"></div>
         
         <div className="statistics-grid">
           <div className="statistic-item">
             <div className="statistic-number">96%</div>
             <div className="statistic-label">National Exam Pass Rate</div>
           </div>
           
           <div className="statistic-item">
             <div className="statistic-number">15+</div>
             <div className="statistic-label">Academic Programs and Activities</div>
           </div>
           
           <div className="statistic-item">
             <div className="statistic-number">3.2K</div>
             <div className="statistic-label">Annual Student Enrollment</div>
           </div>
         </div>
       </div>
       
       <div className="col-lg-6 p-0">
         <img
           src={studentsImage}
           alt="Students walking on campus"
           className="img-fluid numbers-image"
         />
       </div>
     </div>
   </div>
 </>
  );
};

export default HomepageContainer;