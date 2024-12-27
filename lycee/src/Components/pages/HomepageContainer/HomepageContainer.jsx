import React from 'react';
import teacherImage from '../../../assets/images/PereMario.jpg'; 
import studentsImage from '../../../assets/images/students.jpeg';
import NewsSection from '../NewsSection/NewsSection';
import studentsimg from '../../../assets/images/student2.jpg';
import VideoSection from '../Video/VideoSection';

const HomepageContainer = () => {

  const links = [
    { text: "O'Level Programs", path: "/programs/olevel" },
    { text: "A'Level Programs", path: "/programs/alevel" },
    { text: "Special Programs", path: "/programs/special" },
    { text: "Find Your Program", path: "/programs/finder" }
  ];

  const transformLinks = [
    { text: "Research", path: "/research" },
    { text: "Patient Care", path: "/patient-care" },
    { text: "Academics", path: "/academics" }
  ];

  return (
    <>
      <div className="homepage-banner">
        <div className="banner-container">
          <img
           src={teacherImage}
            alt="School panoramic view"
            className="banner-image"
          />
        </div>
      </div>

      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to LSASM</h1>
        <p className="welcome-text">
          Approximately 800 yearly students of all genders reside and study as boarders at Lycee St. Alexandre Sauli Muhura, 
          fostering a vibrant and engaging environment that makes building new friendships effortless!
        </p>
      </div>

      <div className="container-fluid transform-section">
        <div className="row align-items-center">
          <div className="col-lg-6 p-0">
            <img
             src={studentsimg}
              alt="Educational research equipment"
              className="img-fluid transform-image"
            />
          </div>
          <div className="col-lg-6 transform-content">
            <h2 className="transform-title">Transforming Lives</h2>
            <div className="green-line"></div>
            <p className="transform-description">
              Our integrated research and educational platforms ensure that breakthroughs in the classroom 
              translate to student success in life. And our comprehensive academic ecosystem elevates 
              collaboration and creativity to benefit people across our institution and around the world.
            </p>
            <div className="transform-links">
              {links.map(({ text, path }) => (
                <a 
                  key={text}
                  href={path}
                  className="transform-link d-flex justify-content-between align-items-center"
                >
                  <span>{text}</span>
                  <span className="arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid numbers-section">
        <div className="row align-items-center">
          <div className="nav-dots">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" className="nav-dots-svg">
              <circle cx="20" cy="20" r="10" fill="#a8b6fa"/>
              <circle cx="50" cy="20" r="10" fill="#a8b6fa"/>
              <circle cx="80" cy="20" r="10" fill="#a8b6fa"/>
              <line x1="95" y1="20" x2="190" y2="20" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div className="col-lg-6 numbers-content">
            <div className="impact-subtitle">REAL IMPACTS</div>
            <h2 className="numbers-title">By the Numbers</h2>
            <div className="white-line"></div>
            
            <div className="statistics-grid">
              <div className="statistic-item">
                <div className="statistic-number">4</div>
                <div className="statistic-label">Academic Options</div>
              </div>
              
              <div className="statistic-item">
                <div className="statistic-number">96%</div>
                <div className="statistic-label">National Exam Pass Rate</div>
              </div>
              
              <div className="statistic-item">
                <div className="statistic-number">800+</div>
                <div className="statistic-label">Annual Student Enrollment</div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 p-0">
            <img
              src={studentsImage}
              alt="Students walking on school"
              className="img-fluid numbers-image"
            />
          </div>
        </div>
      </div>

      <div className="container-fluid transform-section">
        <div className="row align-items-center">
          <div className="col-lg-6 p-0">
            <img
              src={studentsImage}
              alt="Educational research equipment"
              className="img-fluid transform-image"
            />
          </div>
          <div className="col-lg-6 transform-content">
            <h2 className="transform-title">Transforming Lives</h2>
            <div className="green-line"></div>
            <p className="transform-description">
              Our integrated research and educational platforms ensure that breakthroughs in the classroom 
              translate to student success in life. And our comprehensive academic ecosystem elevates 
              collaboration and creativity to benefit people across our institution and around the world.
            </p>
            <div className="transform-links">
              {transformLinks.map(({ text, path }) => (
                <a 
                  key={text}
                  href={path}
                  className="transform-link d-flex justify-content-between align-items-center"
                >
                  <span>{text}</span>
                  <span className="arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      < VideoSection/>

      <NewsSection />
    </>
  );
};

export default HomepageContainer;