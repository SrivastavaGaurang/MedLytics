import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-white pt-5 pb-4" style={{ backgroundColor: '#2c3e50' }}>
      <div className="container">
        <div className="row">
          {/* About Us Section */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>About Us</h5>
            <p className="text-muted">
              Our team of dedicated doctors, each specializing in unique fields such as orthopedics, cardiology, pediatrics, neurology, dermatology, and more.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-2 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-muted text-decoration-none">About Services</a></li>
              <li><a href="/lab-test" className="text-muted text-decoration-none">Lab Test</a></li>
              <li><a href="/health-check" className="text-muted text-decoration-none">Health Check</a></li>
              <li><a href="/heart-health" className="text-muted text-decoration-none">Heart Health</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="text-muted">law gate pahgwara</li>
              <li className="text-muted">punjab, India</li>
              <li className="text-muted">gaurangsrivastava@gmail.com</li>
              <li className="text-muted">+91 6389697117</li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3" style={{ color: '#ecf0f1' }}>Subscribe to Our Newsletter</h5>
            <form>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3498db', border: 'none' }}>Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;