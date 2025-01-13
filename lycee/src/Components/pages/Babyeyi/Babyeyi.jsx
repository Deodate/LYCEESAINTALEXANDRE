import React from 'react';
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';
import './Babyeyi.css';

function Babyeyi() {
  return (
    <div className="pdf-container">
      <iframe
        src={`${BabyeyiFile}#toolbar=0&navpanes=0&scrollbar=0`}
        className="pdf-viewer"
        title="PDF viewer"
      />
      <p>hd</p>
    </div>
  );
}

export default Babyeyi;