import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TypingText from "./TypingText";
import { motion } from "framer-motion";

// Import generated assets
import heroSleep from "../assets/images/hero_sleep_analysis_1764914815525.png";
import heroMedical from "../assets/images/hero_medical_team_1764914839249.png";
import heroNutrition from "../assets/images/hero_nutrition_wellness_1764914864064.png";
import heroMental from "../assets/images/hero_mental_health_1764914887902.png";
import dashboardMockup from "../assets/images/feature_dashboard_mockup_1764914911010.png";
import iconSleep from "../assets/images/icon_sleep_analysis_1764914956728.png";

const Home = () => {
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: false,
    fade: true,
    cssEase: "linear"
  };

  // Services data
  const services = [
    {
      id: 1,
      title: "Sleep Disorder Analysis",
      description: "Get insights into your sleep patterns and receive personalized recommendations.",
      icon: "bi-moon-stars-fill",
      link: "/sleep-disorder",
      color: "primary",
      gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
    },
    {
      id: 2,
      title: "Anxiety Prediction",
      description: "Our AI analyzes your responses to help identify anxiety patterns and provide early intervention.",
      icon: "bi-heart-pulse-fill",
      link: "/anxiety-prediction",
      color: "info",
      gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
    },
    {
      id: 3,
      title: "Depression Prediction",
      description: "Advanced algorithms to detect early signs of depression through behavioral patterns.",
      icon: "bi-emoji-frown-fill",
      link: "/depression-prediction",
      color: "warning",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 4,
      title: "BMI Prediction",
      description: "Comprehensive BMI analysis with health metrics assessment and personalized recommendations.",
      icon: "bi-calculator-fill",
      link: "/bmi-prediction",
      color: "success",
      gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      text: "MedLytics helped me understand my sleep patterns and significantly improved my rest quality.",
      author: "Ananya Sharma",
      role: "Software Engineer"
    },
    {
      id: 2,
      text: "The anxiety prediction tool gave me insights I never would have recognized on my own. Truly life-changing.",
      author: "Rajesh Patel",
      role: "Teacher"
    },
    {
      id: 3,
      text: "I've tried many health apps, but MedLytics offers analysis that's actually personalized and actionable.",
      author: "Priya Nair",
      role: "Healthcare Professional"
    }
  ];

  return (
    <>
      {/* Hero Section - Stunning Split Screen Design */}
      <section
        className="position-relative overflow-hidden"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Animated background pattern */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            {/* Left: Content */}
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-white">
                {/* Badge */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span
                    className="badge px-4 py-2 rounded-pill"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <i className="bi bi-stars me-2"></i>
                    AI-Powered Health Analytics
                  </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  className="display-2 fw-bold mb-4"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Your Health Journey,
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Simplified
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="lead mb-5"
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                    opacity: 0.95,
                    lineHeight: 1.7,
                    maxWidth: '540px'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.95 }}
                  transition={{ delay: 0.6 }}
                >
                  Advanced AI technology meets personalized healthcare. Track sleep, manage anxiety, and optimize your wellness—all in one place.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="d-flex gap-3 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link
                    to="/sleep-disorder"
                    className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold d-inline-flex align-items-center gap-2"
                    style={{
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }}
                  >
                    Get Started Free
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                  <Link
                    to="/about"
                    className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold"
                    style={{
                      fontSize: '1.1rem',
                      border: '2px solid rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Learn More
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="row mt-5 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="col-4">
                    <div className="fw-bold" style={{ fontSize: '2rem' }}>98%</div>
                    <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Accuracy</div>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold" style={{ fontSize: '2rem' }}>50K+</div>
                    <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Users</div>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold" style={{ fontSize: '2rem' }}>24/7</div>
                    <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Support</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Hero Image Carousel */}
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div
                className="position-relative hero-carousel-container"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}
              >
                {/* Image Carousel */}
                <Slider
                  {...{
                    dots: true,
                    infinite: true,
                    speed: 1000,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    arrows: false,
                    pauseOnHover: true,  // Pause on hover!
                    fade: true,
                    cssEase: "ease-in-out"
                  }}
                >
                  <div>
                    <img
                      src={heroMedical}
                      alt="Healthcare Professionals"
                      className="img-fluid carousel-image"
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'cover',
                        borderRadius: '24px',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={heroSleep}
                      alt="Sleep Health Analysis"
                      className="img-fluid carousel-image"
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'cover',
                        borderRadius: '24px',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={heroNutrition}
                      alt="Nutrition Wellness"
                      className="img-fluid carousel-image"
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'cover',
                        borderRadius: '24px',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src={heroMental}
                      alt="Mental Health Support"
                      className="img-fluid carousel-image"
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'cover',
                        borderRadius: '24px',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>
                </Slider>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding-md position-relative">
        <div className="container max-content-width">
          <div className="row g-4 text-center">
            {[
              { value: "98%", label: "Accuracy Rate", color: "primary" },
              { value: "10k+", label: "Users Helped", color: "success" },
              { value: "4", label: "Core Services", color: "info" },
              { value: "24/7", label: "AI Support", color: "warning" }
            ].map((stat, index) => (
              <div key={index} className="col-sm-6 col-lg-3">
                <div className="glass-card p-4 h-100">
                  <h2 className={`display-4 fw-bold text-${stat.color}`}>{stat.value}</h2>
                  <p className="text-muted mb-0 fw-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section  - Modern & Clean */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span
              className="badge px-4 py-2 rounded-pill mb-3"
              style={{
                background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
                color: '#667eea',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1px solid rgba(102,126,234,0.2)'
              }}
            >
              OUR SERVICES
            </span>
            <h2 className="display-5 fw-bold mb-3">Comprehensive Health Analytics</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Advanced AI-powered tools to monitor and optimize your health journey
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <div key={service.id} className="col-lg-6">
                <div
                  className="card h-100 border-0 shadow-sm position-relative overflow-hidden"
                  style={{
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}
                >
                  {/* Colored top border */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: service.gradient
                    }}
                  ></div>

                  <div className="card-body p-4">
                    <div className="d-flex align-items-start mb-3">
                      {/* Icon */}
                      <div
                        className="rounded-3 p-3 text-white me-3"
                        style={{
                          background: service.gradient,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        {service.id === 1 ? (
                          <img
                            src={iconSleep}
                            alt="Sleep Icon"
                            style={{
                              width: '32px',
                              height: '32px',
                              filter: 'brightness(0) invert(1)'
                            }}
                          />
                        ) : (
                          <i className={`bi ${service.icon} fs-3`}></i>
                        )}
                      </div>

                      <div className="flex-grow-1">
                        <h3 className="h4 fw-bold mb-2">{service.title}</h3>
                        <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={service.link}
                      className="btn btn-outline-primary w-100 rounded-pill fw-bold py-2"
                      style={{
                        borderWidth: '2px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Explore Service <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding-md">
        <div className="container max-content-width">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">How It Works</h2>
            <p className="lead text-muted max-text-width">Simple steps to better health insights</p>
          </div>

          <div className="row g-4">
            {[
              { step: 1, title: "Create Account", desc: "Sign up in seconds to access tools.", icon: "bi-person-plus-fill" },
              { step: 2, title: "Answer Questions", desc: "Complete scientifically designed questionnaires.", icon: "bi-clipboard-data-fill" },
              { step: 3, title: "Get Insights", desc: "Receive AI-generated analysis instantly.", icon: "bi-lightning-charge-fill" }
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="text-center p-4 glass-card h-100 position-relative">
                  <div className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary fs-5 shadow-sm">
                    {item.step}
                  </div>
                  <div className="rounded-circle bg-gradient-primary text-white fs-2 d-inline-flex align-items-center justify-content-center mb-4 shadow-glow" style={{ width: "80px", height: "80px" }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h3 className="h4 fw-bold">{item.title}</h3>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding-md bg-gradient-section">
        <div className="container max-content-width">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="position-relative animate-float">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary opacity-25 rounded-2xl blur-xl" style={{ filter: 'blur(40px)', zIndex: 0 }}></div>
                <img
                  src={dashboardMockup}
                  alt="Health Analytics Dashboard"
                  className="img-fluid rounded-2xl shadow-lg position-relative"
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
            <div className="col-lg-6 ps-lg-5">
              <span className="text-primary fw-bold letter-spacing-2">WHY CHOOSE US</span>
              <h2 className="display-4 fw-bold mb-4">Advanced AI Health Analytics</h2>

              <div className="d-flex flex-column gap-4">
                {[
                  { title: "Privacy-Focused", desc: "Your health data is encrypted and never shared.", icon: "bi-shield-lock-fill", color: "primary" },
                  { title: "Advanced Analytics", desc: "Cutting-edge AI algorithms for accurate insights.", icon: "bi-cpu-fill", color: "secondary" },
                  { title: "Expert-Backed", desc: "Developed with healthcare professionals.", icon: "bi-award-fill", color: "success" }
                ].map((feature, idx) => (
                  <div key={idx} className="d-flex align-items-start">
                    <div className={`rounded-xl p-3 bg-${feature.color} bg-opacity-10 text-${feature.color} me-3`}>
                      <i className={`bi ${feature.icon} fs-4`}></i>
                    </div>
                    <div>
                      <h4 className="h5 fw-bold mb-1">{feature.title}</h4>
                      <p className="text-muted mb-0">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="text-center mt-5 pt-4">
          <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
            <i className="bi bi-shield-check text-success me-2"></i>
            Trusted by 50,000+ users worldwide
          </p>
        </div>
      </section >

      {/* Testimonials Section - User Success Stories */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span
              className="badge px-4 py-2 rounded-pill mb-3"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600
              }}
            >
              ⭐ TESTIMONIALS
            </span>
            <h2 className="display-4 fw-bold mb-3">Loved by Thousands</h2>
            <p className="lead text-muted">Real stories from people who transformed their health</p>
          </div>

          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0"
                  style={{
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.4s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Gradient border */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px'
                  }}></div>

                  <div className="card-body p-4">
                    {/* Stars */}
                    <div className="mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="mb-4" style={{ fontSize: '1rem', lineHeight: 1.7, color: '#475569' }}>
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="d-flex align-items-center gap-3 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{testimonial.author}</h6>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      < section className="section-padding-md position-relative overflow-hidden" >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary" style={{ zIndex: 0 }}></div>
        <div className="container max-content-width position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center text-white">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-2">Ready to transform your health?</h2>
              <p className="lead mb-0 opacity-75">
                Join thousands of users who have improved their wellness with MedLytics.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/login" className="btn btn-light btn-lg me-2 rounded-pill px-4 shadow-lg text-primary fw-bold">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* FAQ Section */}
      < section className="section-padding-md bg-gradient-section" >
        <div className="container max-content-width">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">FAQ</h2>
          </div>

          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                {[
                  { q: "How accurate are the health predictions?", a: "Our AI models have been trained on extensive datasets and validated with healthcare professionals. They offer up to 98% accuracy in predictions." },
                  { q: "Is my health data secure?", a: "Absolutely. We use industry-standard encryption to protect your data, and we never share your personal information with third parties." },
                  { q: "Do I need any special equipment?", a: "No special equipment is needed. Our assessments are questionnaire-based and can be completed from any device." }
                ].map((item, index) => (
                  <div key={index} className="accordion-item border-0 mb-3 shadow-sm rounded-3 overflow-hidden">
                    <h3 className="accordion-header" id={`heading${index}`}>
                      <button className="accordion-button collapsed fw-bold bg-white" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false">
                        {item.q}
                      </button>
                    </h3>
                    <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body bg-white text-muted">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section >
    </>
  );
};

export default Home;