import React, { useState, useEffect } from "react";
import image1 from "../assets/images/ai.jpg";
import image2 from "../assets/images/lung.jpg";
import image3 from "../assets/images/xai.jpg";


const BlogPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const blogs = [
        {
            id: 1,
            title: "AI in Medical Diagnostics",
            content: "Artificial Intelligence is transforming medical diagnostics by enabling faster and more accurate disease detection. AI-powered imaging analysis helps radiologists detect anomalies more precisely, reducing human error. Additionally, machine learning models assist in diagnosing diseases based on patient data, enhancing predictive capabilities. The integration of AI in healthcare continues to revolutionize medical practices, improving patient outcomes and operational efficiency...",
            image: image1,
        },
        {
            id: 2,
            title: "Lung Cancer Detection",
            content: "Lung cancer is one of the most challenging diseases to detect early. Machine learning and deep learning models are being used to analyze CT scans and X-rays, helping doctors identify cancerous nodules at an earlier stage. NLP techniques process patient reports, extracting meaningful insights that support decision-making. By leveraging AI, healthcare professionals can improve diagnostic accuracy and offer personalized treatment plans...",
            image: image2,
        },
        {
            id: 3,
            title: "Explainable AI: Why It Matters",
            content: "With AI making critical healthcare decisions, it is crucial for models to provide transparency and justifications for their predictions. Explainable AI (XAI) ensures that medical professionals understand how a decision is made, building trust in AI-assisted diagnostics. XAI methods, such as SHAP values and attention maps, help visualize model behavior, making AI a more reliable tool in the medical field...",
            image: image3,
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
        }, 5000); // Change every 5 seconds
    
        return () => clearInterval(interval);
    }, [blogs.length]);

    return (
        <div className="blog-container">
            <h1 className="blog-title">Latest Blog Posts</h1>
            <div className="blog-slider">
                {blogs.map((blog, index) => (
                    <div 
                        key={blog.id} 
                        className={`blog-card ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setSelectedBlog(blog)}
                    >
                        <img src={blog.image} alt={blog.title} className="blog-image" />
                        <h2>{blog.title}</h2>
                        <p>{blog.content.substring(0, 100)}...</p>
                    </div>
                ))}
            </div>

            {/* Popup Modal */}
            {selectedBlog && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal">
                        <button className="close-button" onClick={() => setSelectedBlog(null)}>✖</button>
                        <img src={selectedBlog.image} alt={selectedBlog.title} className="modal-image" />
                        <h2>{selectedBlog.title}</h2>
                        <p>{selectedBlog.content}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPage;
