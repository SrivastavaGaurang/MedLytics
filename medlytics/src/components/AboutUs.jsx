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
  }, []);

  // Toggle between images and icons
  const toggleImageDisplay = () => {
    setShowImages(!showImages);
  };

  return (
    <>
      {/* Hero Section - Updated with new color scheme */}
      <section className="bg-info text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">About Medlytics</h1>
              <p className="lead mb-4">
                Empowering individuals with AI-driven health analytics for better wellness decisions
              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Updated styling */}
      <section className="py-5 " style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow-sm mb-5" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  <h2 className="mb-4 text-primary">Our Mission</h2>
                  <p className="lead mb-4">
                    At Medlytics, we believe that personalized health insights should be accessible to everyone. Our mission is to combine cutting-edge AI technology with medical expertise to provide users with actionable health insights.
                  </p>
                  <p className="mb-0">
                    The youth population presents increasing numbers of mental health conditions including depression thanks to academic distress combined with social alienation and overuse of digital technology. Young individuals avoid seeking treatment because they face either social discrimination or insufficient knowledge regarding psychological conditions leading to condition deterioration. Depression untreated can trigger various serious consequences up to deadly outcomes like self-harm, substance use and suicide. Patients usually rely on self-assessment of their symptoms when reporting to doctors which proves problematic for identifying cases in their early stages.
                  </p>
                  <p className="mb-0 mt-3">
                    Machine learning through its algorithms provides an effective way to detect depression arteries by analyzing behavioral and physiological indicators. Decision Tree along with Logistic Regression and Random Forest algorithms analyze big data consisting of social media activity and wearable device health data and voice patterns to recognize depressed people. The use of ML gives mental health practitioners the ability to initiate early intervention steps which might prevent mental health conditions from developing into severe crises.
                  </p>
                  <p className="mb-0 mt-3">
                    Using machine learning this research proves its ability to determine youth depression through analysis of psychological symptoms and lifestyle elements and physical measurements. Random Forest achieved better performance than Logistic Regression thus demonstrating ensemble learning approaches help boost predictive accuracy. Stress levels combined with sleep quality and anxiety measurements worked as main predictors that confirm the value of multitiered data monitoring.
                  </p>
                  <p className="mb-0 mt-3">
                    The promising achievements of this system face limitations because individuals self-report resulted and the monitoring process lacks real-time capabilities. Evaluative studies should include ongoing technology induced observation and artificial intelligence systems to access superior predictive capabilities. For proper mental health application deployment, the ethical requirements of both privacy protection and fair AI models need full consideration. The present investigation leads to developments in AI-driven early intervention systems which result in better youth mental health results.
                  </p>
                  <p className="mb-0 mt-3">
                    Diverse participants in databases and an increase in real-time wearable data will improve the efficacy and dependability of the model. AI researchers must work jointly with mental health professionals for the responsible execution of AI systems. Medical care for mental health will be revolutionized through data-driven methodologies which will enable the provision of preventative assistance to young individuals who are at risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Updated with more team members and animations */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold text-primary">Our Team</h2>
            <p className="lead text-muted">
              Meet the experts behind Medlytics
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="0">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1747418069/WhatsApp_Image_2025-05-16_at_23.01.31_58ea47ee_mya8h1.jpg" alt="sam" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-person-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">satyam </h5>
                  <p className="text-muted mb-3">Research Lead</p>
                  <p className="card-text">
                    lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores odit et accusamus totam molestias hic illo incidunt harum, saepe soluta, autem sit quisquam tenetur voluptatum ab similique rerum eos dolorem.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1747418070/WhatsApp_Image_2025-05-16_at_10.13.36_686ea2b8_d9cnch.jpg" alt="Aman Deep" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-person-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Aman Deep </h5>
                  <p className="text-muted mb-3"> Research Lead</p>
                  <p className="card-text">
                    lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores odit et accusamus totam molestias hic illo incidunt harum, saepe soluta, autem sit quisquam tenetur voluptatum ab similique rerum eos dolorem.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1747418069/WhatsApp_Image_2025-05-16_at_21.11.54_6873b369_rt2xla.jpg" alt="Bharat" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-person-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Bharat</h5>
                  <p className="text-muted mb-3">User Experience Director</p>
                  <p className="card-text">
                    lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores odit et accusamus totam molestias hic illo incidunt harum, saepe soluta, autem sit quisquam tenetur voluptatum ab similique rerum eos dolorem.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional team members */}
            <div className="col-md-6" data-aos="fade-up" data-aos-delay="600">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="/api/placeholder/150/150" alt="pawan" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-person-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Pawan</h5>
                  <p className="text-muted mb-3">Mental Health Specialist</p>
                  <p className="card-text">
                    lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores odit et accusamus totam molestias hic illo incidunt harum, saepe soluta, autem sit quisquam tenetur voluptatum ab similique rerum eos dolorem.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6" data-aos="fade-up" data-aos-delay="800">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  {showImages ? (
                    <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                      <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1746040208/ChatGPT_Image_Apr_1_2025_03_33_51_AM_xgki5n.png" alt="Gaurang Srivastav" className="img-fluid" />
                    </div>
                  ) : (
                    <div className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-person-fill fs-1 text-primary"></i>
                    </div>
                  )}
                  <h5 className="card-title mb-1">Gaurang Srivastav</h5>
                  <p className="text-muted mb-3">Site Developer</p>
                  <p className="card-text">
                    lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores odit et accusamus totam molestias hic illo incidunt harum, saepe soluta, autem sit quisquam tenetur voluptatum ab similique rerum eos dolorem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Spotlight Section - Single Developer */}
      <section className="py-5 bg-gradient-primary" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0 text-center" data-aos="fade-right">
              {showImages ? (
                <div className="position-relative">
                  <div className="rounded-circle bg-white shadow-lg mx-auto overflow-hidden" style={{ width: '280px', height: '280px', border: '8px solid #ffffff' }}>
                    <img src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1746040173/WhatsApp_Image_2025-03-18_at_13.28.26_cede9a8b_xk7i6a.jpg" alt="Gaurang Srivastav" className="img-fluid" />
                  </div>
                  <div className="position-absolute top-100 start-50 translate-middle">
                    <span className="badge bg-primary rounded-pill py-2 px-4 fs-6 shadow">Full Stack Developer</span>
                  </div>
                </div>
              ) : (
                <div className="position-relative">
                  <div className="rounded-circle bg-white shadow-lg mx-auto d-flex align-items-center justify-content-center" style={{ width: '280px', height: '280px', border: '8px solid #ffffff' }}>
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
                  The entire Medlytics platform was designed, developed, and deployed by Gaurang Srivastav, a passionate full-stack developer with expertise in healthcare technology.
                </p>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-laptop text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Frontend Development</h6>
                        <p className="text-muted mb-0 small">React, Html, Css, JavaScript</p>
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
                        <h6 className="mb-1">Framework</h6>
                        <p className="text-muted mb-0 small">Bootstrap, Tailwind CSS, Material UI, Ionic </p>
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
                </div>
                <p className="mb-0">
                  With a passion for creating technology that improves lives, David combined his expertise in full-stack development and machine learning to build Medlytics from the ground up. His vision was to create a platform that makes health analytics accessible to everyone while maintaining the highest standards of security and user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Section - Updated with new styling */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="display-6 fw-bold mb-4 text-primary">Our Technology</h2>
              <p className="mb-4">
                Medlytics uses advanced machine learning algorithms trained on extensive sleep disorder datasets to provide accurate risk assessments and personalized recommendations.
              </p>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Evidence-Based Analysis</h5>
                  <p className="text-muted">Our models are trained on clinical data and validated with healthcare professionals</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Privacy-First Approach</h5>
                  <p className="text-muted">Your health data is encrypted and never shared without your explicit consent</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Continuous Learning</h5>
                  <p className="text-muted">Our algorithms improve over time to provide increasingly accurate insights</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="card bg-white border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h4 className="mb-4 text-primary">Our Analytics Framework</h4>
                  <div className="progress mb-4" style={{ height: '25px' }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: '90%' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
                      Sleep Pattern Analysis
                    </div>
                  </div>
                  <div className="progress mb-4" style={{ height: '25px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '85%' }} aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                    Anxiety Prediction Analysis
                    </div>
                  </div>
                  <div className="progress mb-4" style={{ height: '25px' }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                    Depression Prediction Analysis
                    </div>
                  </div>
                  <div className="progress" style={{ height: '25px' }}>
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '95%' }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100">
                    Nutritional Prediction Analysis
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Updated with new styling */}
      <section className="py-5 bg-info text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="mb-4">Ready to analyze your sleep health?</h2>
              <p className="lead mb-4">
                Join thousands of users who have gained valuable insights into their sleep patterns
              </p>
              <div>
                <Link to="/sleep-disorder" className="btn btn-light btn-lg me-3 shadow">
                  Start Sleep Analysis
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;