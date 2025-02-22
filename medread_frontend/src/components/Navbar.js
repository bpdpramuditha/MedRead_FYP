import React, { useState } from "react";
import { Link } from "react-scroll";
import ContactUsPopup from "./ContactUsPopup"; // Import the popup component

const Navbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div className="navigation-bar-container">
            <div>
                <div className="container">
                    <div className="title-container">
                        <Link to="home" spy={true} smooth={true} duration={500}>
                            <h1 className="title">MedRead</h1>
                        </Link>
                    </div>
                    <nav className="nav-bar-elements"> 
                        <Link className="link" to="home" spy={true} smooth={true} duration={500}>
                            Home
                        </Link>
                        <Link className="link" to="aboutus" spy={true} smooth={true} duration={500}>
                            About Us
                        </Link>
                        <Link className="link" to="services" spy={true} smooth={true} duration={500}>
                            Services
                        </Link>
                        <Link className="link" to="blog" spy={true} smooth={true} duration={500}>
                            Blog
                        </Link>
                        <Link className="link" to="footer" spy={true} smooth={true} duration={500} onClick={() => setIsPopupOpen(true)}>
                            Contact Us
                        </Link>
    
                    </nav>
                </div>
            </div>

            {/* Contact Us Popup Component */}
            <ContactUsPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
        </div>
    );
};

export default Navbar;
