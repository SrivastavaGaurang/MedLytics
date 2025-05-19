import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loginWithRedirect, isLoading } = useAuth0();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
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
              <li><Link className="dropdown-item" to="/sleep-disorder" onClick={toggleMenu}>Sleep Disorder</Link></li>
              <li><Link className="dropdown-item" to="/anxiety-prediction" onClick={toggleMenu}>Anxiety Prediction</Link></li>
              <li><Link className="dropdown-item" to="/depression-prediction" onClick={toggleMenu}>Depression Prediction</Link></li>
              <li><Link className="dropdown-item" to="/nutritional-prediction" onClick={toggleMenu}>BMI Prediction</Link></li>
            </ul>
          </li>

          <li><Link to="/doctors" onClick={toggleMenu}>Doctors</Link></li>
          <li><Link to="/blog" onClick={toggleMenu}>Blog</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}><button className="btn-outline">Contact Us</button></Link></li>
        </ul>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {!isLoading && isAuthenticated && user ? (
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={user.picture} alt={user.name} className="rounded-circle me-2" width="30" height="30" />
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item" to="/profile">Profile Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            !isLoading && (
              <button className="btn btn-outline-light me-2" onClick={() => loginWithRedirect()}>
                Login
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
