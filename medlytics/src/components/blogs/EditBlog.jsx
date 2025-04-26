import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        const { title, image, content } = response.data;
        setBlog(response.data);
        setTitle(title);
        setImage(image);
        setContent(content);
      } catch (err) {
        setError("Error fetching blog post.");
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, {
        title,
        content,
        image,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/blog");
      }, 1000);
    } catch (err) {
      setError("Failed to update blog.");
    }
  };

  return (
    <Container className="py-5">
      <h2>Edit Blog Post</h2>
      {success && <Alert variant="success">Blog updated successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {blog && (
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
            />
          </Form.Group>
          <Button variant="warning" type="submit">
            Update Blog
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default EditBlog;
