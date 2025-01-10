import React from "react";
import BabyeyiFile from '../../../assets/files/babyeyi.pdf';
import "./Babyeyi.css";

function Babyeyi() {
    return (
        <div className="pdf-container">
            <object
                className="pdf-viewer"
                data={BabyeyiFile}
                type="application/pdf"
            >
                <div className="fallback-message">
                    <p>Your browser doesn't support PDFs.</p>
                    <p>
                        You can {" "}
                        <a 
                            href={BabyeyiFile}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            download the PDF here
                        </a>
                    </p>
                </div>
            </object>
        </div>
    );
}

export default Babyeyi;