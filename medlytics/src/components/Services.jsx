// src/components/Services.jsx - Comprehensive Services Page
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Sleep Disorder Analysis',
      description: 'Advanced AI-powered sleep pattern analysis to identify potential sleep disorders and provide personalized recommendations for better rest.',
      icon: 'bi-moon-stars-fill',
      color: 'primary',
      link: '/sleep-disorder',
      features: [
        'Sleep quality assessment',
        'Disorder risk prediction',
        'Personalized sleep tips',
        'Track sleep patterns'
      ]
    },
    {
      id: 2,
      title: 'Anxiety Assessment',
      description: 'Comprehensive anxiety screening using validated psychological scales to help identify anxiety patterns and severity levels.',
      icon: 'bi-heart-pulse-fill',
      color: 'info',
      link: '/anxiety-prediction',
      features: [
        'GAD-7 assessment',
        'Anxiety level tracking',
        'Coping strategies',
        'Progress monitoring'
      ]
    },
    {
      id: 3,
      title: 'Depression Screening',
      description: 'Evidence-based depression screening tool to detect early signs and provide appropriate resources and recommendations.',
      icon: 'bi-emoji-frown-fill',
      color: 'warning',
      link: '/depression-prediction',
      features: [
        'PHQ-9 screening',
        'Risk level assessment',
        'Crisis resources',
        'Professional guidance'
      ]
    },
    {
      id: 4,
      title: 'BMI & Nutritional Analysis',
      description: 'Comprehensive body mass index calculation with personalized nutritional recommendations and health risk assessment.',
      icon: 'bi-calculator-fill',
      color: 'success',
      link: '/nutritional-prediction',
      features: [
        'BMI calculation',
        'Health risk analysis',
        'Diet recommendations',
        'Fitness planning'
      ]
    },
    {
      id: 5,
      title: 'Health Dashboard',
      description: 'Centralized dashboard to track all your health metrics, view history, and monitor progress over time.',
      icon: 'bi-graph-up-arrow',
      color: 'danger',
      link: '/dashboard',
      features: [
        'Unified health view',
        'Progress tracking',
        'Export reports',
        'Trend analysis'
      ]
    },
    {
      id: 6,
      title: 'Health Blog & Resources',
      description: 'Access expert-written articles on mental health, nutrition, sleep, and overall wellness.',
      icon: 'bi-book-half',
      color: 'secondary',
      link: '/blog',
      features: [
        'Expert articles',
        'Latest research',
        'Health tips',
        'Community insights'
      ]
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="bg-gradient-primary-to-secondary text-white py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-3">Our Health Services</h1>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: '800px' }}>
              Comprehensive AI-powered health analytics and personalized wellness insights
              to help you make informed decisions about your health.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <span className="badge bg-white text-primary fs-6 px-3 py-2">
                <i className="bi bi-shield-check me-2"></i>
                Privacy Protected
              </span>
              <span className="badge bg-white text-primary fs-6 px-3 py-2">
                <i className="bi bi-graph-up me-2"></i>
                98% Accuracy
              </span>
              <span className="badge bg-white text-primary fs-6 px-3 py-2">
                <i className="bi bi-clock me-2"></i>
                24/7 Available
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding-md">
        <div className="container max-content-width">
          <div className="row g-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="col-lg-4 col-md-6"
              >
                <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all d-flex flex-column">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className={`d-inline-flex align-items-center justify-content-center bg-${service.color} bg-opacity-10 rounded-circle p-3 mb-3`}
                      style={{ width: '70px', height: '70px' }}>
                      <i className={`bi ${service.icon} fs-2 text-${service.color}`}></i>
                    </div>
                    <h3 className="h4 mb-3">{service.title}</h3>
                    <p className="text-muted mb-4 flex-grow-1">{service.description}</p>

                    <ul className="list-unstyled mb-4">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="mb-2">
                          <i className={`bi bi-check-circle-fill text-${service.color} me-2`}></i>
                          <small>{feature}</small>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={service.link}
                      className={`btn btn-outline-${service.color} w-100`}
                    >
                      Get Started
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding-md bg-gradient-section">
        <div className="container max-content-width">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">How It Works</h2>
            <p className="lead text-muted">Simple, fast, and secure health assessments</p>
          </div>

          <div className="row g-4 align-items-center">
            {[
              {
                step: '1',
                title: 'Choose Your Service',
                description: 'Select the health assessment you need from our comprehensive range of services.',
                icon: 'bi-cursor-fill'
              },
              {
                step: '2',
                title: 'Complete Assessment',
                description: 'Answer scientifically-designed questions about your health and lifestyle.',
                icon: 'bi-clipboard-check-fill'
              },
              {
                step: '3',
                title: 'Get Instant Results',
                description: 'Receive AI-powered analysis with personalized recommendations and actionable insights.',
                icon: 'bi-lightning-charge-fill'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="col-md-4"
              >
                <div className="text-center p-4">
                  <div className="position-relative d-inline-block mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                      <i className={`bi ${step.icon}`}></i>
                    </div>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                      {step.step}
                    </span>
                  </div>
                  <h4 className="h5 mb-3">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding-md">
        <div className="container max-content-width">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold mb-4">Why Choose MedLytics?</h2>
              <div className="mb-4">
                <div className="d-flex mb-3">
                  <div className="me-3">
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h5>Evidence-Based Assessments</h5>
                    <p className="text-muted mb-0">All our tools use validated medical and psychological scales approved by healthcare professionals.</p>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="me-3">
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h5>AI-Powered Analysis</h5>
                    <p className="text-muted mb-0">Advanced machine learning algorithms provide accurate predictions and personalized insights.</p>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="me-3">
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h5>Complete Privacy</h5>
                    <p className="text-muted mb-0">Your data is encrypted and never shared. We take your privacy seriously.</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="me-3">
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h5>Free to Use</h5>
                    <p className="text-muted mb-0">All our services are completely free. No hidden costs or subscriptions required.</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary btn-lg">
                Learn More About Us
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card border-0 shadow-sm bg-primary bg-opacity-10 p-4 text-center">
                    <h3 className="display-4 fw-bold text-primary mb-0">10k+</h3>
                    <p className="text-muted mb-0">Users Helped</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm bg-success bg-opacity-10 p-4 text-center">
                    <h3 className="display-4 fw-bold text-success mb-0">98%</h3>
                    <p className="text-muted mb-0">Accuracy Rate</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm bg-warning bg-opacity-10 p-4 text-center">
                    <h3 className="display-4 fw-bold text-warning mb-0">24/7</h3>
                    <p className="text-muted mb-0">Support</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm bg-info bg-opacity-10 p-4 text-center">
                    <h3 className="display-4 fw-bold text-info mb-0">6</h3>
                    <p className="text-muted mb-0">Core Services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-md bg-primary text-white">
        <div className="container max-content-width">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-2">Ready to start your health journey?</h2>
              <p className="lead mb-0">
                Begin with a free assessment and get personalized insights today.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/dashboard" className="btn btn-light btn-lg">
                <i className="bi bi-speedometer2 me-2"></i>
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;