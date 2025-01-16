import React, { useEffect, useState } from 'react';
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';
import './Babyeyi.css';

function Babyeyi() {
  const [isMobile, setIsMobile] = useState(false);

  // Add responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrint = () => {
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print PDF</title>
          <style>
            body { 
              margin: 0;
              padding: 0;
              background-color: white;
            }
            iframe {
              background-color: white;
              width: 100%;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <iframe
            src="${BabyeyiFile}"
            style="width:100%; height:100vh; border:none; background-color: white;"
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
    <div className="container-fluid p-0">
      <div className="button-container mb-3 mt-3 no-print">
      <p 
          style={{
            fontFamily: 'Times New Roman',
            fontSize: '14px',
            width: '27%',
            color: 'black',
            backgroundColor: 'yellow',
            padding: '10px',
            margin: '0',
            display: 'inline-block',
            position: 'relative' 
          }}
        >
          Babyeyi letter for academics year <b>2025  TERM II</b> 
          <i className="bi bi-bell-fill" style={{ 
   marginLeft: '8px',
   fontSize: '16px',
   color: '#dc3545',  
   verticalAlign: 'middle'
 }}></i>
        </p>
        <button
          className="btn btn-primary"
          onClick={handleDownload}
        >
          <i className="bi bi-download me-2"></i>
          Download File
        </button>
        <button
          className="btn btn-secondary"
          onClick={handlePrint}
        >
          <i className="bi bi-printer me-2"></i>
          Print File
        </button>
      </div>
      <div className="pdf-container print-only">
        <iframe
          id="pdf-frame"
          src={`${BabyeyiFile}#toolbar=0&navpanes=0&scrollbar=0&bgcolor=ffffff&view=FitH`}
          className="pdf-viewer"
          title="PDF viewer"
          style={{
            backgroundColor: 'white',
            display: 'block',
            margin: '0 auto',
            width: isMobile ? '100%' : '95%'
          }}
        />
      </div>
    </div>
  );
}

export default Babyeyi;