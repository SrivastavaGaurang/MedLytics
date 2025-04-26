import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Blog.css"; // optional custom styling

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Container className="blog-page my-5">
      <h1 className="text-center mb-4 blog-title">📝 MedLytics Blog</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center">
          <h4 className="text-muted">No blog posts available yet.</h4>
          <Link to="/admin/blog/create">
            <Button variant="primary" className="mt-3">
              ➕ Create New Blog
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-4">
            <Link to="/admin/blog/create">
              <Button variant="primary" className="create-blog-btn">
                ➕ Create New Blog
              </Button>
            </Link>
          </div>
          <Row>
            {blogs.map((blog) => (
              <Col key={blog._id} md={6} lg={4} className="mb-4">
                <Card className="blog-card h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-primary">{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(blog.date).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text className="text-secondary">
                      {blog.summary || blog.content.slice(0, 120) + "..."}
                    </Card.Text>
                    <Link to={`/blog/${blog._id}`} className="btn btn-outline-primary btn-sm">
                      Read More →
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Blog;
