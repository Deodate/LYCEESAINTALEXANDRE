import React from 'react';
import './NewsEvents.css';

const NewsEvents = () => {
  const newsData = {
    featured: {
      title: "Winter woes: Understanding seasonal affective disorder",
      image: "/api/placeholder/1200/600"
    },
    sections: [
      {
        title: "CAMPUS & COMMUNITY",
        articles: [
          {
            title: "UAB soars into top 6 percent of global universities in US News rankings",
            subtitle: "UAB's impact across the state during 2024 — and what's next for 2025",
            image: "/api/placeholder/400/300",
            links: ["Three reasons to complete a FAFSA form"]
          }
        ]
      },
      {
        title: "ARTS & EVENTS",
        articles: [
          {
            title: "See these artists coming to UAB's Alys Stephens Center in 2025",
            subtitle: "Works by Alex Chitty, Kate Meissner, plus Juried Student Exhibition, at UAB's AEIVA from Jan. 21-March 15",
            image: "/api/placeholder/400/300",
            links: ["A winter wonderland on UAB's campus"]
          }
        ]
      },
      {
        title: "HEALTH & MEDICINE",
        articles: [
          {
            title: "UAB opens seven specialty clinics at UAB Medical West, accepting new patients",
            subtitle: "Meet Topgun: UAB Spain Rehabilitation Center's first-ever facility dog",
            image: "/api/placeholder/400/300",
            links: ["UAB named OHF Care Center for excellence in rare kidney stone disease research and clinical care"]
          }
        ]
      }
    ]
  };

  return (
    <div className="news-events-container">
      {/* Featured Article */}
      <div className="featured-article">
        <img src={newsData.featured.image} alt="Featured article" className="featured-image" />
        <h2 className="featured-title">{newsData.featured.title}</h2>
      </div>

      {/* News Sections */}
      <div className="news-sections">
        {newsData.sections.map((section, index) => (
          <div key={index} className="news-section">
            <h3 className="section-title">{section.title}</h3>
            {section.articles.map((article, articleIndex) => (
              <div key={articleIndex} className="article-card">
                <img src={article.image} alt={article.title} className="article-image" />
                <div className="article-content">
                  <h4 className="article-title">{article.title}</h4>
                  <p className="article-subtitle">{article.subtitle}</p>
                  <ul className="article-links">
                    {article.links.map((link, linkIndex) => (
                      <li key={linkIndex}>{link}</li>
                    ))}
                  </ul>
                </div>
                <button className="more-stories">
                  MORE {section.title} STORIES
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Expert Categories */}
      <div className="expert-categories">
        <h3 className="experts-title">UAB Experts</h3>
        <div className="category-buttons">
          <button>ARTS</button>
          <button>CAMPUS</button>
          <button>HEALTH & MEDICINE</button>
          <button>PEOPLE OF UAB</button>
          <button>RESEARCH</button>
          <button>NEWS YOU CAN USE</button>
        </div>
      </div>
    </div>
  );
};

export default NewsEvents;