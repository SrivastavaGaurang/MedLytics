import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Services',
      dropdown: [
        { name: 'Sleep Analysis', path: '/sleep-disorder' },
        { name: 'Anxiety Prediction', path: '/anxiety-prediction' },
        { name: 'Depression Prediction', path: '/depression-prediction' },
        { name: 'BMI Analysis', path: '/bmi-prediction' },
        { name: 'Nutritional Analysis', path: '/nutritional-prediction' },
      ]
    },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '0.75rem 0',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* Logo */}
          <Link to="/" className="navbar-brand text-decoration-none d-flex align-items-center gap-2 m-0">
            <div
              className="text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}
            >
              <span className="fw-bold fs-5">M</span>
            </div>
            <span
              className="fw-bold fs-4 text-primary"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              MedLytics
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex align-items-center" style={{ gap: '2rem' }}>
            {navLinks.map((link, index) => (
              <div key={index} className="position-relative">
                {link.dropdown ? (
                  <div className="dropdown">
                    <button
                      className="btn btn-link text-decoration-none fw-medium dropdown-toggle text-dark px-0"
                      type="button"
                      id={`dropdown-${index}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        fontSize: '0.95rem',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {link.name}
                    </button>
                    <ul className="dropdown-menu border-0 shadow-lg rounded-3 p-2" aria-labelledby={`dropdown-${index}`}>
                      {link.dropdown.map((item, idx) => (
                        <li key={idx}>
                          <Link to={item.path} className="dropdown-item rounded-2 py-2 px-3">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-decoration-none fw-medium position-relative ${location.pathname === link.path ? 'text-primary' : 'text-dark'
                      }`}
                    style={{
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease',
                      paddingBottom: '4px'
                    }}
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

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 8px rgba(67, 97, 238, 0.3)'
                  }}
                >
                  <FaUser size={14} />
                  <span>{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-3 p-2" aria-labelledby="userDropdown">
                  <li>
                    <Link to="/dashboard" className="dropdown-item rounded-2 py-2 px-3">
                      Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 px-3 text-danger d-flex align-items-center gap-2">
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold text-dark"
                  style={{
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
                  style={{
                    fontSize: '0.9rem'
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="d-lg-none d-flex align-items-center">
            <button
              className="btn btn-link text-dark p-0 fs-3"
              onClick={toggleMenu}
              style={{ border: 'none' }}
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
            className="d-lg-none bg-white border-top shadow-lg overflow-hidden position-absolute w-100"
            style={{ top: '100%', left: 0 }}
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

              <hr className="my-2" />

              {isAuthenticated ? (
                <>
                  <div className="d-flex align-items-center gap-2 px-3 py-2">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <FaUser size={14} />
                    </div>
                    <span className="fw-bold">{user?.name || 'User'}</span>
                  </div>
                  <Link to="/dashboard" className="btn btn-outline-primary w-100 text-start px-3">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline-danger w-100 text-start px-3">
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </>
              ) : (
                <div className="d-flex flex-column gap-3 mt-2">
                  <Link to="/login" className="btn btn-outline-primary w-100">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary w-100">
                    Register
                  </Link>
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
