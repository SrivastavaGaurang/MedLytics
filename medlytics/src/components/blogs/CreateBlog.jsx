import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/blogs", {
        title,
        content,
        image,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/blog");
        }, 1000);
      }
    } catch (err) {
      setError("Failed to create blog. Please try again.");
    }
  };

  return (
    <Container className="py-5">
       <Link to="/blog">
            <Button variant="outline-secondary">🔙 Back to Blog List</Button>
          </Link>
      <h2>Create a New Blog Post</h2>
      {success && <Alert variant="success">Blog created successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste image URL here"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
          />
        </Form.Group>

        {/* Buttons aligned at the bottom right */}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="primary" type="submit">
            ✅ Publish Blog
          </Button>
          <Link to="/admin/blog/edit/sample-id">
            <Button variant="outline-warning">✏️ Edit</Button>
          </Link>
          <Link to="/admin/blog/delete/sample-id">
            <Button variant="outline-danger">🗑️ Delete</Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default CreateBlog;
