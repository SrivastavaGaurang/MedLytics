import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaCog, FaChartLine } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Services',
      path: '#',
      dropdown: [
        { name: 'Sleep Analysis', path: '/sleep-disorder' },
        { name: 'Anxiety Prediction', path: '/anxiety-prediction' },
        { name: 'Depression Prediction', path: '/depression-prediction' },
        { name: 'BMI Analysis', path: '/bmi-prediction' },
      ]
    },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed-top transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
        }`}
      style={{ zIndex: 1000 }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <span className="fw-bold fs-4">M</span>
            </div>
            <span className={`fw-bold fs-4 ${scrolled ? 'text-dark' : 'text-primary'}`}
              style={{ fontFamily: "'Outfit', sans-serif" }}>
              MedLytics
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {navLinks.map((link, index) => (
              <div key={index} className="position-relative group">
                {link.dropdown ? (
                  <div className="dropdown">
                    <button
                      className={`btn btn-link text-decoration-none fw-medium dropdown-toggle ${scrolled ? 'text-dark' : 'text-dark'
                        }`}
                      type="button"
                      id={`dropdown-${index}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {link.name}
                    </button>
                    <ul className="dropdown-menu border-0 shadow-lg rounded-3 p-2" aria-labelledby={`dropdown-${index}`}>
                      {link.dropdown.map((item, idx) => (
                        <li key={idx}>
                          <Link to={item.path} className="dropdown-item rounded-2 py-2 px-3 hover-bg-light">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-decoration-none fw-medium position-relative ${location.pathname === link.path ? 'text-primary' : (scrolled ? 'text-dark' : 'text-dark')
                      }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="underline"
                        className="position-absolute bottom-0 start-0 w-100 bg-primary"
                        style={{ height: '2px' }}
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons & Mobile Toggle */}
          <div className="d-flex align-items-center gap-3">
            {!loading && (
              isAuthenticated && user ? (
                <div className="dropdown">
                  <button
                    className="btn border-0 p-0 d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src={user.picture || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="rounded-circle border border-2 border-primary"
                      width="40"
                      height="40"
                    />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-3 mt-2" style={{ minWidth: '200px' }}>
                    <li className="mb-2 px-2">
                      <p className="mb-0 fw-bold text-dark">{user.name}</p>
                      <small className="text-muted">{user.email}</small>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link to="/dashboard" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2">
                        <FaChartLine className="text-primary" /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2">
                        <FaUserCircle className="text-info" /> Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger">
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-none d-lg-flex gap-2">
                  <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Login</Link>
                  <Link to="/register" className="btn btn-primary rounded-pill px-4 bg-gradient-primary border-0">
                    Get Started
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="btn btn-link text-dark d-lg-none p-0 fs-3"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="d-lg-none bg-white border-top shadow-lg overflow-hidden"
          >
            <div className="container py-4 d-flex flex-column gap-3">
              {navLinks.map((link, index) => (
                <div key={index}>
                  {link.dropdown ? (
                    <div className="d-flex flex-column gap-2">
                      <span className="fw-bold text-primary px-3">{link.name}</span>
                      <div className="ps-4 d-flex flex-column gap-2 border-start border-2 ms-3">
                        {link.dropdown.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            className="text-decoration-none text-dark py-1"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-decoration-none fw-medium px-3 py-2 rounded-2 d-block ${location.pathname === link.path ? 'bg-primary-subtle text-primary' : 'text-dark'
                        }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              {!isAuthenticated && (
                <div className="d-flex flex-column gap-2 mt-3 px-3">
                  <Link to="/login" className="btn btn-outline-primary w-100 rounded-pill">Login</Link>
                  <Link to="/register" className="btn btn-primary w-100 rounded-pill">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
