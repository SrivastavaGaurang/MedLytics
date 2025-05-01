import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Button,
  Card,
  Badge,
  Spinner,
  Image,
  Alert
} from "react-bootstrap";
import { getBlogById, getRelatedBlogs } from "../../services/blogService";
import "./MedBlog.css";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // Fetch the blog post
        const blogData = await getBlogById(id);
        setBlog(blogData);
        
        // Fetch related blogs
        const related = await getRelatedBlogs(id, 3);
        setRelatedBlogs(related);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("We couldn't find the article you requested.");
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
      // Scroll to top when blog changes
      window.scrollTo(0, 0);
    }
  }, [id]);

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

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading article...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 py-5">
        <Alert variant="danger">
          <Alert.Heading>Article Not Found</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!blog) {
    return null;
  }

  // Split content into paragraphs
  const paragraphs = blog.content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="medblog-container">
      {/* Article Header */}
      <div className="blog-hero blog-detail-hero">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} className="text-center">
              <Badge bg="primary" className="category-badge mb-3">
                {blog.category}
              </Badge>
              <h1 className="display-4 fw-bold mb-4">{blog.title}</h1>
              <div className="blog-meta d-flex justify-content-center align-items-center mb-4">
                <div className="d-flex align-items-center me-4">
                  {blog.authorImage && (
                    <Image 
                      src={blog.authorImage} 
                      roundedCircle 
                      width={50} 
                      height={50} 
                      className="me-2" 
                    />
                  )}
                  <div>
                    <span className="author-name d-block">{blog.author}</span>
                    <span className="author-title text-muted">{blog.authorTitle}</span>
                  </div>
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
            </Col>
          </Row>
        </Container>
      </div>

      {/* Article Content */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Featured Image */}
            <div className="blog-featured-image mb-5">
              <img src={blog.image} alt={blog.title} className="img-fluid rounded" />
            </div>
            
            {/* Article Text */}
            <div className="blog-content">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Tags */}
            <div className="blog-tags mt-5">
              <h5 className="mb-3">Related Topics</h5>
              <div className="tags-container">
                {blog.tags && blog.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    bg="light" 
                    text="dark" 
                    className="me-2 mb-2 px-3 py-2"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Article Footer */}
            <div className="blog-footer mt-5 pt-4 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="outline-secondary" onClick={handleGoBack}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back
                </Button>
                <div className="d-flex">
                  <Button variant="outline-primary" className="me-2">
                    <i className="bi bi-share me-1"></i>
                    Share
                  </Button>
                  <Button variant="outline-success">
                    <i className="bi bi-bookmark me-1"></i>
                    Save
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Author Bio */}
            <div className="author-bio mt-5 p-4 rounded">
              <Row className="align-items-center">
                <Col md={2} className="text-center">
                  <Image 
                    src={blog.authorImage} 
                    roundedCircle 
                    width={80} 
                    height={80} 
                    className="mb-3 mb-md-0" 
                  />
                </Col>
                <Col md={10}>
                  <h5 className="author-name mb-1">{blog.author}</h5>
                  <p className="author-title text-muted mb-2">{blog.authorTitle}</p>
                  <p className="mb-0">Medical professional specializing in {blog.category}. Committed to providing evidence-based health information and improving patient outcomes through education.</p>
                </Col>
              </Row>
            </div>
            
            {/* Comments Section Placeholder */}
            <div className="comments-section mt-5">
              <h4 className="section-title mb-4">Comments</h4>
              <div className="comments-container p-4 text-center bg-light rounded">
                <i className="bi bi-chat-quote fs-3 mb-3"></i>
                <p>Comments feature coming soon.</p>
                <Button variant="primary">Subscribe for Updates</Button>
              </div>
            </div>
          </Col>
          
          {/* Sidebar */}
          <Col lg={4} className="mt-5 mt-lg-0">
            <div className="blog-sidebar">
              {/* Related Articles */}
              {relatedBlogs.length > 0 && (
                <div className="sidebar-widget related-posts-widget mb-4">
                  <h4 className="widget-title">Related Articles</h4>
                  {relatedBlogs.map(relatedBlog => (
                    <Card key={relatedBlog._id} className="mb-3 border-0 shadow-sm">
                      <Row className="g-0">
                        <Col xs={4}>
                          <div 
                            className="related-post-img"
                            style={{ 
                              height: '80px',
                              backgroundImage: `url(${relatedBlog.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                        </Col>
                        <Col xs={8}>
                          <Card.Body className="py-2 px-3">
                            <Card.Title className="fs-6">
                              <Link 
                                to={`/blog/${relatedBlog._id}`} 
                                className="blog-title-link"
                              >
                                {relatedBlog.title}
                              </Link>
                            </Card.Title>
                            <Card.Text className="meta-info small">
                              <i className="bi bi-calendar3 me-1"></i>
                              {formatDate(relatedBlog.date)}
                            </Card.Text>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Categories Widget */}
              <div className="sidebar-widget categories-widget mb-4">
                <h4 className="widget-title">Categories</h4>
                <ul className="category-list">
                  <li><Link to="/blog/category/Cardiology">Cardiology</Link></li>
                  <li><Link to="/blog/category/Mental-Health">Mental Health</Link></li>
                  <li><Link to="/blog/category/Nutrition">Nutrition</Link></li>
                  <li><Link to="/blog/category/Sleep-Medicine">Sleep Medicine</Link></li>
                  <li><Link to="/blog/category/Endocrinology">Endocrinology</Link></li>
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
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Call to Action */}
      <section className="cta-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="cta-container text-center p-5 rounded shadow-sm bg-white">
                <h2 className="mb-3">Have a Question About This Topic?</h2>
                <p className="mb-4">Our medical experts are here to help. Submit your question and get a personalized response.</p>
                <Button variant="primary" size="lg" className="rounded-pill px-4">
                  Ask an Expert
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default BlogDetail;