import React from "react";
import "./About.css";
import VisionValues from "../VisionValues/VisionValues";
import Inspiration from "../Inspiration/Inspiration";
import schoolImage from '../../../assets/images/PereMario.jpg';
import DioceseByumba from "../DioceseByumba/DioceseByumba";

function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="sidebar-image">
                    <img src={schoolImage} alt="School" />
                </div>
                
                <div className="welcome-section">
                    <h1 className="welcome-title">History and Location</h1>
                    <p className="welcome-text">
                        Now known as Lycée Saint Alexandre Sauli de Muhura, 
                        was founded on September 17, 1990, by the Barnabite Fathers, 
                        who initiated the project with the local mayor's support.
                        Initially operating under the name ASSOPEM, 
                        the school aimed to serve the community, 
                        apply the Barnabite charism, and support the country's sustainable 
                        development. The school opened with two academic 
                        tracks in <b>Law</b>, <b>Administration</b> and <b>Economics.</b>
                    </p>

                    <p className="welcome-text">
                        In 1991, the Barnabite Fathers sought full 
                        control to establish it as a private, 
                        subsidized institution. By 1992,
                        the government recognized it as such, 
                        and on October 7, 1992, the foundations were laid
                        for new facilities. Since then, the school has
                        focused on practical, skill-based education to 
                        prepare students for independent work and entrepreneurship,
                        offering programs in:
                    </p>

                    <div className="programs-list">
                        <div className="program-item">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span><b>Accounting</b></span>
                        </div>
                        <div className="program-item">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span><b>Fashion Design / (FAD)</b></span>
                        </div>
                        <div className="program-item">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span><b>Software Development / (SWD)</b></span>
                        </div>
                        <div className="program-item">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span><b>Network and Internet Technology / (NIT)</b></span>
                        </div>
                        <div className="program-item">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span><b>Computer System and Architecture / (CSA)</b></span>
                        </div>
                    </div>

                    <p className="welcome-text">
                        Today, Lycée Saint Alexandre Sauli Muhura serves 657 students,
                        fostering job readiness and reducing unemployment in the community. 
                        The school officially received accreditation in 2010, marking a milestone 
                        in its mission to provide quality education aligned with the 
                        Barnabite Fathers' values.
                    </p>
                </div>
            </div>
            
            <VisionValues />

            <Inspiration />

            <DioceseByumba />
        </div>
    );
}

export default About;