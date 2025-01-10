import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Babyeyi() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Document
        file={BabyeyiFile} // Using the imported PDF file directly
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        <Page 
          pageNumber={pageNumber} 
          width={800}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {numPages && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            style={{ padding: '8px 16px', margin: '0 8px', backgroundColor: '#4F46E5', color: 'white', borderRadius: '4px', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            style={{ padding: '8px 16px', margin: '0 8px', backgroundColor: '#4F46E5', color: 'white', borderRadius: '4px', cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Babyeyi;