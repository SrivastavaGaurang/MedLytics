import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './ContactPage.css';



const SERVER_URL = 'http://localhost:5000';

const ImprovedContact = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, '')))
      newErrors.phone = 'Enter a valid phone number';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Min 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error('Please correct the form errors');

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/contact`, formData, {
        timeout: 10000, // Add timeout for better error handling
      });
      if (response.status === 200) {
        setSubmitSuccess(true);
        toast.success('Message sent! We will contact you soon.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => setSubmitSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  return (
    <section className="contact-page-container">
      <div className="contact-hero text-white text-center">
        <div className="container">
          <h1 className="display-3 fw-bold mb-4">Connect With Us</h1>
          <p className="lead mb-0">We're here to answer your questions and provide support.</p>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="contact-info p-4 rounded-3 shadow-lg">
              <h2 className="h4 mb-4">Contact Details</h2>
              {[
                { icon: 'geo-alt-fill', title: 'Location', content: 'Lovely Professional University, Jalandhar, Punjab 144411' },
                { icon: 'telephone-fill', title: 'Phone', content: '+91 6389697117', link: 'tel:+916389697117' }, { icon: 'envelope-fill', title: 'Email', content: 'support@medlytics.com', link: 'mailto:support@medlytics.com' },
                { icon: 'clock-fill', title: 'Hours', content: 'Mon–Fri: 9–5, Sat: 10–2, Sun: Closed' }
              ].map(({ icon, title, content, link }, idx) => (
                <div className="d-flex mb-4" key={idx}>
                  <div className="contact-icon-wrapper me-3">
                    <i className={`bi bi-${icon}`} aria-hidden="true"></i>
                    <span className="visually-hidden">{title} icon</span>
                  </div>
                  <div>
                    <h6 className="mb-1 fw-semibold">{title}</h6>
                    {link ? (
                      <a href={link} className="text-decoration-none text-secondary">{content}</a>
                    ) : <p className="mb-0 text-secondary">{content}</p>}
                  </div>
                </div>
              ))}
              <hr className="my-4" />
              <h6 className="fw-semibold">Follow Us</h6>
              <div className="social-links mt-3">
                {[
                  { name: 'facebook', url: 'https://facebook.com', label: 'Facebook' },
                  { name: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
                  { name: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
                  { name: 'instagram', url: 'https://instagram.com', label: 'Instagram' }
                ].map(({ name, url, label }, i) => (
                  <a key={i} href={url} className="me-3 social-icon" aria-label={`Follow us on ${label}`}>
                    <i className={`bi bi-${name}`} aria-hidden="true"></i>
                    <span className="visually-hidden">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4 p-lg-5">
                <h2 className="card-title mb-4 fw-bold">Send a Message</h2>
                {submitSuccess ? (
                  <div className="alert alert-success d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" aria-hidden="true"></i>
                    Thank you! Your message has been received.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-4">
                      {[{
                        id: 'firstName', label: 'First Name*', type: 'text', required: true
                      }, {
                        id: 'lastName', label: 'Last Name', type: 'text'
                      }, {
                        id: 'email', label: 'Email*', type: 'email', required: true
                      }, {
                        id: 'phone', label: 'Phone', type: 'tel'
                      }].map(({ id, label, type, required }) => (
                        <div className="col-md-6" key={id}>
                          <label htmlFor={id} className="form-label fw-medium">{label}</label>
                          <input
                            type={type}
                            className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
                            id={id}
                            name={id}
                            value={formData[id]}
                            onChange={handleChange}
                            placeholder={`Enter your ${label.toLowerCase().replace('*', '')}`}
                            required={required}
                          />
                          {errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
                        </div>
                      ))}
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label fw-medium">Subject</label>
                        <select className="form-select" id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                          <option value="">Select a subject</option>
                          {["General Inquiry", "Technical Support", "Sleep Analysis", "Anxiety Assessment", "Depression Assessment", "Nutritional Analysis", "Partnership", "Other"].map((subj, i) => (
                            <option key={i} value={subj}>{subj}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="message" className="form-label fw-medium">Message*</label>
                        <textarea
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          id="message"
                          name="message"
                          rows="6"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please share your message..."
                          required
                        ></textarea>
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                      </div>
                      <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImprovedContact;