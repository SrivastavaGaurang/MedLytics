import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Card,
  Badge,
  Spinner,
  Image,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import "./MedBlog.css";

const MedBlog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Auth state (in a real app, this would come from your auth context/service)
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch blogs from API or use mock data
  const fetchBlogs = async () => {
    try {
      // Mock data for demonstration
      const blogsData = [
        {
          _id: "1",
          title: "Understanding Blood Pressure: What Your Numbers Mean",
          content: "High blood pressure is often called the silent killer because it usually has no warning signs or symptoms, and many people do not know they have it. Understanding your blood pressure readings is an important part of maintaining cardiovascular health.\n\nBlood pressure is the force of blood pushing against the walls of arteries as the heart pumps blood. It is measured using two numbers: The first number, called systolic blood pressure, represents the pressure in your blood vessels when your heart beats. The second number, called diastolic blood pressure, represents the pressure in your blood vessels when your heart rests between beats.\n\nNormal blood pressure is less than 120/80 mm Hg. If your results fall into this category, stick with heart-healthy habits like following a balanced diet and getting regular exercise. Elevated blood pressure is when readings consistently range from 120-129 systolic and less than 80 mm Hg diastolic. People with elevated blood pressure are likely to develop high blood pressure unless steps are taken to control it.",
          summary: "Learn how to interpret your blood pressure readings and what they mean for your overall health.",
          image: "https://via.placeholder.com/600x350?text=Blood+Pressure",
          date: "2025-04-15T12:00:00.000Z",
          author: "Dr. Sarah Chen",
          authorTitle: "Cardiologist",
          authorImage: "https://via.placeholder.com/50x50",
          category: "Cardiology",
          featured: true,
          tags: ["Blood Pressure", "Heart Health", "Prevention"]
        },
        // Other blog entries remain the same
        {
          _id: "2",
          title: "Mindfulness Meditation for Stress Reduction",
          content: "Mindfulness meditation is a mental training practice that teaches you to slow down racing thoughts, let go of negativity, and calm both your mind and body. It combines meditation with the practice of mindfulness, which is being intensely aware of what you're sensing and feeling in the moment, without interpretation or judgment.\n\nPracticing mindfulness meditation involves breathing methods, guided imagery, and other practices to relax the body and mind and help reduce stress. Spending too much time planning, problem-solving, daydreaming, or thinking negative or random thoughts can be draining. It can also make you more likely to experience stress, anxiety and symptoms of depression. Practicing mindfulness exercises can help you direct your attention away from this kind of thinking and engage with the world around you.",
          summary: "Discover how mindfulness meditation techniques can help manage stress and improve mental wellbeing.",
          image: "https://via.placeholder.com/600x350?text=Meditation",
          date: "2025-04-10T12:00:00.000Z",
          author: "Dr. Michael Rivera",
          authorTitle: "Psychiatrist",
          authorImage: "https://via.placeholder.com/50x50",
          category: "Mental Health",
          featured: true,
          tags: ["Meditation", "Stress Management", "Mental Health"]
        },
        {
          _id: "3",
          title: "Nutrition Basics: Building a Balanced Diet",
          content: "A balanced diet is essential for maintaining good health and preventing chronic diseases. The key components of a balanced diet include proteins, carbohydrates, fats, vitamins, minerals, and water.\n\nProteins are the building blocks of the body and are essential for growth, repair, and maintenance of body tissues. Good sources of protein include lean meat, fish, poultry, eggs, dairy products, legumes, nuts, and seeds.\n\nCarbohydrates are the body's main source of energy. They are found in foods like grains, fruits, vegetables, and legumes. Choose complex carbohydrates like whole grains over simple carbohydrates like refined sugar for sustained energy and better nutrition.\n\nFats are essential for many bodily functions, including vitamin absorption, brain health, and hormone production. Focus on healthy fats found in avocados, nuts, seeds, and olive oil, while limiting saturated and trans fats.",
          summary: "Learn the fundamentals of nutrition and how to create a balanced diet that supports your health goals.",
          image: "https://via.placeholder.com/600x350?text=Nutrition",
          date: "2025-04-05T12:00:00.000Z",
          author: "Emma Johnson",
          authorTitle: "Registered Dietitian",
          authorImage: "https://via.placeholder.com/50x50",
          category: "Nutrition",
          featured: false,
          tags: ["Nutrition", "Diet", "Healthy Eating"]
        },
        {
          _id: "4",
          title: "Exercise Guidelines for Heart Health",
          content: "Regular physical activity is one of the most important things you can do for your heart health. The American Heart Association recommends at least 150 minutes per week of moderate-intensity aerobic activity or 75 minutes per week of vigorous aerobic activity, or a combination of both, preferably spread throughout the week.\n\nAerobic exercises, such as walking, jogging, swimming, or cycling, are ideal for improving cardiovascular health. These activities increase your heart rate and breathing, which helps strengthen your heart and improve its efficiency.\n\nStrength training is also beneficial for heart health. The AHA recommends moderate- to high-intensity muscle-strengthening activity (such as resistance or weights) at least twice per week. Strength training helps reduce body fat, increase lean muscle mass, and burn calories more efficiently.",
          summary: "Understand the recommended exercise guidelines for maintaining optimal heart health and preventing cardiovascular disease.",
          image: "https://via.placeholder.com/600x350?text=Exercise",
          date: "2025-03-28T12:00:00.000Z",
          author: "Dr. James Wilson",
          authorTitle: "Sports Medicine Specialist",
          authorImage: "https://via.placeholder.com/50x50",
          category: "Cardiology",
          featured: false,
          tags: ["Exercise", "Heart Health", "Physical Activity"]
        },
        {
          _id: "5",
          title: "Understanding Diabetes: Types, Symptoms, and Management",
          content: "Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin, which acts like a key to let the blood sugar into your body's cells for use as energy.\n\nThere are three main types of diabetes: Type 1, Type 2, and gestational diabetes. Type 1 diabetes is an autoimmune disease where the body attacks the cells in the pancreas that make insulin, so the body cannot produce insulin. People with Type 1 diabetes need to take insulin every day. Type 2 diabetes occurs when the body becomes resistant to insulin or doesn't make enough insulin. Type 2 diabetes is often linked to lifestyle factors such as obesity and lack of physical activity. Gestational diabetes develops in pregnant women who have never had diabetes.",
          summary: "Learn about the different types of diabetes, their symptoms, and effective strategies for management.",
          image: "https://via.placeholder.com/600x350?text=Diabetes",
          date: "2025-03-20T12:00:00.000Z",
          author: "Dr. Lisa Patel",
          authorTitle: "Endocrinologist",
          authorImage: "https://via.placeholder.com/50x50",
          category: "Endocrinology",
          featured: false,
          tags: ["Diabetes", "Blood Sugar", "Chronic Disease"]
        },
        {
          _id: "6",
          title: "Sleep Hygiene: Tips for Better Rest",
          content: "Sleep hygiene refers to healthy sleep habits that can improve your ability to fall asleep and stay asleep. Good sleep hygiene is important for both physical and mental health, helping to improve productivity, quality of life, and preventing various chronic health conditions.\n\nOne of the most important sleep hygiene practices is maintaining a consistent sleep schedule. Try to go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock and can help you fall asleep and stay asleep for the night.\n\nCreating a restful environment is also crucial. Your bedroom should be cool, quiet, and dark. Consider using earplugs, an eye mask, or a white noise machine if needed. Make sure your mattress and pillows are comfortable and supportive.",
          summary: "Discover practical sleep hygiene practices that can help improve your sleep quality and overall health.",
          image: "https://via.placeholder.com/600x350?text=Sleep+Hygiene",
          date: "2025-03-15T12:00:00.000Z",
          author: "Dr. Robert Thompson",
          authorTitle: "Sleep Specialist",
          authorImage: "https://via.placeholder.com/50x50",
          category: "Sleep Medicine",
          featured: false,
          tags: ["Sleep", "Rest", "Health Tips"]
        },
      ];
      
      setBlogs(blogsData);
      
      // Extract categories from blogs
      const categoryList = ["All", ...new Set(blogsData.map(blog => blog.category))];
      setCategories(categoryList);
      
      // Set featured blogs
      const featured = blogsData.filter(blog => blog.featured);
      setFeaturedBlogs(featured);
      
      // Set recent blogs
      const sorted = [...blogsData].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentBlogs(sorted);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showNotification("Failed to load blogs. Please try again later.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    
    // Simple mock login for demo purposes
    // In a real app, this would be an API call
    if (username === "admin" && password === "password") {
      setIsAdmin(true);
      setShowLoginModal(false);
      showNotification("Successfully logged in as admin", "success");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAdmin(false);
    showNotification("Successfully logged out", "info");
  };

  // Handle blog deletion
  const confirmDelete = (blogId) => {
    const blog = blogs.find(b => b._id === blogId);
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    // In a real app, this would be an API call
    const updatedBlogs = blogs.filter(blog => blog._id !== blogToDelete._id);
    setBlogs(updatedBlogs);
    
    // Update featured and recent blogs
    const featured = updatedBlogs.filter(blog => blog.featured);
    setFeaturedBlogs(featured);
    
    const sorted = [...updatedBlogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentBlogs(sorted);
    
    setShowDeleteModal(false);
    showNotification(`"${blogToDelete.title}" has been deleted.`, "success");
  };

  // Navigate to edit page
  const handleEdit = (blogId) => {
    navigate(`/blog/edit/${blogId}`);
  };

  // Show notification
  const showNotification = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    
    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Filter blogs by category
  const filteredBlogs = activeCategory === "All" 
    ? recentBlogs 
    : recentBlogs.filter(blog => blog.category === activeCategory);

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading articles...</p>
      </Container>
    );
  }

  return (
    <div className="medblog-container">
      {/* Alert Notification */}
      {showAlert && (
        <Alert 
          variant={alertVariant} 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 z-index-1000"
          style={{ zIndex: 1050 }}
        >
          {alertMessage}
        </Alert>
      )}
      
      {/* Hero Section */}
      <div className="blog-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-3">MedLytics Health Blog</h1>
                <p className="lead mb-4">Evidence-based insights and expert medical advice to help you make informed health decisions.</p>
                <div className="search-box">
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Search health topics..." 
                  />
                  <Button variant="primary" className="search-btn">
                    <i className="bi bi-search"></i>
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img 
                  src="https://via.placeholder.com/600x400?text=MedLytics+Blog" 
                  alt="MedLytics Health Blog" 
                  className="img-fluid rounded shadow" 
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Admin navigation bar - Only visible when admin is logged in */}
      {isAdmin && (
        <div className="admin-navbar py-2 bg-dark text-white">
          <Container>
            <Row className="align-items-center">
              <Col xs={6}>
                <span className="admin-badge bg-warning text-dark px-2 py-1 rounded">Admin Mode</span>
              </Col>
              <Col xs={6} className="text-end">
                <Button 
                  variant="success" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate('/blog/create')}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  New Article
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <section className="featured-posts py-5">
          <Container>
            <div className="section-header mb-4">
              <h2 className="section-title">Featured Articles</h2>
              <p className="section-subtitle">Expert insights on important health topics</p>
            </div>
            
            <Row>
              {featuredBlogs.map((blog, index) => (
                <Col key={blog._id} lg={index === 0 ? 8 : 4} className="mb-4">
                  <Link to={`/blog/${blog._id}`} className="blog-card-link">
                    <Card className={`featured-card h-100 ${index === 0 ? 'featured-main' : ''}`}>
                      <div 
                        className="featured-card-img"
                        style={{ 
                          backgroundImage: `url(${blog.image})` 
                        }}
                      >
                        <Badge bg="primary" className="category-badge">
                          {blog.category}
                        </Badge>
                        
                        {/* Admin Actions - Only visible for admin */}
                        {isAdmin && (
                          <div className="admin-actions">
                            <Button 
                              variant="warning" 
                              size="sm" 
                              className="me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEdit(blog._id);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                confirmDelete(blog._id);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title className="blog-title">{blog.title}</Card.Title>
                        <Card.Text className="blog-excerpt">
                          {blog.summary}
                        </Card.Text>
                        <div className="blog-meta">
                          <div className="meta-item">
                            <i className="bi bi-calendar3"></i>
                            <span>{formatDate(blog.date)}</span>
                          </div>
                          <div className="meta-item">
                            <i className="bi bi-clock"></i>
                            <span>{calculateReadingTime(blog.content)} min read</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Categories and Recent Posts */}
      <section className="recent-posts py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8}>
              <div className="section-header mb-4">
                <h2 className="section-title">Recent Articles</h2>
                <p className="section-subtitle">Stay updated with the latest health information</p>
              </div>
              
              {/* Category Pills */}
              <div className="category-filter mb-4">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "primary" : "outline-secondary"}
                    className="rounded-pill me-2 mb-2"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              {/* Blog List */}
              <div className="blog-list">
                {filteredBlogs.map(blog => (
                  <Card key={blog._id} className="blog-list-card mb-4">
                    <Row className="g-0">
                      <Col md={4}>
                        <div 
                          className="blog-list-img"
                          style={{ backgroundImage: `url(${blog.image})` }}
                        >
                          <Badge bg="primary" className="category-badge-sm">
                            {blog.category}
                          </Badge>
                          
                          {/* Admin Actions - Only visible for admin */}
                          {isAdmin && (
                            <div className="admin-actions">
                              <Button 
                                variant="warning" 
                                size="sm" 
                                className="me-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit(blog._id);
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  confirmDelete(blog._id);
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col md={8}>
                        <Card.Body>
                          <Card.Title className="blog-title mb-2">
                            <Link to={`/blog/${blog._id}`} className="blog-title-link">
                              {blog.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="blog-excerpt mb-3">
                            {blog.summary}
                          </Card.Text>
                          <div className="blog-meta d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              {blog.authorImage && (
                                <Image 
                                  src={blog.authorImage} 
                                  roundedCircle 
                                  width={30} 
                                  height={30} 
                                  className="me-2" 
                                />
                              )}
                              <span className="author-name">{blog.author}</span>
                            </div>
                            <div className="meta-info">
                              <span className="me-3">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(blog.date)}
                              </span>
                              <span>
                                <i className="bi bi-clock me-1"></i>
                                {calculateReadingTime(blog.content)} min read
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="pagination-container d-flex justify-content-center mt-5">
                <Button variant="outline-secondary" className="rounded-circle pagination-btn me-2">
                  <i className="bi bi-chevron-left"></i>
                </Button>
                <Button variant="primary" className="rounded-circle pagination-btn me-2">1</Button>
                <Button variant="outline-secondary" className="rounded-circle pagination-btn me-2">2</Button>
                <Button variant="outline-secondary" className="rounded-circle pagination-btn me-2">3</Button>
                <Button variant="outline-secondary" className="rounded-circle pagination-btn">
                  <i className="bi bi-chevron-right"></i>
                </Button>
              </div>
            </Col>
            
            {/* Sidebar */}
            <Col lg={4} className="mt-5 mt-lg-0">
              <div className="blog-sidebar">
                {/* About Section */}
                <div className="sidebar-widget about-widget mb-4">
                  <h4 className="widget-title">About MedLytics</h4>
                  <p>MedLytics provides evidence-based health information written and reviewed by medical professionals to help you make informed decisions about your health.</p>
                  <Link to="/about">
                    <Button variant="outline-primary" size="sm">Learn More</Button>
                  </Link>
                </div>
                
                {/* Admin Login - Only visible if not logged in */}
                {!isAdmin && (
                  <div className="sidebar-widget login-widget mb-4">
                    <h4 className="widget-title">Admin Access</h4>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={() => setShowLoginModal(true)}
                    >
                      <i className="bi bi-lock me-1"></i>
                      Staff Login
                    </Button>
                  </div>
                )}
                
                {/* Categories Widget */}
                <div className="sidebar-widget categories-widget mb-4">
                  <h4 className="widget-title">Categories</h4>
                  <ul className="category-list">
                    {categories.filter(cat => cat !== "All").map(category => (
                      <li key={category} className="category-item">
                        <Link 
                          to="#" 
                          className="category-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveCategory(category);
                          }}
                        >
                          {category}
                          <span className="category-count">
                            {recentBlogs.filter(blog => blog.category === category).length}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Newsletter Widget */}
                <div className="sidebar-widget newsletter-widget mb-4">
                  <h4 className="widget-title">Newsletter</h4>
                  <p>Stay updated with our latest health articles and tips.</p>
                  <div className="newsletter-form">
                    <input 
                      type="email" 
                      className="form-control mb-2" 
                      placeholder="Your email address" 
                    />
                    <Button variant="primary" className="w-100">Subscribe</Button>
                  </div>
                </div>
                
                {/* Tags Widget */}
                <div className="sidebar-widget tags-widget">
                  <h4 className="widget-title">Popular Tags</h4>
                  <div className="tags-cloud">
                    {Array.from(new Set(recentBlogs.flatMap(blog => blog.tags || []))).map(tag => (
                      <Badge 
                        key={tag} 
                        bg="light" 
                        text="dark" 
                        className="tag-badge"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <div className="cta-container text-center p-5 rounded">
            <Row className="justify-content-center">
              <Col lg={8}>
                <h2 className="cta-title mb-3">Have a Medical Question?</h2>
                <p className="cta-text mb-4">Our team of medical professionals is here to help answer your health-related questions.</p>
                <Link to="/contact">
                  <Button variant="light" size="lg" className="rounded-pill px-4">
                    Contact Our Experts
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
      
      {/* Admin Controls - only show when not logged in */}
      {!isAdmin && (
        <Container className="my-4">
          <div className="admin-controls text-center">
            <Button 
              variant="outline-secondary"
              onClick={() => setShowLoginModal(true)}
            >
              <i className="bi bi-lock me-1"></i>
              Admin Login
            </Button>
          </div>
        </Container>
      )}
      
      {/* Admin Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginError && (
            <Alert variant="danger">{loginError}</Alert>
          )}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
                      <small className="text-muted w-100 text-center">
            For demo purposes: Username is "admin" and password is "password"
            </small>
          </Modal.Footer>
        </Modal>
        
        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {blogToDelete && (
              <>
                <p>Are you sure you want to delete the following article?</p>
                <p className="fw-bold">{blogToDelete.title}</p>
                <p className="text-danger">This action cannot be undone.</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
};

export default MedBlog;