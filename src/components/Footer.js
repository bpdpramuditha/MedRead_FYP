import React from "react";

const Footer = () => {
  return (
    <div className="flat-footer bg-backgroundColor text-white">
      <div className="flat-footer-content">
        <div>
          <h1 className="font-semibold text-lg">MedRead</h1>
          <p className="text-sm">
          Tailored for healthcare professionals specializing in radiology, oncology, pulmonology, pathology, and beyond empowering accurate diagnostics with AI-driven insights.
          </p>
        </div>
        <div>
          <h1 className="font-medium text-md">About Us</h1>
          <nav className="flat-nav">
            <a href="#aboutus">About Us</a>
            <a href="#services">Services</a>
            <a href="#blog">Blog</a>
          </nav>
        </div>
        <div>
          <h1 className="font-medium text-md">Services</h1>
          <nav className="flat-nav">
            <a href="#home">Lab Test</a>
            <a href="#home">Health Check</a>
            <a href="#home">Heart Health</a>
          </nav>
        </div>
        <div>
          <h1 className="font-medium text-md">Contact Us</h1>
          <nav className="flat-nav">
            <a href="/">106/3, Kapuhempala, Akmmemna, Galle</a>
            <a href="mailto:support@care.com">support@care.com</a>
            <a href="tel:+1234567890">+123-456-7890</a>
          </nav>
        </div>
      </div>
      <div className="flat-footer-bottom">
        <p>
          &copy; 2025 WellnessVista | Developed by <span className="text-hoverColor">Envictus Solutions</span>. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
