import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import PredictionResult from './components/PredictionResult'
import Footer from './components/Footer';

const App = () => {
  // Custom component to handle conditional rendering of Navbar and Footer
  const Layout = ({ children }) => {
    const location = useLocation();
    const hideRoutes = ["/result"]; // Routes where you want to hide both Navbar and Footer

    return (
      <>
        {!hideRoutes.includes(location.pathname) && <Navbar />} 
        {children}
        {!hideRoutes.includes(location.pathname) && <Footer />}
      </>
    );
  };

  return (
    <Router>
      <Layout>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/result" element={<PredictionResult />} />
          </Routes>
        </main>
      </Layout>
    </Router>
  );
};

export default App;
