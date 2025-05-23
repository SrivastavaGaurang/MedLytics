import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Doctors = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Doctors data with Indian names
  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "Sleep Medicine Specialist",
      description: "Board-certified sleep medicine specialist with over 12 years of experience in diagnosing and treating sleep disorders. Dr. Sharma collaborates with our AI team to validate our sleep disorder analysis algorithm and ensure accurate sleep pattern assessments.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1747958278/AdobeStock_632907942_Preview_f1ssdb.jpg",
      education: "MD, All India Institute of Medical Sciences (AIIMS), Delhi",
      experience: "12+ years",
      focus: "Sleep Disorders & Sleep Pattern Analysis"
    },
    {
      id: 2,
      name: "Dr. Arjun Patel",
      specialty: "Psychiatrist",
      description: "Dr. Patel specializes in anxiety and depression treatment with a focus on integrating technology into mental healthcare. He helps ensure our mental health predictions are clinically relevant and provides expert validation for our psychological assessment algorithms.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1747958278/AdobeStock_632907942_Preview_f1ssdb.jpg",
      education: "MD Psychiatry, Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh",
      experience: "15+ years",
      focus: "Anxiety & Depression Prediction"
    },
    {
      id: 3,
      name: "Dr. Kavita Nair",
      specialty: "Clinical Nutritionist & BMI Specialist",
      description: "As a dietitian and nutritional medicine expert, Dr. Nair brings valuable insights to our nutritional analysis and BMI prediction algorithms. She ensures our tools provide scientifically sound dietary recommendations and accurate body weight management guidance.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1747958278/AdobeStock_632907942_Preview_f1ssdb.jpg",
      education: "Ph.D. in Nutritional Sciences, National Institute of Nutrition, Hyderabad",
      experience: "10+ years",
      focus: "Clinical Nutrition & BMI Prediction"
    },
    {
      id: 4,
      name: "Dr. Rajesh Kumar",
      specialty: "Neurologist",
      description: "Dr. Kumar's expertise in neurology helps inform our sleep and mental health assessment tools. He specializes in the relationship between neurological health, sleep patterns, and their impact on overall wellness and body metabolism.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1747958278/AdobeStock_632907942_Preview_f1ssdb.jpg",
      education: "MD Neurology, Christian Medical College (CMC), Vellore",
      experience: "18+ years",
      focus: "Neurological Health & Sleep-Brain Connection"
    },
    {
      id: 5,
      name: "Dr. Sneha Gupta",
      specialty: "Clinical Psychologist",
      description: "With extensive experience in psychological assessments, Dr. Gupta helps validate our anxiety and depression prediction models to ensure they align with clinical standards. She also contributes to understanding the psychological aspects of weight management.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1747958278/AdobeStock_632907942_Preview_f1ssdb.jpg",
      education: "Psy.D., National Institute of Mental Health and Neurosciences (NIMHANS), Bangalore",
      experience: "14+ years",
      focus: "Psychological Assessment & Behavioral Analysis"
    },
    {
      id: 6,
      name: "Dr. Vikram Singh",
      specialty: "Data Science Lead & Health Informatics",
      description: "Dr. Singh bridges the gap between medicine and technology. With dual expertise in machine learning and health informatics, he oversees the development of our prediction algorithms including sleep, mental health, and BMI analysis systems.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1747958278/AdobeStock_632907942_Preview_f1ssdb.jpg",
      education: "Ph.D. in Computer Science, Indian Institute of Technology (IIT) Bombay",
      experience: "9+ years",
      focus: "Healthcare AI & Predictive Analytics"
    }
  ];

  return (
    <>
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div 
          className="modal fade show d-block" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999 
          }}
          tabIndex="-1" 
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              {/* Header with gradient background */}
              <div 
                className="modal-header border-0 text-white position-relative" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '2rem'
                }}
              >
                <div className="text-center w-100">
                  <div className="mb-3">
                    <i className="bi bi-info-circle-fill" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="modal-title fw-bold mb-0">
                    Important Disclaimer
                  </h4>
                </div>
              </div>
              
              {/* Body */}
              <div className="modal-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h5 className="text-primary mb-3">Demo Content Notice</h5>
                  <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-exclamation-triangle-fill text-warning me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div className="text-start">
                        <p className="mb-2 fw-semibold">Please note that all doctor profiles, credentials, and information displayed on this page are <strong>fictional and created for demonstration purposes only</strong>.</p>
                        <p className="mb-0 small text-muted">
                          • Doctor names, photos, and qualifications are not real<br/>
                          • Educational backgrounds and experience details are simulated<br/>
                          • This content showcases the platform's design and functionality<br/>
                          • No actual medical professionals are associated with these profiles
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-4">
                    <i className="bi bi-shield-check text-success" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h6 className="text-success mb-3">Our Commitment to Transparency</h6>
                  <p className="text-muted mb-4">
                    At MedLytics, we believe in complete transparency. This demonstration page shows how we would present our medical advisory team in a real-world scenario, ensuring you understand exactly what to expect from our platform.
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="modal-footer border-0 justify-content-center" style={{ padding: '1.5rem 2rem 2rem' }}>
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg px-5 shadow-sm" 
                  onClick={() => setShowDisclaimer(false)}
                  style={{ borderRadius: '25px' }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  I Understand, Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-info text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">Our Medical Experts</h1>
              <p className="lead mb-4">
                Meet the healthcare professionals who validate our AI technology and ensure clinical accuracy across all health analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow-sm mb-5" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  <h2 className="mb-4 text-primary">Medical Expertise Behind MedLytics</h2>
                  <p className="lead mb-4">
                    At MedLytics, we believe that technology and medical expertise must work hand in hand. Our AI-driven health analytics are developed and validated by experienced healthcare professionals from diverse specialties across India's premier medical institutions.
                  </p>
                  <p className="mb-3">
                    Our medical team collaborates closely with our data scientists and engineers to ensure that:
                  </p>
                  <ul className="mb-4">
                    <li className="mb-2">Our algorithms are grounded in clinical evidence and best practices</li>
                    <li className="mb-2">Health predictions are accurate and reliable for diverse populations</li>
                    <li className="mb-2">Recommendations align with current medical guidelines and Indian healthcare standards</li>
                    <li className="mb-2">Ethical considerations are prioritized in all our tools</li>
                    <li className="mb-2">Cultural and demographic factors are considered in our analysis</li>
                  </ul>
                  <p>
                    Each of our medical experts brings specialized knowledge that directly informs one or more of our health analytics services. From sleep medicine to mental health, nutrition, and BMI management, our doctors ensure that MedLytics delivers trustworthy health insights tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold text-primary">Meet Our Doctors</h2>
            <p className="lead text-muted">
              The specialists who ensure our health analytics are clinically accurate and culturally relevant
            </p>
          </div>
          
          <div className="row g-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={(doctor.id - 1) * 100}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="text-center mb-4">
                      <div className="rounded-circle mx-auto mb-3 overflow-hidden border border-3 border-primary" style={{ width: '150px', height: '150px' }}>
                        <img src={doctor.image} alt={doctor.name} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} />
                      </div>
                      <h5 className="card-title mb-1 text-primary fw-bold">{doctor.name}</h5>
                      <p className="text-info mb-3 fw-semibold">{doctor.specialty}</p>
                    </div>
                    <p className="card-text mb-4 text-muted">
                      {doctor.description}
                    </p>
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <strong className="text-dark">Education:</strong>
                        <span className="text-muted text-end" style={{ fontSize: '0.9rem' }}>{doctor.education}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <strong className="text-dark">Experience:</strong>
                        <span className="text-muted">{doctor.experience}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong className="text-dark">Focus Area:</strong>
                        <span className="text-muted text-end" style={{ fontSize: '0.9rem' }}>{doctor.focus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="display-6 fw-bold mb-4 text-primary">Our Collaborative Approach</h2>
              <p className="mb-4">
                At MedLytics, we believe that the most effective healthcare technology combines medical expertise with advanced analytics. Our doctors work closely with our technology team through every step of development, ensuring our solutions are both innovative and clinically sound.
              </p>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Research-Based Development</h5>
                  <p className="text-muted">Our medical team reviews the latest international and Indian research to ensure our algorithms reflect current scientific understanding</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Clinical Validation</h5>
                  <p className="text-muted">Each of our predictive models undergoes rigorous testing and validation by relevant specialists from top medical institutions</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Continuous Improvement</h5>
                  <p className="text-muted">Our doctors regularly review user outcomes and latest medical guidelines to refine and improve our algorithms</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="card bg-white border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h4 className="mb-4 text-primary">Specialized Medical Input</h4>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-moon-stars text-primary fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Sleep Disorder Analysis</h5>
                      <p className="text-muted mb-0 small">Guided by Dr. Priya Sharma, Sleep Medicine Specialist</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                      <i className="bi bi-heart-pulse text-info fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Anxiety Prediction</h5>
                      <p className="text-muted mb-0 small">Overseen by Dr. Arjun Patel and Dr. Sneha Gupta</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <i className="bi bi-emoji-frown text-warning fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Depression Prediction</h5>
                      <p className="text-muted mb-0 small">Validated by Dr. Arjun Patel and Dr. Sneha Gupta</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i className="bi bi-calculator text-success fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">BMI Prediction</h5>
                      <p className="text-muted mb-0 small">Developed with Dr. Kavita Nair, Clinical Nutritionist & BMI Specialist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-primary">Our Medical Team's Impact</h2>
            <p className="lead text-muted">Numbers that reflect our commitment to quality healthcare analytics</p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-primary">98%</h2>
                <p className="text-muted mb-0">Clinical Accuracy</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-success">50+</h2>
                <p className="text-muted mb-0">Years Combined Experience</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-info">4</h2>
                <p className="text-muted mb-0">Validated Health Services</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h2 className="display-4 fw-bold text-warning">6</h2>
                <p className="text-muted mb-0">Medical Specialists</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-info text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="mb-4">Experience Expert-Backed Health Analytics</h2>
              <p className="lead mb-4">
                Get personalized health insights developed and validated by medical professionals from India's top medical institutions
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/sleep-disorder" className="btn btn-light btn-lg shadow">
                  Try Sleep Analysis
                </Link>
                <Link to="/bmi-prediction" className="btn btn-outline-light btn-lg">
                  Check BMI Analysis
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;