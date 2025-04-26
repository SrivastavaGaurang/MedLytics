import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Button } from "react-bootstrap";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="text-center my-5">
        <h4>Blog not found.</h4>
        <Link to="/blog" className="btn btn-outline-primary mt-3">
          Back to Blogs
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-primary mb-3">{blog.title}</h1>
      <p className="text-muted mb-4">
        {new Date(blog.date).toLocaleDateString()}
      </p>
      <div className="text-secondary fs-5" style={{ lineHeight: "1.8" }}>
        {blog.content}
      </div>

      <div className="mt-4">
        <Link to="/blog">
          <Button variant="outline-primary">← Back to Blogs</Button>
        </Link>
      </div>
    </Container>
  );
};

export default BlogDetail;
