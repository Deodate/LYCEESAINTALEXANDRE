import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import LogoSchool from '../../../assets/images/LogoSchool.png';
import './Babyeyi.css';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const Babyeyi = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [content, setContent] = useState('');
  const [showAsText, setShowAsText] = useState(true);

  // Fetch latest PDF from API
  useEffect(() => {
    const fetchLatestPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching latest PDF from API...');
        
        // First, try to get the latest PDF metadata to get the content
        const metadataResponse = await fetch('http://localhost:9090/api/babyeyi-pdf/latest');
        if (metadataResponse.ok) {
          const metadataResult = await metadataResponse.json();
          console.log('📄 Full metadata response:', metadataResult);
          if (metadataResult.data && metadataResult.data.content) {
            console.log('✅ Content fetched successfully:', metadataResult.data.content.substring(0, 100) + '...');
            // Add the header to the content from database
            const headerContent = `
              <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <!-- Left Section - School Logo -->
                  <div style="text-align: left; flex: 1;">
                    <div style="width: 120px; height: 120px; border: 3px solid #333; border-radius: 50%; position: relative; margin: 0 auto;">
                      <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); font-size: 8px; font-weight: bold; color: #333;">
                        LYCEE SAINT ALEXANDRE SAULI DE MUHURA
                      </div>
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; font-weight: bold; color: #333;">Y</div>
                      <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 6px; font-weight: bold; color: #333;">
                        INNOVATE TOGETHER FOR SUCCESS
                      </div>
                    </div>
                  </div>
                  
                  <!-- Center Section - School Information -->
                  <div style="flex: 2; text-align: center;">
                    <h1 style="font-size: 14px; font-weight: bold; margin: 0; color: #333;">REPUBLIC OF RWANDA</h1>
                    <h2 style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #333;">MINISTRY OF EDUCATION</h2>
                    <h3 style="font-size: 16px; font-weight: bold; margin: 5px 0; color: #333;">LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
                    <p style="font-size: 10px; margin: 5px 0; color: #333;">ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
                    <p style="font-size: 10px; margin: 5px 0; color: #333;">Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
                  </div>
                  
                  <!-- Right Section - RTB Logo -->
                  <div style="text-align: right; flex: 1;">
                    <div style="width: 80px; height: 80px; border: 2px solid #333; border-radius: 50%; position: relative; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                      <div style="font-size: 24px; font-weight: bold; color: #333;">RTB</div>
                    </div>
                    <div style="text-align: center; margin-top: 5px;">
                      <div style="font-size: 10px; font-weight: bold; color: #333;">RWANDA</div>
                      <div style="font-size: 10px; font-weight: bold; color: #333;">TVET BOARD</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            setContent(headerContent + metadataResult.data.content);
            setShowAsText(true); // Ensure text view is active
          } else {
            console.log('⚠️ No content in metadata, setting fallback content');
            // Set fallback content if none is available
            setContent(`
              <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: nowrap; min-height: 120px;">
                  <!-- Left Section - School Logo -->
                  <div style="text-align: left; flex: 1; min-width: 120px; display: flex; justify-content: center;">
                    <img 
                      src="${LogoSchool}" 
                      alt="Lycee Saint Alexandre Sauli de Muhura Logo" 
                      style="width: 120px; height: 120px; object-fit: contain;"
                    />
                  </div>
                  
                  <!-- Center Section - School Information -->
                  <div style="flex: 2; text-align: center; margin: 0 20px;">
                    <h1 style="font-size: 14px; font-weight: bold; margin: 0; color: #333;">REPUBLIC OF RWANDA</h1>
                    <h2 style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #333;">MINISTRY OF EDUCATION</h2>
                    <h3 style="font-size: 16px; font-weight: bold; margin: 5px 0; color: #333;">LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
                    <p style="font-size: 10px; margin: 5px 0; color: #333;">ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
                    <p style="font-size: 10px; margin: 5px 0; color: #333;">Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
                  </div>
                  
                  <!-- Right Section - RTB Logo -->
                  <div style="text-align: right; flex: 1; min-width: 80px; display: flex; justify-content: center;">
                    <div style="width: 80px; height: 80px; border: 2px solid #333; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center;">
                      <div style="font-size: 24px; font-weight: bold; color: #333;">RTB</div>
                    </div>
                    <div style="text-align: center; margin-top: 5px;">
                      <div style="font-size: 10px; font-weight: bold; color: #333;">RWANDA</div>
                      <div style="font-size: 10px; font-weight: bold; color: #333;">TVET BOARD</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2C3E50;">AS IS PROCESS MODEL</h1>
              <h2 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; color: #34495E;">Introduction</h2>
              <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">The Lycée Saint Alexandre Sauli de Muhura is a public secondary school with strong international ties, particularly to Italian founders who provide significant funding and support. This partnership creates both opportunities and challenges in communication, transparency, and accountability.</p>
              <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">A Smart School Hub with AI Integration serves as a solution to bridge geographical distances and cultural differences. This web application aims to showcase the school's achievements, needs, and daily operations to stakeholders in Rwanda and abroad, serving as a vital communication channel for transparency, real-time updates, and strengthening connections between the school community and its Italian benefactors.</p>
              <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">This project aims to leverage modern technology to enhance the school's operational efficiency. It creates a digital window for international supporters to witness the impact of their investments. By implementing AI-powered features such as multilingual support, intelligent data visualization, and automated reporting, we reduce communication barriers and provide comprehensive insights into the school's progress.</p>
            `);
            setShowAsText(true);
          }
        } else {
          console.log('⚠️ Failed to fetch metadata, setting fallback content');
          setContent(`
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: nowrap; min-height: 120px;">
                <!-- Left Section - School Logo -->
                <div style="text-align: left; flex: 1; min-width: 120px; display: flex; justify-content: center;">
                  <img 
                    src="${LogoSchool}" 
                    alt="Lycee Saint Alexandre Sauli de Muhura Logo" 
                    style="width: 120px; height: 120px; object-fit: contain;"
                  />
                </div>
                
                <!-- Center Section - School Information -->
                <div style="flex: 2; text-align: center; margin: 0 20px;">
                  <h1 style="font-size: 14px; font-weight: bold; margin: 0; color: #333;">REPUBLIC OF RWANDA</h1>
                  <h2 style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #333;">MINISTRY OF EDUCATION</h2>
                  <h3 style="font-size: 16px; font-weight: bold; margin: 5px 0; color: #333;">LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
                  <p style="font-size: 10px; margin: 5px 0; color: #333;">ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
                  <p style="font-size: 10px; margin: 5px 0; color: #333;">Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
                </div>
                
                <!-- Right Section - RTB Logo -->
                <div style="text-align: right; flex: 1; min-width: 80px; display: flex; justify-content: center;">
                  <div style="width: 80px; height: 80px; border: 2px solid #333; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #333;">RTB</div>
                  </div>
                  <div style="text-align: center; margin-top: 5px;">
                    <div style="font-size: 10px; font-weight: bold; color: #333;">RWANDA</div>
                    <div style="font-size: 10px; font-weight: bold; color: #333;">TVET BOARD</div>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2C3E50;">AS IS PROCESS MODEL</h1>
            <h2 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; color: #34495E;">Introduction</h2>
            <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">The Lycée Saint Alexandre Sauli de Muhura is a public secondary school with strong international ties, particularly to Italian founders who provide significant funding and support. This partnership creates both opportunities and challenges in communication, transparency, and accountability.</p>
            <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">A Smart School Hub with AI Integration serves as a solution to bridge geographical distances and cultural differences. This web application aims to showcase the school's achievements, needs, and daily operations to stakeholders in Rwanda and abroad, serving as a vital communication channel for transparency, real-time updates, and strengthening connections between the school community and its Italian benefactors.</p>
            <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">This project aims to leverage modern technology to enhance the school's operational efficiency. It creates a digital window for international supporters to witness the impact of their investments. By implementing AI-powered features such as multilingual support, intelligent data visualization, and automated reporting, we reduce communication barriers and provide comprehensive insights into the school's progress.</p>
          `);
          setShowAsText(true);
        }
        
        // Then, try to get the PDF data for download
        const response = await fetch('http://localhost:9090/api/babyeyi-pdf/latest/download');
        
        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);
          
          if (result.data && result.data.startsWith('data:application/pdf')) {
            console.log('✅ Latest PDF fetched successfully from API');
            
            // Clean the data URL to remove filename parameter which can cause issues
            let cleanPdfData = result.data;
            if (cleanPdfData.includes('filename=')) {
              cleanPdfData = cleanPdfData.replace(/;filename=[^;]+/, '');
              console.log('🧹 Cleaned PDF data URL (removed filename parameter)');
            }
            
            // Use the cleaned data URL directly - more reliable for react-pdf
            console.log('📄 Using cleaned data URL for PDF');
            setPdfFile(cleanPdfData);
            localStorage.setItem('babyeyiGeneratedPDF', cleanPdfData);
          } else {
            console.log('No PDF found in database, using sample PDF');
            setPdfFile('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
          }
        } else {
          console.log('API request failed, checking localStorage...');
          // Fallback to localStorage
          const generatedPDF = localStorage.getItem('babyeyiGeneratedPDF');
          if (generatedPDF) {
            console.log('Using PDF from localStorage');
            setPdfFile(generatedPDF);
          } else {
            console.log('No PDF in localStorage, using sample PDF');
            setPdfFile('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching PDF from API:', error);
        // Fallback to localStorage
        const generatedPDF = localStorage.getItem('babyeyiGeneratedPDF');
        if (generatedPDF) {
          console.log('Using PDF from localStorage as fallback');
          setPdfFile(generatedPDF);
        } else {
          console.log('Using sample PDF as fallback');
          setPdfFile('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPdf();
  }, []);


  
  console.log('PDF File to load:', { 
    pdfFile: pdfFile ? pdfFile.substring(0, 100) + '...' : 'null', 
    isDataUrl: pdfFile ? pdfFile.startsWith('data:') : false
  });

  useEffect(() => {
    console.log('📄 PDF File state changed:', { 
      hasPdfFile: !!pdfFile, 
      isDataUrl: pdfFile ? pdfFile.startsWith('data:') : false,
      length: pdfFile ? pdfFile.length : 0
    });
    
    if (pdfFile) {
      setLoading(true);
      setError(null);
    }
  }, [pdfFile]);

  // Ensure content is always displayed
  useEffect(() => {
    if (!content) {
      console.log('Setting fallback content since no content is available');
      setContent(`
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <!-- Left Section - School Logo -->
            <div style="text-align: left; flex: 1;">
              <div style="width: 120px; height: 120px; border: 3px solid #333; border-radius: 50%; position: relative; margin: 0 auto;">
                <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); font-size: 8px; font-weight: bold; color: #333;">
                  LYCEE SAINT ALEXANDRE SAULI DE MUHURA
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; font-weight: bold; color: #333;">Y</div>
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 6px; font-weight: bold; color: #333;">
                  INNOVATE TOGETHER FOR SUCCESS
                </div>
              </div>
            </div>
            
            <!-- Center Section - School Information -->
            <div style="flex: 2; text-align: center;">
              <h1 style="font-size: 14px; font-weight: bold; margin: 0; color: #333;">REPUBLIC OF RWANDA</h1>
              <h2 style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #333;">MINISTRY OF EDUCATION</h2>
              <h3 style="font-size: 16px; font-weight: bold; margin: 5px 0; color: #333;">LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
              <p style="font-size: 10px; margin: 5px 0; color: #333;">ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
              <p style="font-size: 10px; margin: 5px 0; color: #333;">Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
            </div>
            
            <!-- Right Section - RTB Logo -->
            <div style="text-align: right; flex: 1;">
              <div style="width: 80px; height: 80px; border: 2px solid #333; border-radius: 50%; position: relative; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 24px; font-weight: bold; color: #333;">RTB</div>
              </div>
              <div style="text-align: center; margin-top: 5px;">
                <div style="font-size: 10px; font-weight: bold; color: #333;">RWANDA</div>
                <div style="font-size: 10px; font-weight: bold; color: #333;">TVET BOARD</div>
              </div>
            </div>
          </div>
        </div>
        
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2C3E50;">AS IS PROCESS MODEL</h1>
        <h2 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 30px; color: #34495E;">Introduction</h2>
        <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">The Lycée Saint Alexandre Sauli de Muhura is a public secondary school with strong international ties, particularly to Italian founders who provide significant funding and support. This partnership creates both opportunities and challenges in communication, transparency, and accountability.</p>
        <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">A Smart School Hub with AI Integration serves as a solution to bridge geographical distances and cultural differences. This web application aims to showcase the school's achievements, needs, and daily operations to stakeholders in Rwanda and abroad, serving as a vital communication channel for transparency, real-time updates, and strengthening connections between the school community and its Italian benefactors.</p>
        <p style="margin-bottom: 20px; line-height: 1.8; color: #2C3E50;">This project aims to leverage modern technology to enhance the school's operational efficiency. It creates a digital window for international supporters to witness the impact of their investments. By implementing AI-powered features such as multilingual support, intelligent data visualization, and automated reporting, we reduce communication barriers and provide comprehensive insights into the school's progress.</p>
      `);
      setShowAsText(true);
    }
  }, [content]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any remaining data
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('✅ PDF loaded successfully:', { numPages, pdfFile: pdfFile ? pdfFile.substring(0, 100) + '...' : 'null' });
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error, { pdfFile });
    if (pdfFile && pdfFile.startsWith('data:')) {
      setError('Failed to load generated PDF. Please try submitting again from the editor.');
    } else {
      setError('Failed to load PDF. Please check your internet connection and try again.');
    }
    setLoading(false);
  };

  const clearGeneratedPDF = () => {
    localStorage.removeItem('babyeyiGeneratedPDF');
    localStorage.removeItem('babyeyiContent');
    setPdfFile('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
    setContent('');
  };

  const downloadPDF = async () => {
    if (content) {
      try {
        // Create a temporary container with the content
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '40px';
        tempContainer.style.fontFamily = 'Arial, sans-serif';
        tempContainer.style.fontSize = '12px';
        tempContainer.style.lineHeight = '1.6';
        tempContainer.style.color = '#333';
        
        // Add the content with header
        tempContainer.innerHTML = content;
        
        // Append to body temporarily
        document.body.appendChild(tempContainer);
        
        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Capture the content as canvas
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 800,
          height: tempContainer.scrollHeight
        });
        
        // Remove temporary container
        document.body.removeChild(tempContainer);
        
        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save('babyeyi_letter.pdf');
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    } else {
      alert('No content available to download.');
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
    </div>
  );

  return (
    <div className="pdf-container">
      <div className="pdf-viewer">

        <div className="p-4 bg-gray-50 min-h-[600px] max-w-6xl mx-auto md:mx-auto" style={{ 
          borderLeft: '2px solid black', 
          borderRight: '2px solid black', 
          marginLeft: '100px'
        }}>
          {/* Yellow Banner with Centered Content */}
          <div style={{ backgroundColor: '#FDD835' }} className="p-4 mb-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 flex-wrap justify-center">
                <span className="text-black font-medium text-lg text-center">Babyeyi letter for academics year 2025 TERM II</span>
                <span className="text-red-500 text-lg">🔔</span>
              </div>
              <div className="flex space-x-3 flex-wrap justify-center">
        <button
                  onClick={downloadPDF}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition flex items-center space-x-1"
                  style={{ backgroundColor: '#1976D2' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L7 11H10V4H14V11H17L12 16Z" fill="currentColor"/>
                    <path d="M20 18H4V20H20V18Z" fill="currentColor"/>
                  </svg>
                  <span>Download File</span>
        </button>
        <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition flex items-center space-x-1"
                  style={{ backgroundColor: '#757575' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 8H5C3.34 8 2 9.34 2 11V17H6V21H18V17H22V11C22 9.34 20.66 8 19 8ZM16 19H8V14H16V19ZM19 12C18.45 12 18 11.55 18 11S18.45 10 19 10 20 10.45 20 11 19.55 12 19 12Z" fill="currentColor"/>
                    <path d="M14 3H10C9.45 3 9 3.45 9 4S9.45 5 10 5H14C14.55 5 15 4.55 15 4S14.55 3 14 3Z" fill="currentColor"/>
                  </svg>
                  <span>Print File</span>
        </button>
      </div>
            </div>
          </div>

          {error ? (
            <div className="text-red-500 p-4 flex items-center" role="alert">
              <span className="font-medium">{error}</span>
            </div>
          ) : !content && !pdfFile ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <LoadingSpinner />
              <p className="text-gray-500">Loading content from database...</p>
            </div>
          ) : showAsText && content ? (
            <div className="w-full">
              <div className="bg-white" style={{ marginBottom: '80px' }}>
                {/* Content area with full page view */}
                <div className="p-4 md:p-8">
                  <div 
                    className="prose prose-lg max-w-none text-justify leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
          style={{
                      fontSize: '14px',
                      lineHeight: '1.8',
                      color: '#2C3E50',
                      fontFamily: 'Georgia, serif',
                      '@media (min-width: 768px)': {
                        fontSize: '16px'
                      }
                    }}
                  />
                  
                  {/* Date at bottom right */}
                  <div className="mt-8 text-right text-black font-medium">
                    {new Date().toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
                                  ) : (
              <div className="w-full">
                <div className="bg-white" style={{ marginBottom: '80px' }}>
                  {/* Framed PDF Area */}
                  <div className="p-6">
                    <div className="border-2 border-black bg-white min-h-[600px] relative flex justify-center items-start p-4">
                      <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<LoadingSpinner />}
                        options={{
                          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/cmaps/',
                          cMapPacked: true,
                        }}
                      >
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="shadow-lg"
                            loading={<LoadingSpinner />}
                          />
                        )}
                      </Document>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Babyeyi;