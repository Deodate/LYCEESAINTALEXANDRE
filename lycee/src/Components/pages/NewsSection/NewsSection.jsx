import React from 'react';

const NewsSection = () => {
  const newsItems = [
    {
      category: 'Academic Excellence',
      date: 'Dec 20, 2024',
      title: 'LSASM Students Excel in National Science Competition',
      image: '/api/placeholder/400/320',
      link: '#'
    },
    {
      category: 'School Life',
      date: 'Dec 20, 2024',
      title: 'Annual Cultural Festival Showcases Student Talents',
      image: '/api/placeholder/400/320',
      link: '#'
    },
    {
      category: 'Community',
      date: 'Dec 19, 2024',
      title: 'LSASM Launches New Community Outreach Program',
      image: '/api/placeholder/400/320',
      link: '#'
    }
  ];

  return (
    <div className="container-fluid py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column - Header */}
          <div className="md:w-1/4">
            <h2 className="text-4xl font-bold mb-4">Latest News</h2>
            <p className="text-gray-600 mb-6">
              Stay informed about the latest happenings at LSASM. From academic achievements to exciting campus events, we capture it all.
            </p>
            <a href="#" className="inline-flex items-center bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition-colors">
              More News →
            </a>
          </div>

          {/* Right Column - News Grid */}
          <div className="md:w-3/4 grid md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <a key={index} href={item.link} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold group-hover:text-green-700 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;