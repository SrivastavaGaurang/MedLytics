import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeartbeat } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white pt-5 pb-2" style={{ background: 'linear-gradient(to right, #1a2980, #26d0ce)' }}>
      <div className="container">
        <div className="row g-4">
          {/* About Us Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}>
                <span className="fw-bold">M</span>
              </div>
              <h4 className="mb-0 fw-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>MedLytics</h4>
            </div>
            <p className="text-white-50 mb-4">
              AI-powered health analytics platform providing personalized wellness insights through advanced machine learning algorithms. We help you understand your health patterns and make informed decisions.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FaFacebookF />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FaTwitter />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FaInstagram />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="mb-3 fw-bold">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/" className="text-white-50 text-decoration-none hover-text-white transition-all">Home</Link></li>
              <li><Link to="/about" className="text-white-50 text-decoration-none hover-text-white transition-all">About Us</Link></li>
              <li><Link to="/doctors" className="text-white-50 text-decoration-none hover-text-white transition-all">Doctors</Link></li>
              <li><Link to="/blog" className="text-white-50 text-decoration-none hover-text-white transition-all">Health Blog</Link></li>
              <li><Link to="/contact" className="text-white-50 text-decoration-none hover-text-white transition-all">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3 fw-bold">Our Services</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/sleep-disorder" className="text-white-50 text-decoration-none hover-text-white transition-all">Sleep Analysis</Link></li>
              <li><Link to="/anxiety-prediction" className="text-white-50 text-decoration-none hover-text-white transition-all">Anxiety Prediction</Link></li>
              <li><Link to="/depression-prediction" className="text-white-50 text-decoration-none hover-text-white transition-all">Depression Prediction</Link></li>
              <li><Link to="/bmi-prediction" className="text-white-50 text-decoration-none hover-text-white transition-all">BMI Calculator</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3 fw-bold">Contact Us</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li className="d-flex gap-3 text-white-50">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>Law Gate, Phagwara<br />Punjab, India</span>
              </li>
              <li className="d-flex gap-3 text-white-50">
                <FaEnvelope className="mt-1 flex-shrink-0" />
                <span>gaurangsrivastava@gmail.com</span>
              </li>
              <li className="d-flex gap-3 text-white-50">
                <FaPhone className="mt-1 flex-shrink-0" />
                <span>+91 6389697117</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-white-50" />

        {/* Bottom Footer */}
        <div className="row align-items-center pb-3">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-white-50 mb-0 small">
              &copy; {new Date().getFullYear()} MedLytics. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <span className="badge bg-white/10 text-white border border-white/20 d-flex align-items-center gap-1">
                <FaHeartbeat className="text-danger" /> AI Powered
              </span>
              <span className="badge bg-white/10 text-white border border-white/20">Privacy Focused</span>
              <span className="badge bg-white/10 text-white border border-white/20">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;