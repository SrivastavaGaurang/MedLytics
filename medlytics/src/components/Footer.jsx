import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-white pt-5 pb-4" style={{ backgroundColor: '#2c3e50' }}>
      <div className="container">
        <div className="row">
          {/* About Us Section */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>About MedLytics</h5>
            <p className="text-muted">
              AI-powered health analytics platform providing personalized wellness insights through advanced machine learning algorithms. We help you understand your health patterns and make informed decisions about your wellbeing.
            </p>
          </div>

          {/* Our Services Section */}
          <div className="col-md-2 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>Our Services</h5>
            <ul className="list-unstyled">
              <li><a href="/sleep-disorder" className="text-muted text-decoration-none">Sleep Disorder Analysis</a></li>
              <li><a href="/anxiety-prediction" className="text-muted text-decoration-none">Anxiety Prediction</a></li>
              <li><a href="/depression-prediction" className="text-muted text-decoration-none">Depression Prediction</a></li>
              <li><a href="/bmi-prediction" className="text-muted text-decoration-none">BMI Analysis</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="text-muted mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                Law Gate, Phagwara
              </li>
              <li className="text-muted mb-2">
                <i className="bi bi-geo me-2"></i>
                Punjab, India
              </li>
              <li className="text-muted mb-2">
                <i className="bi bi-envelope me-2"></i>
                gaurangsrivastava@gmail.com
              </li>
              <li className="text-muted mb-2">
                <i className="bi bi-phone me-2"></i>
                +91 6389697117
              </li>
            </ul>
            <div className="mt-3">
              <small className="text-muted">24/7 Support Available</small>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>Health Insights Newsletter</h5>
            <p className="text-muted small mb-3">
              Get the latest health tips and AI-powered wellness insights delivered to your inbox.
            </p>
            <form>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: '#3498db', border: 'none' }}>
                Subscribe to Health Tips
              </button>
            </form>
          </div>
        </div>
        
        <hr className="my-4" style={{ borderColor: '#34495e' }} />
        
        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              &copy; 2025 MedLytics. All rights reserved. | Privacy-focused health analytics
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end justify-content-center gap-3 mt-3 mt-md-0">
              <span className="badge bg-success">98% Accuracy</span>
              <span className="badge bg-info">10k+ Users</span>
              <span className="badge bg-primary">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;