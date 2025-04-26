import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Update state
    setIsLoggedIn(false);

    // Redirect to home page
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">Medlytics</Link>

        {/* Navbar Links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About Us</Link></li>

          {/* Services Dropdown */}
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <ul className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`} aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" to="/sleep-disorder" onClick={toggleMenu}>
                  Sleep Disorder
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/anxiety-prediction" onClick={toggleMenu}>
                  Anxiety Prediction
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/depression-prediction" onClick={toggleMenu}>
                  Depression Prediction
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/nutritional-prediction" onClick={toggleMenu}>
                  Nutritional Prediction
                </Link>
              </li>
            </ul>
          </li>

          <li><Link to="/doctors" onClick={toggleMenu}>Doctors</Link></li>
          <li><Link to="/blog" onClick={toggleMenu}>Blog</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}><button className="btn-outline">Contact Us</button></Link></li>
        </ul>

        {/* Login & Sign Up Buttons */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                My Account
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item" to="/profile">Profile Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <div>
              <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
              <Link className="btn btn-light" to="/register">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;