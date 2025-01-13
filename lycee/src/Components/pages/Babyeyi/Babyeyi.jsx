import React from 'react';
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';
import './Babyeyi.css';

function Babyeyi() {
  const handlePrint = () => {
    const printContent = document.getElementById('pdf-frame');
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print PDF</title>
        </head>
        <body>
          <iframe
            src="${BabyeyiFile}"
            style="width:100%; height:100vh; border:none;"
            frameborder="0"
          ></iframe>
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = BabyeyiFile;
    link.download = 'babyeyi.pdf';
    document.body.appendChild(link);      
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid">
      <div className="button-container mb-3 mt-3 no-print">
        <p>Babyeyi letter for academics year 2025 II TERM</p>
        <button 
          className="btn btn-primary btn-sm"
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
      <div className="pdf-container print-only">
        <iframe
          id="pdf-frame"
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