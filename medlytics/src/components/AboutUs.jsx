// src/pages/About.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  // State to determine if images should be displayed or default icons
  const [showImages, setShowImages] = useState(true);

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Toggle between images and icons
  const toggleImageDisplay = () => {
    setShowImages(!showImages);
  };

  return (
    <>
      {/* Hero Section - Enhanced with parallax effect */}
      <section
        className="text-white py-5 position-relative d-flex align-items-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 123, 255, 0.85), rgba(0, 123, 255, 0.95)), url(https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818725/Doctor_ixnlix.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "50vh"
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-3 fw-bold mb-4">About Medlytics</h1>
              <p className="lead fs-3 mb-4">
                Empowering individuals with AI-driven health analytics for better wellness decisions
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Updated with card styling and icons */}
      <section className="section-padding-md bg-gradient-section">
        <div className="container max-content-width">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow-lg rounded-lg mb-5" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="bi bi-heart-pulse-fill text-white fs-4"></i>
                    </div>
                    <h2 className="mb-0 text-primary">Our Mission</h2>
                  </div>

                  <p className="lead mb-4">
                    At Medlytics, we believe that personalized health insights should be accessible to everyone. Our mission is to combine cutting-edge AI technology with medical expertise to provide users with actionable health insights.
                  </p>

                  <div className="bg-light p-4 rounded-3 mb-4">
                    <h4 className="text-primary mb-3">The Problem We're Solving</h4>
                    <p className="mb-0">
                      The youth population presents increasing numbers of mental health conditions including depression due to academic distress, social alienation, and overuse of digital technology. Young individuals often avoid seeking treatment because of social stigma or insufficient knowledge about psychological conditions, leading to condition deterioration. Untreated depression can trigger serious consequences including self-harm, substance use, and suicide. Additionally, patients usually rely on self-assessment when reporting symptoms to doctors, which is problematic for identifying conditions in their early stages.
                    </p>
                  </div>

                  <div className="bg-light p-4 rounded-3 mb-4">
                    <h4 className="text-primary mb-3">Our Technological Approach</h4>
                    <p className="mb-0">
                      Machine learning algorithms provide an effective way to detect depression by analyzing behavioral and physiological indicators. Decision Tree, Logistic Regression, and Random Forest algorithms analyze big data from social media activity, wearable device health data, and voice patterns to recognize patterns associated with depression. These ML techniques empower mental health practitioners to initiate early intervention, potentially preventing mental health conditions from developing into severe crises.
                    </p>
                  </div>

                  <div className="bg-light p-4 rounded-3 mb-4">
                    <h4 className="text-primary mb-3">Research Findings</h4>
                    <p className="mb-0">
                      Our research demonstrates the ability to detect youth depression through analysis of psychological symptoms, lifestyle elements, and physical measurements. Random Forest achieved better performance than other methods, showing that ensemble learning approaches boost predictive accuracy. Stress levels, sleep quality, and anxiety measurements serve as key predictors, confirming the value of multi-tiered data monitoring.
                    </p>
                  </div>

                  <div className="bg-light p-4 rounded-3">
                    <h4 className="text-primary mb-3">Future Direction</h4>
                    <p className="mb-0">
                      We're working to overcome current limitations by implementing real-time monitoring capabilities and more diverse data collection. We are developing seamless integration with IoT devices such as smartwatches, fitness trackers, and health monitoring sensors to provide continuous health monitoring. These devices will track vital signs, sleep patterns, physical activity, and stress levels in real-time, enabling more accurate predictions and timely interventions. Our IoT ecosystem will include features like automatic medication reminders, emergency alerts to healthcare providers, and personalized wellness recommendations based on continuous data streams. Evaluative studies are underway to incorporate ongoing technology-induced observation and advanced AI systems for superior predictive capabilities. We prioritize ethical requirements including privacy protection and fair AI models. Our goal is to revolutionize mental healthcare through data-driven methodologies, enabling preventative assistance to at-risk young individuals through collaboration between AI researchers and mental health professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Updated with horizontal layout for all team members */}
      <section className="section-padding-md bg-light">
        <div className="container max-content-width">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="badge bg-primary px-3 py-2 mb-2">The Experts</span>
            <h2 className="display-4 fw-bold text-primary">Our Team</h2>
            <p className="lead text-muted max-text-width">
              Meet the innovative minds behind Medlytics who combine expertise in healthcare, technology, and user experience to deliver impactful health solutions
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="0">
              <div className="card h-100 shadow-sm border-0 team-card">
                <div className="card-body text-center p-4 d-flex flex-column">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1747418069/WhatsApp_Image_2025-05-16_at_23.01.31_58ea47ee_mya8h1.jpg" alt="Satyam" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                      <i className="bi bi-lightbulb-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Satyam</h5>
                  <p className="text-muted mb-3">Research Lead</p>
                  <p className="card-text small flex-grow-1">
                    Machine learning expert leading research on healthcare prediction models.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <a href="#" className="social-icon mx-2"><i className="bi bi-linkedin text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-github text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-envelope-fill text-primary fs-5"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 shadow-sm border-0 team-card">
                <div className="card-body text-center p-4 d-flex flex-column">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1747418070/WhatsApp_Image_2025-05-16_at_10.13.36_686ea2b8_d9cnch.jpg" alt="Aman Deep" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                      <i className="bi bi-graph-up-arrow fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Aman Deep</h5>
                  <p className="text-muted mb-3">Research Lead</p>
                  <p className="card-text small flex-grow-1">
                    Clinical psychology expert translating research into practical applications.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <a href="#" className="social-icon mx-2"><i className="bi bi-linkedin text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-twitter text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-envelope-fill text-primary fs-5"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3" data-aos="fade-up" data-aos-delay="400">
              <div className="card h-100 shadow-sm border-0 team-card">
                <div className="card-body text-center p-4 d-flex flex-column">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1747418069/WhatsApp_Image_2025-05-16_at_21.11.54_6873b369_rt2xla.jpg" alt="Bharat" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                      <i className="bi bi-palette-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Bharat</h5>
                  <p className="text-muted mb-3">User Experience Director</p>
                  <p className="card-text small flex-grow-1">
                    Creating intuitive interfaces for easy understanding of complex health data.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <a href="#" className="social-icon mx-2"><i className="bi bi-linkedin text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-dribbble text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-envelope-fill text-primary fs-5"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3" data-aos="fade-up" data-aos-delay="600">
              <div className="card h-100 shadow-sm border-0 team-card">
                <div className="card-body text-center p-4 d-flex flex-column">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1746040208/ChatGPT_Image_Apr_1_2025_03_33_51_AM_xgki5n.png" alt="Gaurang Srivastav" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                      <i className="bi bi-code-slash fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Gaurang Srivastav</h5>
                  <p className="text-muted mb-3">Site Developer</p>
                  <p className="card-text small flex-grow-1">
                    Full-stack developer architecting the technical foundation of Medlytics.
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <a href="#" className="social-icon mx-2"><i className="bi bi-linkedin text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-github text-primary fs-5"></i></a>
                    <a href="#" className="social-icon mx-2"><i className="bi bi-envelope-fill text-primary fs-5"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Developer Spotlight Section - Enhanced styling */}
      <section className="section-padding-md bg-gradient-section">
        <div className="container max-content-width">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0 text-center" data-aos="fade-right">
              {showImages ? (
                <div className="position-relative">
                  <div className="rounded-circle bg-white shadow-lg mx-auto overflow-hidden" style={{ width: '300px', height: '300px', border: '8px solid #ffffff' }}>
                    <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1746040173/WhatsApp_Image_2025-03-18_at_13.28.26_cede9a8b_xk7i6a.jpg" alt="Gaurang Srivastav" className="img-fluid" />
                  </div>
                  <div className="position-absolute top-100 start-50 translate-middle">
                    <span className="badge bg-primary rounded-pill py-2 px-4 fs-6 shadow">Full Stack Developer</span>
                  </div>
                </div>
              ) : (
                <div className="position-relative">
                  <div className="rounded-circle bg-white shadow-lg mx-auto d-flex align-items-center justify-content-center" style={{ width: '300px', height: '300px', border: '8px solid #ffffff' }}>
                    <i className="bi bi-code-slash display-1 text-primary"></i>
                  </div>
                  <div className="position-absolute top-100 start-50 translate-middle">
                    <span className="badge bg-primary rounded-pill py-2 px-4 fs-6 shadow">Full Stack Developer</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-7" data-aos="fade-left">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h2 className="display-5 fw-bold text-primary mb-4">Meet the Developer</h2>
                <h4 className="mb-3">Gaurang Srivastav</h4>
                <p className="lead mb-4">
                  The entire Medlytics platform was designed, developed, and deployed by Gaurang Srivastav, a passionate full-stack developer with expertise in healthcare technology and AI-driven applications.
                </p>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-laptop text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Frontend Development</h6>
                        <p className="text-muted mb-0 small">React, HTML, CSS, JavaScript</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-server text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Backend Development</h6>
                        <p className="text-muted mb-0 small">Node.js, Express, MongoDB</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-bar-chart text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Frontend Frameworks</h6>
                        <p className="text-muted mb-0 small">Bootstrap, Tailwind CSS, Material UI, Ionic</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-shield-check text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Security & DevOps</h6>
                        <p className="text-muted mb-0 small">AWS, Docker</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-braces text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Machine Learning</h6>
                        <p className="text-muted mb-0 small">PyTorch</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-database text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Data Processing</h6>
                        <p className="text-muted mb-0 small">Pandas, NumPy</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mb-0">
                  With a passion for creating technology that improves lives, Gaurang combined his expertise in full-stack development and machine learning to build Medlytics from the ground up. His vision was to create a platform that makes health analytics accessible to everyone while maintaining the highest standards of security and user experience. His dedication to continuous learning and improving the platform ensures that Medlytics stays at the forefront of health technology innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Section - Enhanced with better visual elements */}
      <section className="section-padding-md bg-light">
        <div className="container max-content-width">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="badge bg-primary px-3 py-2 mb-2">Innovation</span>
            <h2 className="display-4 fw-bold text-primary">Our Technology</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Advanced AI systems working for your mental health and wellness
            </p>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-4 text-primary">Cutting-Edge Solutions</h3>
                  <p className="mb-4">
                    Medlytics uses advanced machine learning algorithms trained on extensive mental health and sleep disorder datasets to provide accurate risk assessments and personalized recommendations.
                  </p>
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <div className="rounded-circle bg-success bg-opacity-10 p-2">
                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">Evidence-Based Analysis</h5>
                      <p className="text-muted">Our models are trained on clinical data and validated with healthcare professionals for maximum accuracy</p>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <div className="rounded-circle bg-success bg-opacity-10 p-2">
                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">Privacy-First Approach</h5>
                      <p className="text-muted">Your health data is encrypted end-to-end and never shared without your explicit consent</p>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <div className="rounded-circle bg-success bg-opacity-10 p-2">
                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">Continuous Learning</h5>
                      <p className="text-muted">Our algorithms improve over time through federated learning techniques to provide increasingly accurate insights</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="me-3">
                      <div className="rounded-circle bg-success bg-opacity-10 p-2">
                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">Multi-Source Integration</h5>
                      <p className="text-muted">Seamlessly combines data from wearable devices, self-assessments, and behavioral patterns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="card bg-white border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h4 className="mb-4 text-primary text-center">Our Analytics Capabilities</h4>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Sleep Pattern Analysis</h6>
                      <span className="badge bg-primary rounded-pill">90%</span>
                    </div>
                    <div className="progress" style={{ height: '15px', borderRadius: '10px' }}>
                      <div className="progress-bar bg-primary" role="progressbar" style={{ width: '90%', borderRadius: '10px' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="text-muted mt-2 small">Analyzing sleep cycles, patterns, and disturbances to identify risk factors</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Anxiety Prediction Analysis</h6>
                      <span className="badge bg-success rounded-pill">85%</span>
                    </div>
                    <div className="progress" style={{ height: '15px', borderRadius: '10px' }}>
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: '85%', borderRadius: '10px' }} aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="text-muted mt-2 small">Identifying anxiety patterns through behavioral and physiological markers</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Depression Prediction Analysis</h6>
                      <span className="badge bg-warning rounded-pill">75%</span>
                    </div>
                    <div className="progress" style={{ height: '15px', borderRadius: '10px' }}>
                      <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%', borderRadius: '10px' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="text-muted mt-2 small">Early detection of depression through multi-factorial analysis</p>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">BMI Prediction Analysis</h6>
                      <span className="badge bg-info rounded-pill">95%</span>
                    </div>
                    <div className="progress" style={{ height: '15px', borderRadius: '10px' }}>
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: '95%', borderRadius: '10px' }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="text-muted mt-2 small">Analyzing body mass index trends and their correlation with mental health patterns, lifestyle factors, and overall wellness indicators to provide comprehensive health insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Added Testimonials Section */}
      <section className="section-padding-md bg-gradient-section">
        <div className="container max-content-width">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="badge bg-primary px-3 py-2 mb-2">Success Stories</span>
            <h2 className="display-4 fw-bold text-primary">User Testimonials</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              See how Medlytics has helped people take control of their mental health and wellness
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up">
              <div className="card h-100 border-0 shadow-sm testimonial-card">
                <div className="card-body p-4">
                  <div className="d-flex mb-4">
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning fs-5"></i>
                  </div>
                  <p className="mb-4">
                    "As a college student dealing with anxiety, Medlytics has been a game-changer. The sleep analysis helped me understand how my poor sleep patterns were affecting my mental health, and the personalized recommendations have genuinely improved my wellbeing."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Anika sha.</h6>
                      <p className="text-muted mb-0 small">University Student, 21</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 border-0 shadow-sm testimonial-card">
                <div className="card-body p-4">
                  <div className="d-flex mb-4">
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-half text-warning fs-5"></i>
                  </div>
                  <p className="mb-4">
                    "I was skeptical about an AI-based approach to mental health, but Medlytics surprised me. The depression prediction tool detected early warning signs that I hadn't noticed myself, and I was able to seek help before things got worse."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Aryan Dubey</h6>
                      <p className="text-muted mb-0 small">IT Professional, 28</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <div className="card h-100 border-0 shadow-sm testimonial-card">
                <div className="card-body p-4">
                  <div className="d-flex mb-4">
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning me-1 fs-5"></i>
                    <i className="bi bi-star-fill text-warning fs-5"></i>
                  </div>
                  <p className="mb-4">
                    "As a healthcare professional, I appreciate how Medlytics combines scientific rigor with user-friendly design. I've recommended it to several of my younger patients who are more comfortable with digital tools than traditional therapy approaches."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Dr. Ram Pandey</h6>
                      <p className="text-muted mb-0 small">Clinical Psychologist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced with better styling */}
      <section className="py-5 position-relative text-white" style={{
        backgroundImage: "linear-gradient(rgba(0, 123, 255, 0.9), rgba(0, 123, 255, 0.9)), url('https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818725/Doctor_ixnlix.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-4 fw-bold mb-4">Ready to take control of your health?</h2>
              <p className="lead fs-4 mb-4">
                Join thousands of users who have gained valuable insights into their mental health and sleep patterns
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/sleep-disorder" className="btn btn-light btn-lg shadow fw-bold px-4">
                  <i className="bi bi-heart-pulse me-2"></i> Sleep Analysis
                </Link>
                <Link to="/anxiety-prediction" className="btn btn-light btn-lg shadow fw-bold px-4">
                  <i className="bi bi-heart-pulse me-2"></i> Anxiety Prediction
                </Link>
                <Link to="/depression-prediction" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-heart-pulse me-2"></i> Depression Prediction
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Added FAQ Section */}
      <section className="section-padding-md bg-light">
        <div className="container max-content-width">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="badge bg-primary px-3 py-2 mb-2">Questions</span>
            <h2 className="display-4 fw-bold text-primary">Frequently Asked Questions</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Find answers to common questions about our platform and technology
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-10 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border-0 mb-3 shadow-sm" data-aos="fade-up">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      How accurate are Medlytics' predictions?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Our machine learning models have been trained on diverse datasets and validated against clinical standards. The accuracy varies by analysis type, with our sleep pattern and nutritional analysis achieving over 90% accuracy in controlled tests. However, we always emphasize that our tools are meant to supplement, not replace, professional medical advice.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Is my health data secure on Medlytics?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Absolutely. We employ end-to-end encryption for all user data and follow HIPAA-compliant protocols. Your personal health information is never shared with third parties without your explicit consent. Our systems undergo regular security audits to ensure the highest standards of data protection.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Can Medlytics integrate with my wearable devices?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes! Medlytics can integrate with popular wearable devices including Apple Watch, Fitbit, Samsung Galaxy Watch, and Oura Ring. These integrations allow for more accurate sleep tracking, heart rate monitoring, and activity data collection, which enhances the precision of our analytics and recommendations.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm" data-aos="fade-up" data-aos-delay="300">
                  <h2 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      How does Medlytics handle different cultural contexts for mental health?
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We recognize that mental health expressions and experiences vary across cultures. Our research team includes experts from diverse backgrounds, and our algorithms are trained on globally diverse datasets. We continuously refine our models to account for cultural differences in how mental health symptoms manifest and are reported.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm" data-aos="fade-up" data-aos-delay="400">
                  <h2 className="accordion-header" id="headingFive">
                    <button className="accordion-button collapsed bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                      What should I do if Medlytics indicates I might have a mental health condition?
                    </button>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      If our analysis suggests you may be at risk for a mental health condition, we recommend consulting with a qualified healthcare professional. Medlytics provides a list of resources and can help you locate mental health providers in your area. Remember that our tools are designed for early detection and awareness, not for clinical diagnosis.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Added Custom CSS for hover effects */}
      <style>{`
        .team-card:hover {
          transform: translateY(-10px);
          transition: transform 0.3s ease;
        }
        
        .testimonial-card:hover {
          transform: scale(1.03);
          transition: transform 0.3s ease;
        }
        
        .social-icon:hover {
          transform: scale(1.2);
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default About;