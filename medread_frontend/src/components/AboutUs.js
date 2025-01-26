import React from "react";
import image from "../assets/images/about.jpg";

const AboutUs = () =>{
    return(
        <div className="aboutus-container ">
            <div className="aboutus-para-container">
                <h1 className="aboutus-heading">About Us</h1>
                <p className="aboutus-para">
                    MedRead was created for the need to simplify the overwhelming complexity of lung cancer medical reports.
                    Our cutting-edge platform leverages advanced Natural Language Processing (NLP) to transform these unstructured documents into clear, 
                    concise summaries, empowering healthcare professionals to make faster, and more informed decisions. 
                    By streamlining the process of retrieving and analyzing key information, MedRead is designed to save valuable time while enhancing the quality of patient care.
                </p>
                <p className="aboutus-para">
                     Understanding that images often accompany medical reports, MedRead integrates image Processing to analyze and interpret medical images alongside text. 
                     This powerful combination provides a holistic view of patient data, 
                     enabling more accurate diagnoses and personalized treatment plans. By merging image recognition with textual analysis, 
                     MedRead offers a comprehensive approach to understanding and utilizing complex medical information.
                </p>
                <p className="aboutus-para">
                    Transparency and trust are at the core of MedRead. Our platform’s Explainable Artificial Intelligence (XAI) ensures that every automated decision is not only precise but also fully understandable.
                    By revealing how key conclusions are drawn, MedRead builds confidence among healthcare providers, allowing them to make informed decisions with complete peace of mind. 
                    We are committed to revolutionizing healthcare delivery, making it more efficient, reliable, and patient-focused.
                </p>
            </div>
            <div className="aboutus-img-container">
                <img className="aboutus-img" src={image} alt="AboutUs"></img>
            </div>
        </div>

    );
};

export default AboutUs;