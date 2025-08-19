import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Printer, Download, Undo, Redo } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const BabyeyiLetter = () => {
  const [content, setContent] = useState('');
  const [listType, setListType] = useState('none');
  const editorRef = useRef(null);

  const insertList = (type) => {
    if (editorRef.current) {
      const selection = window.getSelection();
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
  };

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

  const handleListStyleChange = (selectedStyle) => {
    const style = listStyles.find(s => s.name === selectedStyle);
    if (style) {
      insertList(style.type);
    }
  };

  const handleSave = () => {
    if (content.trim()) {
      console.log("Saved Content:", content);
      alert("Letter content saved successfully!");
    } else {
      alert("Please enter some content before saving.");
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setContent('');
    }
  };

  const handlePrint = () => {
    if (editorRef.current) {
      const printWindow = window.open('', '', 'width=600,height=600');

      printWindow.document.open();
      printWindow.document.write(`
                <html>
                    <head>
                        <title>Printed Document</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                color: black; 
                                margin: 20px;
                            }
                            ol.roman { list-style-type: lower-roman; }
                            ol.alpha { list-style-type: lower-alpha; }
                        </style>
                    </head>
                    <body>
                        ${editorRef.current.innerHTML}
                    </body>
                </html>
            `);
      printWindow.document.close();

      printWindow.print();
      printWindow.close();
    }
  };

  const handleDownloadPDF = async () => {
    if (editorRef.current && content.trim()) {
      try {
        // Create a copy of the content to modify
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorRef.current.innerHTML;
        tempDiv.style.width = '210mm';  // A4 width
        tempDiv.style.minHeight = '297mm';  // A4 height
        tempDiv.style.padding = '10mm';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.color = 'black';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12pt';

        // Append to body to render
        document.body.appendChild(tempDiv);

        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          logging: false
        });

        // Remove temporary div
        document.body.removeChild(tempDiv);

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('babyeyi_letter.pdf');
      } catch (error) {
        console.error('PDF generation error:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    } else {
      alert("Please enter some content before downloading PDF.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Babyeyi Letter Editor</h2>

      {/* Extended Toolbar */}
      <div className="mb-2 flex items-center space-x-2">
        {/* Text Formatting Buttons */}
        <div className="flex space-x-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.command}
              className="p-2 hover:bg-gray-100 rounded"
              title={button.title}
            >
              <button.icon size={18} />
            </button>
          ))}
        </div>

        {/* List Style Dropdown */}
        <select
          onChange={(e) => handleListStyleChange(e.target.value)}
          className="ml-2 p-1 border rounded"
        >
          {listStyles.map((style, index) => (
            <option key={index} value={style.name}>
              {style.name} List
            </option>
          ))}
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleContentChange}
        className="w-full min-h-[300px] border-2 border-blue-500 rounded p-2 mb-4 text-black"
        placeholder="Enter your letter content here"
        suppressContentEditableWarning={true}
        style={{
          color: 'black',
          caretColor: 'black',
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '12px',
        }}
      ></div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">

        <button className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-purple-600 bg-[#d1caf7] hover:bg-[#b4ace2] rounded-lg font-bold" onClick={handleDownloadPDF}>
          <Download size={18} className="mr-2 inline" />
          Download PDF
        </button>
        <button className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-green-600 bg-[#d5f4d2] hover:bg-[#aed2ab] rounded-lg font-bold" onClick={handlePrint}>
          <Printer size={18} className="mr-2 inline" />
          Prints
        </button>
        <button
          className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm text-red-600 hover:bg-[#ff8f8c] rounded-lg"
          onClick={handleClear}
          style={{ fontSize: '12px', textDecoration: 'underline' }}
        >
          Clear
        </button>

        <button className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-blue-600 bg-[#f0f5ff] hover:bg-[#7bb8e6] rounded-lg font-bold" onClick={handleSave}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default BabyeyiLetter;
