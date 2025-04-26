import React, { useState } from 'react';

const Contact = () => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Book Appointment</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="First Name"
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Your Email"
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Phone No."
                style={styles.input}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={togglePopup}
                  style={styles.buttonClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  style={styles.buttonSubmit}
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '400px',
    maxWidth: '90%',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  buttonClose: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonSubmit: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Contact;