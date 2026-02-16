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
      {/* Hero Section with Carousel */}
      <div className="position-relative overflow-hidden" style={{ minHeight: '650px', height: '85vh', maxHeight: '800px' }}>
        {/* Enhanced gradient overlay for better text readability */}
        <div
          className="overlay-gradient position-absolute w-100 h-100"
          style={{
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        ></div>

        <Slider {...settings}>
          <div>
            <img src={heroSleep} alt="Sleep Health" className="w-100" style={{ height: '85vh', maxHeight: '800px', minHeight: '650px', objectFit: 'cover' }} />
          </div>
          <div>
            <img src={heroMedical} alt="Healthcare Professionals" className="w-100" style={{ height: '85vh', maxHeight: '800px', minHeight: '650px', objectFit: 'cover' }} />
          </div>
          <div>
            <img src={heroNutrition} alt="Nutrition" className="w-100" style={{ height: '85vh', maxHeight: '800px', minHeight: '650px', objectFit: 'cover' }} />
          </div>
          <div>
            <img src={heroMental} alt="Mental Wellness" className="w-100" style={{ height: '85vh', maxHeight: '800px', minHeight: '650px', objectFit: 'cover' }} />
          </div>
        </Slider>

        {/* Hero Content Overlay - Enhanced */}
        <div
          className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3"
          style={{ zIndex: 2 }}
        >
          <div
            className="hero-glass-card p-5 d-inline-block animate-float"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              maxWidth: '900px'
            }}
          >
            {/* Main Heading with better hierarchy */}
            <h1
              className="fw-bold mb-4 text-white"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              MedLytics AI
            </h1>

            {/* Typing text animation */}
            <div className="mb-4" style={{ minHeight: '60px' }}>
              <TypingText />
            </div>

            {/* Subheading with better contrast */}
            <p
              className="lead mb-5"
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                fontWeight: '400',
                maxWidth: '700px',
                margin: '0 auto 2rem',
                lineHeight: '1.6'
              }}
            >
              Advanced health analytics powered by AI for personalized wellness insights
            </p>

            {/* CTA Buttons - Enhanced */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link
                to="/sleep-disorder"
                className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold"
                style={{
                  background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(67, 97, 238, 0.5)',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                Start Analysis
              </Link>
              <Link
                to="/about"
                className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold"
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

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
                <div className="glass-card p-4 h-100 animate-pulse" style={{ animationDelay: `${index * 0.5}s` }}>
                  <h2 className={`display-4 fw-bold text-${stat.color}`}>{stat.value}</h2>
                  <p className="text-muted mb-0 fw-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding-md bg-gradient-section position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0 p-5 opacity-10">
          <i className="bi bi-activity text-primary display-1"></i>
        </div>
        <div className="container max-content-width position-relative">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">OUR EXPERTISE</span>
            <h2 className="display-5 fw-bold mb-3">Comprehensive Health Services</h2>
            <p className="lead text-muted max-text-width">
              Powered by advanced machine learning algorithms to provide accurate health predictions.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <div key={service.id} className="col-lg-6 col-md-6">
                <div className="glass-card h-100 p-4 position-relative overflow-hidden group-hover">
                  <div className="position-absolute top-0 end-0 p-3 opacity-10">
                    <i className={`bi ${service.icon} display-1 text-${service.color}`}></i>
                  </div>
                  <div className="d-flex align-items-start mb-4">
                    <div className="rounded-2xl p-3 text-white me-3 shadow-md" style={{ background: service.gradient }}>
                      {service.id === 1 ? (
                        <img src={iconSleep} alt="Sleep Icon" style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />
                      ) : (
                        <i className={`bi ${service.icon} fs-3`}></i>
                      )}
                    </div>
                    <div>
                      <h3 className="h4 fw-bold mb-2">{service.title}</h3>
                      <p className="text-muted mb-0">{service.description}</p>
                    </div>
                  </div>
                  <Link to={service.link} className={`btn btn-outline-${service.color} rounded-pill w-100 fw-bold`}>
                    Explore Service <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
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
      </section>

      {/* Testimonials Section */}
      <section className="section-padding-md">
        <div className="container max-content-width">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">User Success Stories</h2>
          </div>

          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-lg-4 col-md-6">
                <div className="glass-card h-100 p-4 position-relative">
                  <i className="bi bi-quote display-1 text-primary opacity-10 position-absolute top-0 start-0 ms-3"></i>
                  <div className="mb-3 position-relative">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="card-text mb-4 fst-italic position-relative">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="d-flex align-items-center border-top pt-3">
                    <div className="rounded-circle bg-gradient-medical text-white d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: "50px", height: "50px", fontSize: "1.2rem", fontWeight: "bold" }}>
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{testimonial.author}</h6>
                      <small className="text-primary">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding-md position-relative overflow-hidden">
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
      </section>

      {/* FAQ Section */}
      <section className="section-padding-md bg-gradient-section">
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
      </section>
    </>
  );
};

export default Home;