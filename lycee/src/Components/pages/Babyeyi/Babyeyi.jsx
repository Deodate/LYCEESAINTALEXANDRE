import React from 'react';
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';
import './Babyeyi.css';

function Babyeyi() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = BabyeyiFile;
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid">
      <div className="button-container mb-3 mt-3">
        <button 
         class="btn btn-primary btn-sm"
          onClick={handleDownload}
        >
          <i className="bi bi-download me-2"></i>
          Download File
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={handlePrint}
        >
          <i className="bi bi-printer me-2"></i>
          Print File
        </button>
      </div>
      <div className="pdf-container">
        <iframe
          src={`${BabyeyiFile}#toolbar=0&navpanes=0&scrollbar=0&bgcolor=ffffff`}
          className="pdf-viewer"
          title="PDF viewer"
          style={{backgroundColor: 'white'}}
        />
      </div>
    </div>
  );
}

export default Babyeyi;