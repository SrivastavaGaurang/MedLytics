import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        fetchBlogs(); // Refresh after deletion
      } catch (err) {
        alert("Error deleting blog");
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Latest Blogs</h2>
      <Row>
        {blogs.map((blog) => (
          <Col key={blog._id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={blog.image || "https://via.placeholder.com/600x300"}
                alt={blog.title}
              />
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>
                  {blog.content.substring(0, 100)}...
                </Card.Text>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Link to={`/blog/${blog._id}`}>
                    <Button variant="primary">Read More</Button>
                  </Link>
                  <Link to={`/edit-blog/${blog._id}`}>
                    <Button variant="warning">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogList;
