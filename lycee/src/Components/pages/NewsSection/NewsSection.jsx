import React from 'react';
import studentsImage from '../../../assets/images/students.jpeg';

const NewsSection = () => {
  const newsItems = [
    {
      category: 'Academic Excellence',
      date: 'Dec 20, 2024',
      title: 'LSASM Students Excel in National Science Competition',
      image: studentsImage,
      link: '/news/science-competition'
    },
    {
      category: 'School Life',
      date: 'Dec 20, 2024',
      title: 'Annual Cultural Festival Showcases Student Talents',
      image: studentsImage,
      link: '/news/cultural-festival'
    },
    {
      category: 'Community',
      date: 'Dec 19, 2024',
      title: 'LSASM Launches New Community Outreach Program',
      image: studentsImage,
      link: '/news/community-outreach'
    }
  ];

  return (
    <div className="container-fluid news-section py-5">
      <div className="row">
        {/* Left Column - Header */}
        <div className="col-lg-3">
          <h2 className="news-title mb-4">Latest News</h2>
          <div className="green-line"></div>
          <p className="news-description mb-4">
            Stay informed about the latest happenings at LSASM. From academic achievements to exciting campus events, we capture it all.
          </p>
          <a href="/news" className="btn btn-primary">
            More News →
          </a>
        </div>

        {/* Right Column - News Grid */}
        <div className="col-lg-9">
          <div className="row">
            {newsItems.map((item, index) => (
              <div key={index} className="col-md-4 mb-4">
                <a href={item.link} className="news-card text-decoration-none">
                  <div className="news-image-wrapper mb-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="img-fluid w-100 rounded"
                    />
                  </div>
                  <div className="news-content">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <span className="news-category">{item.category}</span>
                      <span className="mx-2">•</span>
                      <span className="news-date">{item.date}</span>
                    </div>
                    <h3 className="news-card-title h5">
                      {item.title}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;