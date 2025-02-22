import React from "react";

const ContactUsPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render if not open

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <h2 className="popup-title">Contact Us</h2>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter your name" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows="3" placeholder="Your message"></textarea>
                    </div>
                    <button className="send-button">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ContactUsPopup;
