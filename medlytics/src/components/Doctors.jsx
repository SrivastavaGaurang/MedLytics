import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Doctors = () => {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Sleep Medicine Specialist",
      description: "Board-certified sleep medicine specialist with over 12 years of experience in diagnosing and treating sleep disorders. Dr. Johnson collaborates with our AI team to validate our sleep disorder analysis algorithm.",
      image: "https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818725/Doctor_ixnlix.jpg",
      education: "MD, Stanford University",
      experience: "12+ years",
      focus: "Sleep Disorders"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Psychiatrist",
      description: "Dr. Chen specializes in anxiety and depression treatment with a focus on integrating technology into mental healthcare. He helps ensure our mental health predictions are clinically relevant.",
      image: "/api/placeholder/400/400",
      education: "MD, Johns Hopkins University",
      experience: "15+ years",
      focus: "Anxiety & Depression"
    },
    {
      id: 3,
      name: "Dr. Priya Patel",
      specialty: "Clinical Nutritionist",
      description: "As a dietitian and nutritional medicine expert, Dr. Patel brings valuable insights to our nutritional analysis algorithms, ensuring they provide scientifically sound dietary recommendations.",
      image: "/api/placeholder/400/400",
      education: "Ph.D. in Nutritional Sciences, Cornell University",
      experience: "10+ years",
      focus: "Clinical Nutrition"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Neurologist",
      description: "Dr. Wilson's expertise in neurology helps inform our sleep and mental health assessment tools. He specializes in the relationship between neurological health and sleep patterns.",
      image: "/api/placeholder/400/400",
      education: "MD, University of California, San Francisco",
      experience: "18+ years",
      focus: "Neurological Health"
    },
    {
      id: 5,
      name: "Dr. Lisa Nguyen",
      specialty: "Clinical Psychologist",
      description: "With extensive experience in psychological assessments, Dr. Nguyen helps validate our anxiety and depression prediction models to ensure they align with clinical standards.",
      image: "/api/placeholder/400/400",
      education: "Psy.D., University of Michigan",
      experience: "14+ years",
      focus: "Psychological Assessment"
    },
    {
      id: 6,
      name: "Dr. Robert Martinez",
      specialty: "Data Science Lead",
      description: "Dr. Martinez bridges the gap between medicine and technology. With dual expertise in machine learning and health informatics, he oversees the development of our prediction algorithms.",
      image: "/api/placeholder/400/400",
      education: "Ph.D. in Computer Science, MIT",
      experience: "9+ years",
      focus: "Healthcare AI"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-info text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">Our Medical Experts</h1>
              <p className="lead mb-4">
                Meet the healthcare professionals who validate our AI technology and ensure clinical accuracy
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
                  <h2 className="mb-4 text-primary">Medical Expertise Behind Medlytics</h2>
                  <p className="lead mb-4">
                    At Medlytics, we believe that technology and medical expertise must work hand in hand. Our AI-driven health analytics are developed and validated by experienced healthcare professionals from diverse specialties.
                  </p>
                  <p className="mb-3">
                    Our medical team collaborates closely with our data scientists and engineers to ensure that:
                  </p>
                  <ul className="mb-4">
                    <li className="mb-2">Our algorithms are grounded in clinical evidence and best practices</li>
                    <li className="mb-2">Health predictions are accurate and reliable for diverse populations</li>
                    <li className="mb-2">Recommendations align with current medical guidelines</li>
                    <li className="mb-2">Ethical considerations are prioritized in all our tools</li>
                  </ul>
                  <p>
                    Each of our medical experts brings specialized knowledge that directly informs one or more of our health analytics services. From sleep medicine to mental health to nutrition, our doctors ensure that Medlytics delivers trustworthy health insights.
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
              The specialists who ensure our health analytics are clinically accurate
            </p>
          </div>
          
          <div className="row g-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={(doctor.id - 1) * 100}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="text-center mb-4">
                      <div className="rounded-circle mx-auto mb-3 overflow-hidden" style={{ width: '150px', height: '150px' }}>
                        <img src={doctor.image} alt={doctor.name} className="img-fluid" />
                      </div>
                      <h5 className="card-title mb-1">{doctor.name}</h5>
                      <p className="text-primary mb-3">{doctor.specialty}</p>
                    </div>
                    <p className="card-text mb-4">
                      {doctor.description}
                    </p>
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Education:</strong>
                        <span className="text-muted">{doctor.education}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Experience:</strong>
                        <span className="text-muted">{doctor.experience}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>Focus Area:</strong>
                        <span className="text-muted">{doctor.focus}</span>
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
                At Medlytics, we believe that the most effective healthcare technology combines medical expertise with advanced analytics. Our doctors work closely with our technology team through every step of development.
              </p>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Research-Based Development</h5>
                  <p className="text-muted">Our medical team reviews the latest research to ensure our algorithms reflect current scientific understanding</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Clinical Validation</h5>
                  <p className="text-muted">Each of our predictive models undergoes rigorous testing and validation by relevant specialists</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">Continuous Improvement</h5>
                  <p className="text-muted">Our doctors regularly review user outcomes to refine and improve our algorithms</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="card bg-white border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h4 className="mb-4 text-primary">Specialized Medical Input</h4>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-moon-stars text-primary"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Sleep Disorder Analysis</h5>
                      <p className="text-muted mb-0 small">Guided by Dr. Sarah Johnson, Sleep Medicine Specialist</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                      <i className="bi bi-heart-pulse text-info"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Anxiety Prediction</h5>
                      <p className="text-muted mb-0 small">Overseen by Dr. Michael Chen and Dr. Lisa Nguyen</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <i className="bi bi-emoji-frown text-warning"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Depression Prediction</h5>
                      <p className="text-muted mb-0 small">Validated by Dr. Michael Chen and Dr. Lisa Nguyen</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i className="bi bi-apple text-success"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Nutritional Analysis</h5>
                      <p className="text-muted mb-0 small">Developed with Dr. Priya Patel, Clinical Nutritionist</p>
                    </div>
                  </div>
                </div>
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
                Get personalized health insights developed and validated by medical professionals
              </p>
              <div>
                <Link to="/sleep-disorder" className="btn btn-light btn-lg me-3 shadow">
                  Try Sleep Analysis
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