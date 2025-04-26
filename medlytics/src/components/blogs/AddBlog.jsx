// src/components/blog/AddBlog.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/blogs', { title, content })
      .then(() => {
        setSuccess(true);
        setTitle('');
        setContent('');
      })
      .catch(err => console.error("Error creating blog:", err));
  };

  return (
    <Container className="mt-4">
      <h2>Add New Blog Post</h2>
      {success && <Alert variant="success">Blog post added successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="content" className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">Publish</Button>
      </Form>
    </Container>
  );
};

export default AddBlog;
