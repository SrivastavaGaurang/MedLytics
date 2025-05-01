import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table,
  Spinner,
  Badge,
  ProgressBar
} from "react-bootstrap";
import { 
  getAllBlogs, 
  getRecentBlogs, 
  getAllCategories,
  getAllTags 
} from "../../services/blogService";

const BlogDashboard = () => {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    totalTags: 0,
    featuredBlogs: 0,
    categoryDistribution: [],
    latestBlogs: []
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all required data
        const [blogs, categories, tags, recentBlogs] = await Promise.all([
          getAllBlogs(),
          getAllCategories(),
          getAllTags(),
          getRecentBlogs(5)
        ]);
        
        // Calculate category distribution
        const categoryCount = {};
        blogs.forEach(blog => {
          if (categoryCount[blog.category]) {
            categoryCount[blog.category]++;
          } else {
            categoryCount[blog.category] = 1;
          }
        });
        
        const categoryDistribution = Object.keys(categoryCount).map(category => ({
          name: category,
          count: categoryCount[category],
          percentage: Math.round((categoryCount[category] / blogs.length) * 100)
        })).sort((a, b) => b.count - a.count);
        
        // Set stats
        setStats({
          totalBlogs: blogs.length,
          totalCategories: categories.length,
          totalTags: tags.length,
          featuredBlogs: blogs.filter(blog => blog.featured).length,
          categoryDistribution,
          latestBlogs: recentBlogs
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time since posting
  const getTimeSince = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-0">Blog Dashboard</h1>
          <p className="text-muted">Overview of your medical blog</p>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              as={Link} 
              to="/blog/manage"
              className="d-flex align-items-center"
            >
              <i className="bi bi-list-ul me-2"></i>
              Manage Blogs
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate("/blog/new")}
              className="d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Article
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="stat-icon mb-3 bg-primary bg-opacity-10 p-3 rounded">
                <i className="bi bi-file-earmark-text text-primary fs-3"></i>
              </div>
              <h2 className="mb-1">{stats.totalBlogs}</h2>
              <p className="text-muted mb-0">Total Articles</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="stat-icon mb-3 bg-success bg-opacity-10 p-3 rounded">
                <i className="bi bi-folder text-success fs-3"></i>
              </div>
              <h2 className="mb-1">{stats.totalCategories}</h2>
              <p className="text-muted mb-0">Categories</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="stat-icon mb-3 bg-info bg-opacity-10 p-3 rounded">
                <i className="bi bi-tags text-info fs-3"></i>
              </div>
              <h2 className="mb-1">{stats.totalTags}</h2>
              <p className="text-muted mb-0">Tags</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="stat-icon mb-3 bg-warning bg-opacity-10 p-3 rounded">
                <i className="bi bi-star text-warning fs-3"></i>
              </div>
              <h2 className="mb-1">{stats.featuredBlogs}</h2>
              <p className="text-muted mb-0">Featured Articles</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Latest Articles */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Latest Articles</h5>
                <Button 
                  variant="link" 
                  className="text-decoration-none p-0"
                  as={Link}
                  to="/blog/manage"
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: "50%" }}>Title</th>
                      <th style={{ width: "20%" }}>Author</th>
                      <th style={{ width: "15%" }}>Category</th>
                      <th style={{ width: "15%" }}>Published</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.latestBlogs.map(blog => (
                      <tr key={blog._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="blog-thumbnail me-3"
                              style={{ 
                                width: "50px", 
                                height: "50px", 
                                backgroundImage: `url(${blog.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "4px"
                              }}
                            ></div>
                            <div>
                              <Link 
                                to={`/blog/${blog._id}`} 
                                className="text-decoration-none"
                              >
                                {blog.title}
                              </Link>
                              {blog.featured && (
                                <Badge bg="warning" text="dark" className="ms-2">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{blog.author}</td>
                        <td>
                          <Badge bg="info" className="text-white">
                            {blog.category}
                          </Badge>
                        </td>
                        <td>
                          <span title={formatDate(blog.date)}>
                            {getTimeSince(blog.date)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.latestBlogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <i className="bi bi-journal-x fs-3 mb-3 d-block text-muted"></i>
                          <p className="mb-0">No blog posts available.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white">
              <Button 
                variant="outline-primary" 
                className="w-100"
                as={Link}
                to="/blog/new"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create New Article
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        {/* Category Distribution */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Category Distribution</h5>
            </Card.Header>
            <Card.Body>
              {stats.categoryDistribution.length > 0 ? (
                <div>
                  {stats.categoryDistribution.map((category, index) => (
                    <div key={category.name} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <div className="d-flex align-items-center">
                          <Badge 
                            bg="info" 
                            className="me-2"
                          >
                            {category.name}
                          </Badge>
                          <span>{category.count} article{category.count !== 1 ? 's' : ''}</span>
                        </div>
                        <span className="fw-bold">{category.percentage}%</span>
                      </div>
                      <ProgressBar 
                        now={category.percentage} 
                        variant={
                          index === 0 ? "primary" :
                          index === 1 ? "success" :
                          index === 2 ? "info" :
                          index === 3 ? "warning" : "secondary"
                        }
                        className="mb-2"
                        style={{ height: "8px" }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-pie-chart fs-3 mb-3 d-block text-muted"></i>
                  <p className="mb-0">No category data available.</p>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-white">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                as={Link}
                to="/blog/manage"
              >
                <i className="bi bi-list-ul me-2"></i>
                Manage Categories
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Activity Timeline and Popular Tags */}
      <Row>
        {/* Popular Tags */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Popular Tags</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                {stats.latestBlogs.flatMap(blog => blog.tags || [])
                  .filter((tag, index, self) => self.indexOf(tag) === index)
                  .slice(0, 15)
                  .map(tag => (
                    <Badge 
                      key={tag} 
                      bg="light" 
                      text="dark" 
                      className="py-2 px-3 fs-6"
                      style={{ border: '1px solid #dee2e6' }}
                    >
                      #{tag}
                    </Badge>
                  ))}
                {stats.latestBlogs.flatMap(blog => blog.tags || []).length === 0 && (
                  <div className="text-center w-100 py-4">
                    <i className="bi bi-tags fs-3 mb-3 d-block text-muted"></i>
                    <p className="mb-0">No tags available.</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6} className="mb-3">
                  <Button 
                    variant="outline-primary" 
                    className="w-100 py-3 d-flex flex-column align-items-center"
                    as={Link}
                    to="/blog/new"
                  >
                    <i className="bi bi-file-earmark-plus fs-3 mb-2"></i>
                    <span>Create Article</span>
                  </Button>
                </Col>
                <Col sm={6} className="mb-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100 py-3 d-flex flex-column align-items-center"
                    as={Link}
                    to="/blog/manage"
                  >
                    <i className="bi bi-list-check fs-3 mb-2"></i>
                    <span>Manage Content</span>
                  </Button>
                </Col>
                <Col sm={6} className="mb-3 mb-sm-0">
                  <Button 
                    variant="outline-info" 
                    className="w-100 py-3 d-flex flex-column align-items-center"
                  >
                    <i className="bi bi-graph-up fs-3 mb-2"></i>
                    <span>View Analytics</span>
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 py-3 d-flex flex-column align-items-center"
                  >
                    <i className="bi bi-gear fs-3 mb-2"></i>
                    <span>Blog Settings</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogDashboard;