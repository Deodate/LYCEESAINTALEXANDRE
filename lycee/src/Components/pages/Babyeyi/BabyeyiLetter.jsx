import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Printer, Download, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import LogoSchool from '../../../assets/images/LogoSchool.png';
import { getAuthToken as getStoredAuthToken, clearAuthToken } from '../../../utils/authSession';
import './Babyeyi.css';

const BabyeyiLetter = () => {
  const [content, setContent] = useState('');
  const [listType, setListType] = useState('none');
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState('12');
  const [textAlign, setTextAlign] = useState('left');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const insertList = (type) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let listElement;

        if (type === 'ul') {
          listElement = document.createElement('ul');
        } else if (type === 'ol') {
          listElement = document.createElement('ol');
        } else if (type === 'ol-roman') {
          listElement = document.createElement('ol');
          listElement.style.listStyleType = 'lower-roman';
        } else if (type === 'ol-alpha') {
          listElement = document.createElement('ol');
          listElement.style.listStyleType = 'lower-alpha';
        }

        // Create a list item
        const listItem = document.createElement('li');
        listItem.textContent = 'List item';

        listElement.appendChild(listItem);

        // Replace or insert the list
        range.deleteContents();
        range.insertNode(listElement);

        // Update content state
        setContent(editorRef.current.innerHTML);
        setListType(type);
      }
    }
  };

  const handleFontFamilyChange = (font) => {
    setFontFamily(font);
    if (editorRef.current) {
      document.execCommand('fontName', false, font);
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    if (editorRef.current) {
      document.execCommand('fontSize', false, size);
    }
  };

  const handleTextAlign = (align) => {
    setTextAlign(align);
    if (editorRef.current) {
      document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1), false, null);
    }
  };

  // Focus editor and set cursor position on component mount
  useEffect(() => {
    // Fetch latest content from database
    const fetchLatestContent = async () => {
      try {
        console.log('🔄 Fetching latest content from database...');
        console.log('📡 API URL: http://localhost:9090/api/babyeyi-pdf/latest');
        
        const response = await fetch('http://localhost:9090/api/babyeyi-pdf/latest');
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const result = await response.json();
          console.log('📄 Latest content response:', result);
          
          if (result.data && result.data.content) {
            console.log('✅ Latest content fetched successfully');
            console.log('📝 Content length:', result.data.content.length);
            console.log('📝 Content preview:', result.data.content.substring(0, 100) + '...');
            
            setContent(result.data.content);
            
            // Update the editor content directly
            if (editorRef.current) {
              editorRef.current.innerHTML = result.data.content;
              console.log('✏️ Editor content updated successfully');
            }
          } else {
            console.log('⚠️ No content found in database, using placeholder');
            setContent('');
            if (editorRef.current) {
              editorRef.current.innerHTML = '';
            }
          }
        } else {
          console.error('❌ Failed to fetch latest content, status:', response.status);
          console.error('❌ Response text:', await response.text());
          setContent('');
          if (editorRef.current) {
            editorRef.current.innerHTML = '';
          }
        }
      } catch (error) {
        console.error('💥 Error fetching latest content:', error);
        console.error('💥 Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setContent('');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      }
    };
    
    fetchLatestContent();
  }, []);
  
  // Sync editor content with state
  useEffect(() => {
    if (editorRef.current && content) {
      if (editorRef.current.innerHTML !== content) {
        console.log('🔄 Syncing editor content with state...');
        editorRef.current.innerHTML = content;
      }
    }
  }, [content]);

  // Check authentication and focus editor on component mount
  useEffect(() => {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.log('❌ User not authenticated, redirecting to login');
      alert('Please sign in to access the Babyeyi Letter Editor.');
      navigate('/signin');
      return;
    }
    
    console.log('✅ User authenticated, proceeding with editor setup');
    
    if (editorRef.current) {
      // Focus the editor only on initial mount
      editorRef.current.focus();
      
      // Set cursor to the beginning only on initial mount
      const range = document.createRange();
      const selection = window.getSelection();
      
      range.setStart(editorRef.current, 0);
      range.collapse(true);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [navigate]); // Only run on mount, not when content changes

  // Font families
  const fontFamilies = [
    'Times New Roman',
    'Arial',
    'Calibri',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Courier New',
    'Tahoma',
    'Trebuchet MS',
    'Comic Sans MS'
  ];

  // Font sizes
  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];

  // Toolbar configurations with manual list insertion
  const toolbarButtons = [
    {
      icon: Bold,
      command: () => document.execCommand('bold', false, null),
      title: 'Bold',
      className: "text-black"
    },
    {
      icon: Italic,
      command: () => document.execCommand('italic', false, null),
      title: 'Italic',
      className: "text-black"
    },
    {
      icon: Underline,
      command: () => document.execCommand('underline', false, null),
      title: 'Underline',
      className: "text-black"
    },
    {
      icon: List,
      command: () => insertList('ul'),
      title: 'Bullet List',
      className: "text-black"
    },
    {
      icon: ListOrdered,
      command: () => insertList('ol'),
      title: 'Numbered List',
      className: "text-black"
    }
  ];

  // Text alignment buttons
  const alignmentButtons = [
    {
      icon: AlignLeft,
      command: () => handleTextAlign('left'),
      title: 'Align Left',
      active: textAlign === 'left'
    },
    {
      icon: AlignCenter,
      command: () => handleTextAlign('center'),
      title: 'Align Center',
      active: textAlign === 'center'
    },
    {
      icon: AlignRight,
      command: () => handleTextAlign('right'),
      title: 'Align Right',
      active: textAlign === 'right'
    },
    {
      icon: AlignJustify,
      command: () => handleTextAlign('justify'),
      title: 'Justify',
      active: textAlign === 'justify'
    }
  ];

  // List style options
  const listStyles = [
    { name: 'Bullet', type: 'ul' },
    { name: 'Numbered', type: 'ol' },
    { name: 'Roman', type: 'ol-roman' },
    { name: 'Alphabetic', type: 'ol-alpha' }
  ];

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorClick = () => {
    if (editorRef.current) {
      // Ensure editor is focused when clicked
      editorRef.current.focus();
    }
  };

  const handleListStyleChange = (selectedStyle) => {
    const style = listStyles.find(s => s.name === selectedStyle);
    if (style) {
      insertList(style.type);
    }
  };

  // Helper function to check if user is properly authenticated
  const isUserAuthenticated = () => {
    const token = getStoredAuthToken();
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!token || isLoggedIn !== 'true') {
      return false;
    }
    
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Helper function to get valid authentication token
  const requireValidAccessToken = () => {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Validate token format
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Validate token expiration
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp <= currentTime) {
        throw new Error('Token has expired');
      }
    } catch (error) {
      throw new Error('Invalid token payload');
    }
    
    return token;
  };

  const handleSave = async () => {
    if (content.trim()) {
      try {
        console.log('Starting PDF generation process...');
        
        // Get and validate authentication token
        let token;
        try {
          token = requireValidAccessToken();
          console.log('🔍 Token validation successful:', { hasToken: !!token, tokenLength: token.length });
        } catch (authError) {
          console.error('❌ Authentication error:', authError.message);
          alert(`Authentication failed: ${authError.message}. Please sign in again.`);
          clearAuthToken();
          // Redirect to login page
          navigate('/signin');
          return;
        }
        
        // Always get the latest record to update
        console.log('Fetching latest record for update...');
        const latestResponse = await fetch('http://localhost:9090/api/babyeyi-pdf/latest');
        
        if (!latestResponse.ok) {
          throw new Error('Failed to fetch latest record');
        }
        
        const latestResult = await latestResponse.json();
        if (!latestResult.data || !latestResult.data.id) {
          throw new Error('No existing record found to update');
        }
        
        const latestRecordId = latestResult.data.id;
        console.log('Updating existing record with ID:', latestRecordId);

        // Create a temporary container with the content and header
        console.log('Creating temporary container for PDF generation...');
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '600px'; // Reduced width to avoid quota issues
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px'; // Reduced padding
        tempContainer.style.fontFamily = 'Arial, sans-serif';
        tempContainer.style.fontSize = '11px'; // Reduced font size
        tempContainer.style.lineHeight = '1.4';
        tempContainer.style.color = '#333';
        
        // Create simplified header without image to avoid quota issues
        console.log('Adding simplified header...');
        const headerHTML = `
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <!-- Left Section - School Info -->
              <div style="text-align: left; flex: 1;">
                <div style="font-size: 12px; font-weight: bold; color: #333;">LYCEE SAINT ALEXANDRE</div>
                <div style="font-size: 10px; color: #333;">SAULI DE MUHURA</div>
              </div>
              
              <!-- Center Section - School Information -->
              <div style="flex: 2; text-align: center; margin: 0 10px;">
                <h1 style="font-size: 12px; font-weight: bold; margin: 0; color: #333;">REPUBLIC OF RWANDA</h1>
                <h2 style="font-size: 10px; font-weight: bold; margin: 3px 0; color: #333;">MINISTRY OF EDUCATION</h2>
                <h3 style="font-size: 14px; font-weight: bold; margin: 3px 0; color: #333;">LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
                <p style="font-size: 8px; margin: 2px 0; color: #333;">ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
                <p style="font-size: 8px; margin: 2px 0; color: #333;">Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
              </div>
              
              <!-- Right Section - RTB Logo -->
              <div style="text-align: right; flex: 1;">
                <div style="width: 40px; height: 40px; border: 1px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                  <div style="font-size: 12px; font-weight: bold; color: #333;">RTB</div>
                </div>
                <div style="text-align: center; margin-top: 2px;">
                  <div style="font-size: 8px; font-weight: bold; color: #333;">RWANDA</div>
                  <div style="font-size: 8px; font-weight: bold; color: #333;">TVET BOARD</div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add the header and content
        tempContainer.innerHTML = headerHTML + content;
        
        // Append to body temporarily
        console.log('Appending temporary container to body...');
        document.body.appendChild(tempContainer);
        
        // Wait for content to render
        console.log('Waiting for content to render...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try html2canvas with reduced settings to avoid quota issues
        console.log('Starting html2canvas conversion with optimized settings...');
        let canvas;
        try {
          canvas = await html2canvas(tempContainer, {
            scale: 1, // Reduced scale to avoid quota issues
            useCORS: false, // Disable CORS to avoid issues
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 600, // Reduced width
            height: tempContainer.scrollHeight,
            logging: false, // Disable logging to reduce memory usage
            removeContainer: true, // Automatically remove container
            foreignObjectRendering: false, // Disable foreign object rendering
            imageTimeout: 5000 // Reduce image timeout
          });
        } catch (canvasError) {
          console.error('html2canvas failed, trying fallback method:', canvasError);
          
          // Fallback: Create PDF directly from text content without canvas
          console.log('Using fallback PDF generation method...');
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          // Set font and size
          pdf.setFont('helvetica');
          pdf.setFontSize(12);
          
          // Add header text
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text('REPUBLIC OF RWANDA', 105, 20, { align: 'center' });
          pdf.setFontSize(12);
          pdf.text('MINISTRY OF EDUCATION', 105, 30, { align: 'center' });
          pdf.setFontSize(16);
          pdf.text('LYCEE SAINT ALEXANDRE SAULI DE MUHURA', 105, 40, { align: 'center' });
          pdf.setFontSize(10);
          pdf.text('ESTERN - GATSIBO - MUHURA - TABA - KANYINYA', 105, 50, { align: 'center' });
          pdf.text('Phone: 0788862998 E-mail: lycemuhura@gmail.com', 105, 60, { align: 'center' });
          
          // Add content
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          
          // Convert HTML content to plain text for PDF
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content;
          const plainText = tempDiv.textContent || tempDiv.innerText || '';
          
          // Split text into lines and add to PDF
          const lines = pdf.splitTextToSize(plainText, 180); // 180mm width
          let yPosition = 80;
          
          for (let i = 0; i < lines.length; i++) {
            if (yPosition > 270) { // Check if we need a new page
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(lines[i], 15, yPosition);
            yPosition += 7;
          }
          
          // Convert PDF to data URL
          const pdfDataUrl = pdf.output('datauristring');
          console.log('Fallback PDF generated successfully, data URL length:', pdfDataUrl.length);
          
          // Store the PDF data URL in localStorage
          localStorage.setItem('babyeyiGeneratedPDF', pdfDataUrl);
          localStorage.setItem('babyeyiContent', content);
          
          // Update database
          await updateDatabase(latestRecordId, content, pdfDataUrl);
          
          setShowSuccessMessage(true);
          // Hide success message after 3 seconds
          setTimeout(() => setShowSuccessMessage(false), 3000);
          return;
        }
        
        console.log('Canvas generated successfully:', {
          width: canvas.width,
          height: canvas.height
        });
        
        // Remove temporary container
        document.body.removeChild(tempContainer);
        
        // Create PDF from canvas
        console.log('Creating PDF from canvas...');
        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with compression
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Convert PDF to data URL
        const pdfDataUrl = pdf.output('datauristring');
        console.log('PDF generated successfully, data URL length:', pdfDataUrl.length);
        
        // Store the PDF data URL in localStorage
        localStorage.setItem('babyeyiGeneratedPDF', pdfDataUrl);
        localStorage.setItem('babyeyiContent', content);
        
        // Update database
        try {
          await updateDatabase(latestRecordId, content, pdfDataUrl);
          console.log('✅ Database update successful');
          
          console.log('PDF generated and stored:', { 
            dataUrlLength: pdfDataUrl.length,
            contentLength: content.length 
          });
          
          setShowSuccessMessage(true);
          // Hide success message after 3 seconds
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (dbError) {
          console.error('❌ Database update failed:', dbError);
          // Don't show alert here as updateDatabase already handles it
          return;
        }
      } catch (error) {
        console.error('PDF generation error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        alert(`Failed to generate PDF: ${error.message}. Please try again.`);
      }
    } else {
      alert("Please enter some content before submitting.");
    }
  };

  // Helper function to update database
  const updateDatabase = async (latestRecordId, content, pdfDataUrl) => {
    try {
      // Get and validate authentication token
      const token = requireValidAccessToken();
      console.log('🔍 updateDatabase token validation successful:', { hasToken: !!token, tokenLength: token.length });
      
      console.log('Updating existing PDF record...', { 
        hasToken: !!token, 
        contentLength: content.length,
        pdfDataLength: pdfDataUrl.length,
        recordId: latestRecordId
      });
      
      const requestBody = {
        title: 'Babyeyi Letter',
        content: content,
        pdfData: pdfDataUrl,
        fileName: 'babyeyi_letter.pdf'
      };
      
      console.log('Request body prepared:', {
        title: requestBody.title,
        contentLength: requestBody.content.length,
        pdfDataLength: requestBody.pdfData.length,
        fileName: requestBody.fileName
      });
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      console.log('🔍 Request headers:', {
        'Content-Type': headers['Content-Type'],
        'Authorization': 'Bearer [TOKEN]'
      });
      
      // Debug: Log the actual token being sent (first 50 chars)
      console.log('🔍 Actual token being sent:', token.substring(0, 50) + '...');
      
      console.log('📡 Making PUT request to:', `http://localhost:9090/api/babyeyi-pdf/update/${latestRecordId}`);
      
      // Always use PUT to update existing record
      const response = await fetch(`http://localhost:9090/api/babyeyi-pdf/update/${latestRecordId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('✅ PDF updated successfully:', result);
        return result;
      } else if (response.status === 401) {
        // Handle authentication error
        const errorText = await response.text();
        console.error('❌ Authentication failed:', errorText);
        throw new Error('Authentication failed. Please sign in again.');
      } else if (response.status === 403) {
        // Handle forbidden error
        const errorText = await response.text();
        console.error('❌ Access forbidden:', errorText);
        throw new Error('Access denied. You do not have permission to update this content.');
      } else if (response.status === 404) {
        // Handle not found error
        const errorText = await response.text();
        console.error('❌ PDF not found:', errorText);
        throw new Error('PDF record not found. Please try creating a new one.');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to update PDF:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ updateDatabase error:', error);
      
      // Handle specific authentication errors
      if (error.message.includes('Authentication failed') || 
          error.message.includes('No authentication token found') ||
          error.message.includes('Invalid token')) {
        alert(error.message);
        clearAuthToken();
        navigate('/signin');
        return;
      }
      
      // Handle other errors
      alert(`Failed to update content: ${error.message}`);
      throw error;
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setContent('');
    }
  };

  const handlePrint = () => {
    if (editorRef.current && content.trim()) {
      try {
        const printWindow = window.open('', '', 'width=800,height=600');

        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
            <title>Babyeyi Letter - Print</title>
            <style>
              @media print {
                body { 
                  font-family: Arial, sans-serif; 
                  color: black; 
                  margin: 20px;
                  line-height: 1.6;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #333;
                  padding-bottom: 20px;
                }
                .content {
                  margin-top: 20px;
                }
                ol.roman { list-style-type: lower-roman; }
                ol.alpha { list-style-type: lower-alpha; }
                ul { list-style-type: disc; }
                ol { list-style-type: decimal; }
                h1, h2, h3 { margin-top: 20px; margin-bottom: 10px; }
                p { margin-bottom: 10px; }
              }
              @media screen {
                body { 
                  font-family: Arial, sans-serif; 
                  color: black; 
                  margin: 20px;
                  line-height: 1.6;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #333;
                  padding-bottom: 20px;
                }
                .content {
                  margin-top: 20px;
                }
                ol.roman { list-style-type: lower-roman; }
                ol.alpha { list-style-type: lower-alpha; }
                ul { list-style-type: disc; }
                ol { list-style-type: decimal; }
                h1, h2, h3 { margin-top: 20px; margin-bottom: 10px; }
                p { margin-bottom: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>REPUBLIC OF RWANDA</h1>
              <h2>MINISTRY OF EDUCATION</h2>
              <h3>LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
              <p>ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
              <p>Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
            </div>
            <div class="content">
              ${editorRef.current.innerHTML}
            </div>
          </body>
        </html>
      `);
        printWindow.document.close();

        // Wait for content to load before printing
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      } catch (error) {
        console.error('Print error:', error);
        alert('Failed to open print dialog. Please try again.');
      }
    } else {
      alert("Please enter some content before printing.");
    }
  };

  const handleDownloadPDF = async () => {
    if (editorRef.current && content.trim()) {
      try {
        console.log('Starting PDF download generation...');
        
        // Create a temporary container for PDF generation
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '600px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px';
        tempContainer.style.fontFamily = 'Arial, sans-serif';
        tempContainer.style.fontSize = '12px';
        tempContainer.style.lineHeight = '1.6';
        tempContainer.style.color = '#333';
        
        // Create header
        const headerHTML = `
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">REPUBLIC OF RWANDA</h1>
            <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 5px 0;">MINISTRY OF EDUCATION</h2>
            <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">LYCEE SAINT ALEXANDRE SAULI DE MUHURA</h3>
            <p style="font-size: 10px; margin: 2px 0;">ESTERN - GATSIBO - MUHURA - TABA - KANYINYA</p>
            <p style="font-size: 10px; margin: 2px 0;">Phone: 0788862998 E-mail: lycemuhura@gmail.com</p>
          </div>
        `;
        
        // Add header and content
        tempContainer.innerHTML = headerHTML + editorRef.current.innerHTML;
        
        // Append to body temporarily
        document.body.appendChild(tempContainer);
        
        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Generate PDF using html2canvas
          const canvas = await html2canvas(tempContainer, {
            scale: 1,
            useCORS: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 600,
            height: tempContainer.scrollHeight,
            logging: false,
            removeContainer: true,
            foreignObjectRendering: false,
            imageTimeout: 5000
          });
          
          // Remove temporary container
          document.body.removeChild(tempContainer);
          
          // Create PDF from canvas
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          let heightLeft = imgHeight;
          let position = 0;
          
          // Add first page
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // Add additional pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          // Save the PDF
          pdf.save('babyeyi_letter.pdf');
          console.log('PDF downloaded successfully');
          
        } catch (canvasError) {
          console.error('Canvas generation failed, using fallback method:', canvasError);
          
          // Remove temporary container
          document.body.removeChild(tempContainer);
          
          // Fallback: Create PDF with text content
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          // Add header
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text('REPUBLIC OF RWANDA', 105, 20, { align: 'center' });
          pdf.setFontSize(14);
          pdf.text('MINISTRY OF EDUCATION', 105, 30, { align: 'center' });
          pdf.setFontSize(18);
          pdf.text('LYCEE SAINT ALEXANDRE SAULI DE MUHURA', 105, 40, { align: 'center' });
          pdf.setFontSize(10);
          pdf.text('ESTERN - GATSIBO - MUHURA - TABA - KANYINYA', 105, 50, { align: 'center' });
          pdf.text('Phone: 0788862998 E-mail: lycemuhura@gmail.com', 105, 60, { align: 'center' });
          
          // Add content
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          
          const textContent = editorRef.current.innerText || editorRef.current.textContent;
          const lines = pdf.splitTextToSize(textContent, 180);
          let yPosition = 80;
          
          for (let i = 0; i < lines.length; i++) {
            if (yPosition > 270) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(lines[i], 15, yPosition);
            yPosition += 7;
          }
          
          pdf.save('babyeyi_letter.pdf');
          console.log('PDF downloaded successfully (fallback method)');
        }
        
      } catch (error) {
        console.error('PDF generation error:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    } else {
      alert("Please enter some content before downloading PDF.");
    }
  };

  return (
    <div className="babyeyi-editor-container">
      <h2 className="babyeyi-title">Babyeyi Letter Editor</h2>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Babyeyi letter updated Successfully!
        </div>
      )}

      {/* MS Word Style Toolbar */}
      <div className="babyeyi-toolbar">
        {/* Font Family Dropdown */}
        <div className="toolbar-section">
          <label className="toolbar-label">Font:</label>
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="toolbar-dropdown"
          >
            {fontFamilies.map((font, index) => (
              <option key={index} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Dropdown */}
        <div className="toolbar-section">
          <label className="toolbar-label">Size:</label>
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="toolbar-dropdown"
          >
            {fontSizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Text Formatting Buttons */}
        <div className="toolbar-section">
          <div className="toolbar-buttons">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.command}
                className="toolbar-button"
                title={button.title}
              >
                <button.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Text Alignment Buttons */}
        <div className="toolbar-section">
          <div className="toolbar-buttons">
            {alignmentButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.command}
                className={`toolbar-button ${button.active ? 'active' : ''}`}
                title={button.title}
              >
                <button.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* List Style Dropdown */}
        <div className="toolbar-section">
          <select
            onChange={(e) => handleListStyleChange(e.target.value)}
            className="toolbar-dropdown"
          >
            <option value="">List Style</option>
            {listStyles.map((style, index) => (
              <option key={index} value={style.name}>
                {style.name} List
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor with MS Word Style Spacing */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleContentChange}
        onClick={handleEditorClick}
        className="babyeyi-editor"
        placeholder="Enter your letter content here..."
        suppressContentEditableWarning={true}
        style={{
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          textAlign: textAlign
        }}
      ></div>

      {/* Action Buttons */}
      <div className="babyeyi-actions">
        <button className="action-button btn-download" onClick={handleDownloadPDF}>
          <Download size={18} />
          Download PDF
        </button>
        <button className="action-button btn-print" onClick={handlePrint}>
          <Printer size={18} />
          Prints
        </button>
        <button className="action-button btn-clear" onClick={handleClear}>
          Clear
        </button>
        <button className="action-button btn-submit" onClick={handleSave}>
          Update Content
        </button>
      </div>
    </div>
  );
};

export default BabyeyiLetter;
