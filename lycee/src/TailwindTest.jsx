import React from 'react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-6 text-center">
            TailwindCSS is Working! 🎉
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
              <h3 className="text-xl font-semibold text-primary-700 mb-3">Primary Colors</h3>
              <p className="text-primary-600">This card uses primary color variants</p>
            </div>
            
            <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
              <h3 className="text-xl font-semibold text-secondary-700 mb-3">Secondary Colors</h3>
              <p className="text-secondary-600">This card uses secondary color variants</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Gray Colors</h3>
              <p className="text-gray-600">This card uses default gray colors</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mr-4">
              Primary Button
            </button>
            <button className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Secondary Button
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-center">
              ✅ TailwindCSS is successfully configured and working!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
