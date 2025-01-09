import React from 'react';
import './Inspiration.css';
import PopeImage from '../../../assets/images/popeFrancis.webp';

const Inspiration = () => {
  return (
    <div className="inspiration-container">
      <div className="content-wrapper">
        <div className="image-section">
          <img src={PopeImage} alt="Saint Alexandre Sauli" />
          <p className="from-pope-francis">--- Pope Francis in 2021</p>
        </div>
        <div className="text-section">
          <h1>Education: A Path to Loving Life</h1>
          <p className="inspiration-text">
          " If something is true, it is good and beautiful; 
          if it is beautiful; it is good and true; 
          if it is good, it is true and it is beautiful. 
          And together, these elements enable us to grow and help 
          us to love life, even when we are not well, even in the 
          midst of many problems. True education enables us to love life
           and opens us to the fullness of life. "
          </p>
          <p className="from-pope-francis">--- Pope Francis</p>
        </div>
      </div>
    </div>
  );
};

export default Inspiration;