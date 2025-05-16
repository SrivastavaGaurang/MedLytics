import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TypingText from "./TypingText";

const Home = () => {
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  // Services data
  const services = [
    {
      id: 1,
      title: "Sleep Disorder Analysis",
      description: "Get insights into your sleep patterns and receive personalized recommendations.",
      icon: "bi-moon-stars",
      link: "/sleep-disorder",
      color: "primary"
    },
    {
      id: 2,
      title: "Anxiety Prediction",
      description: "Our AI analyzes your responses to help identify anxiety patterns and provide early intervention.",
      icon: "bi-heart-pulse",
      link: "/anxiety-prediction",
      color: "info"
    },
    {
      id: 3,
      title: "Depression Prediction",
      description: "Advanced algorithms to detect early signs of depression through behavioral patterns.",
      icon: "bi-emoji-frown",
      link: "/depression-prediction",
      color: "warning"
    },
    {
      id: 4,
      title: "Nutritional Analysis",
      description: "Personalized nutritional guidance based on your unique health profile and goals.",
      icon: "bi-apple",
      link: "/nutritional-prediction",
      color: "success"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      text: "MedLytics helped me understand my sleep patterns and significantly improved my rest quality.",
      author: "Sarah J.",
      role: "Software Engineer"
    },
    {
      id: 2,
      text: "The anxiety prediction tool gave me insights I never would have recognized on my own. Truly life-changing.",
      author: "Michael T.",
      role: "Teacher"
    },
    {
      id: 3,
      text: "I've tried many health apps, but MedLytics offers analysis that's actually personalized and actionable.",
      author: "Priya K.",
      role: "Healthcare Professional"
    }
  ];

  return (
    <>
      {/* Hero Section with Carousel */}
      <div className="position-relative">
        <Slider {...settings}>
          {/* Slide 1 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818759/sleep_rig5bj.jpg"
              alt="Sleep Health"
              className="w-100"
              style={{ height: "600px", objectFit: "cover", filter: "brightness(0.7)" }}
            />
          </div>

          {/* Slide 2 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818725/Doctor_ixnlix.jpg"
              alt="Healthcare Professionals"
              className="w-100"
              style={{ height: "600px", objectFit: "cover", filter: "brightness(0.7)" }}
            />
          </div>

          {/* Slide 3 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818739/nutration_qaszvp.jpg"
              alt="Nutrition"
              className="w-100"
              style={{ height: "600px", objectFit: "cover", filter: "brightness(0.7)" }}
            />
          </div>

          {/* Slide 4 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818750/food2_oskiwj.jpg"
              alt="Healthy Food"
              className="w-100"
              style={{ height: "600px", objectFit: "cover", filter: "brightness(0.7)" }}
            />
          </div>

          {/* Slide 5 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818737/food_f8azyx.jpg"
              alt="Balanced Diet"
              className="w-100"
              style={{ height: "600px", objectFit: "cover", filter: "brightness(0.7)" }}
            />
          </div>

          {/* Slide 6 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818754/stress_i1ealz.jpg"
              alt="Mental Wellness"
              className="w-100"
              style={{ height: "600px", objectFit: "cover", filter: "brightness(0.7)" }}
            />
          </div>
        </Slider>

        {/* Hero Content Overlay */}
        <div
          className="position-absolute top-50 start-50 translate-middle text-center text-white w-75"
          style={{ zIndex: 2 }}
        >
          <TypingText />
          <p className="lead mb-4 fs-4">
            AI-powered health analytics for personalized wellness insights
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/sleep-disorder" className="btn btn-primary btn-lg">
              Try Sleep Analysis
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-primary">98%</h2>
                <p className="text-muted mb-0">Accuracy Rate</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-success">10k+</h2>
                <p className="text-muted mb-0">Users Helped</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-info">4</h2>
                <p className="text-muted mb-0">Health Services</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-warning">24/7</h2>
                <p className="text-muted mb-0">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Our Services</h2>
            <p className="lead text-muted">
              Comprehensive health analytics powered by AI technology
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <div key={service.id} className="col-lg-6 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className={`d-inline-flex align-items-center justify-content-center bg-${service.color} bg-opacity-10 p-3 rounded-circle mb-3`}>
                      <i className={`bi ${service.icon} fs-3 text-${service.color}`}></i>
                    </div>
                    <h3 className="card-title h4">{service.title}</h3>
                    <p className="card-text text-muted">{service.description}</p>
                    <Link to={service.link} className={`btn btn-outline-${service.color} mt-2`}>
                      Learn More <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">How It Works</h2>
            <p className="lead text-muted">Simple steps to better health insights</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="rounded-circle bg-primary text-white fs-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-1-circle-fill"></i>
                </div>
                <h3 className="h4">Create an Account</h3>
                <p className="text-muted">
                  Sign up in seconds to access our full suite of health analytics tools.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="rounded-circle bg-primary text-white fs-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-2-circle-fill"></i>
                </div>
                <h3 className="h4">Answer Questions</h3>
                <p className="text-muted">
                  Complete our scientifically designed questionnaires about your health.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="rounded-circle bg-primary text-white fs-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                  <i className="bi bi-3-circle-fill"></i>
                </div>
                <h3 className="h4">Get Personalized Insights</h3>
                <p className="text-muted">
                  Receive AI-generated analysis and recommendations tailored to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="/api/placeholder/600/400" 
                alt="Health Analytics Dashboard" 
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold mb-4">Why Choose MedLytics?</h2>
              
              <div className="d-flex mb-4">
                <div className="me-3">
                  <span className="badge rounded-pill bg-primary p-2">
                    <i className="bi bi-shield-check fs-5"></i>
                  </span>
                </div>
                <div>
                  <h4>Privacy-Focused</h4>
                  <p className="text-muted">Your health data is encrypted and never shared without your consent.</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="me-3">
                  <span className="badge rounded-pill bg-primary p-2">
                    <i className="bi bi-graph-up fs-5"></i>
                  </span>
                </div>
                <div>
                  <h4>Advanced Analytics</h4>
                  <p className="text-muted">Cutting-edge AI algorithms analyze your data to provide accurate insights.</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="me-3">
                  <span className="badge rounded-pill bg-primary p-2">
                    <i className="bi bi-person-check fs-5"></i>
                  </span>
                </div>
                <div>
                  <h4>Expert-Backed</h4>
                  <p className="text-muted">Our tools are developed in collaboration with healthcare professionals.</p>
                </div>
              </div>
              
              <div className="d-flex">
                <div className="me-3">
                  <span className="badge rounded-pill bg-primary p-2">
                    <i className="bi bi-lightning-charge fs-5"></i>
                  </span>
                </div>
                <div>
                  <h4>Real-Time Updates</h4>
                  <p className="text-muted">Get immediate feedback and track your progress over time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">What Our Users Say</h2>
            <p className="lead text-muted">Real stories from people who've used MedLytics</p>
          </div>

          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                      ))}
                    </div>
                    <p className="card-text mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                        <i className="bi bi-person-circle fs-4 text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">{testimonial.author}</h6>
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
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-2">Ready to gain health insights?</h2>
              <p className="lead mb-0">
                Join thousands of users who have improved their wellness with MedLytics.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/login" className="btn btn-light btn-lg me-2">
                Get Started
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Frequently Asked Questions</h2>
            <p className="lead text-muted">Answers to common questions about our services</p>
          </div>

          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border mb-3 shadow-sm">
                  <h3 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      How accurate are the health predictions?
                    </button>
                  </h3>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Our AI models have been trained on extensive datasets and validated with healthcare professionals. They offer up to 98% accuracy in predictions, though we always recommend consulting with healthcare providers for definitive diagnoses.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item border mb-3 shadow-sm">
                  <h3 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Is my health data secure?
                    </button>
                  </h3>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Absolutely. We use industry-standard encryption to protect your data, and we never share your personal information with third parties without your explicit consent. Your privacy is our top priority.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item border mb-3 shadow-sm">
                  <h3 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Do I need any special equipment for the assessments?
                    </button>
                  </h3>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      No special equipment is needed. Our assessments are questionnaire-based and can be completed from any device with internet access. For some advanced features, you can optionally connect wearable devices for more detailed analysis.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item border shadow-sm">
                  <h3 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      Can MedLytics replace medical consultations?
                    </button>
                  </h3>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      MedLytics is designed to complement, not replace, professional medical care. Our tools provide valuable insights and early detection of potential issues, but we always recommend consulting with healthcare professionals for diagnosis and treatment.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;