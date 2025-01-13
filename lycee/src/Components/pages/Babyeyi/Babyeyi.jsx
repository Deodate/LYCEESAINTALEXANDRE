import React from 'react';
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';
import './Babyeyi.css';

function Babyeyi() {
  return (
    <div className="pdf-container">
      <embed 
        src={BabyeyiFile}
        type="application/pdf"
        className="pdf-viewer"
        alt="pdf"
      />
    </div>
  );
}

export default Babyeyi;