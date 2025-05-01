import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card,
  Alert,
  Spinner
} from "react-bootstrap";
import { getBlogById, createBlog, updateBlog, getAllCategories, getAllTags } from "../../services/blogService";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    category: "",
    author: "",
    authorTitle: "",
    authorImage: "",
    tags: [],
    featured: false
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  
  // Fetch blog data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories and tags
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        
        const tagsData = await getAllTags();
        setAvailableTags(tagsData);
        
        // If edit mode, fetch blog data
        if (isEditMode) {
          const blogData = await getBlogById(id);
          setFormData({
            ...blogData,
            tags: blogData.tags || []
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle tag selection
  const handleTagSelect = (e) => {
    const value = e.target.value;
    if (value && !formData.tags.includes(value)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, value]
      }));
    }
  };

  // Handle adding new tag
  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.title || !formData.content || !formData.category) {
        throw new Error("Please fill out all required fields.");
      }
      
      // Set date if new blog
      const blogData = {
        ...formData,
        date: formData.date || new Date().toISOString()
      };
      
      // Submit form data
      if (isEditMode) {
        await updateBlog(id, blogData);
      } else {
        const newBlog = await createBlog(blogData);
        setFormData(newBlog);
      }
      
      setSuccess(true);
      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate(isEditMode ? `/blog/${id}` : "/blog/manage");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "Error saving the blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Format paragraphs for preview
  const formatContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading form...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <h2 className="mb-0">{isEditMode ? "Edit Article" : "Create New Article"}</h2>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="mb-4">
                  Article {isEditMode ? "updated" : "created"} successfully!
                </Alert>
              )}
              
              <div className="d-flex justify-content-end mb-4">
                <Button 
                  variant={previewMode ? "primary" : "outline-primary"}
                  onClick={() => setPreviewMode(!previewMode)}
                  className="me-2"
                >
                  {previewMode ? "Edit Mode" : "Preview Mode"}
                </Button>
              </div>
              
              {previewMode ? (
                <div className="blog-preview">
                  <h1 className="mb-3">{formData.title || "Untitled Article"}</h1>
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt={formData.title} 
                      className="img-fluid rounded mb-4"
                      style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                    />
                  )}
                  <div className="mb-4">
                    <span className="badge bg-primary me-2">{formData.category || "Uncategorized"}</span>
                    {formData.featured && (
                      <span className="badge bg-warning text-dark">Featured</span>
                    )}
                  </div>
                  <div className="summary mb-4 p-3 bg-light rounded">
                    <p className="fst-italic mb-0">{formData.summary || "No summary provided"}</p>
                  </div>
                  <div className="content mb-4">
                    {formatContent(formData.content || "No content provided")}
                  </div>
                  <div className="tags mb-3">
                    {formData.tags.map(tag => (
                      <span key={tag} className="badge bg-light text-dark me-2 mb-2">{tag}</span>
                    ))}
                  </div>
                  <div className="author-info border-top pt-3 mt-4">
                    <div className="d-flex align-items-center">
                      {formData.authorImage && (
                        <img 
                          src={formData.authorImage} 
                          alt={formData.author} 
                          className="rounded-circle me-3"
                          width="50"
                          height="50"
                        />
                      )}
                      <div>
                        <h5 className="mb-0">{formData.author || "Anonymous"}</h5>
                        <p className="text-muted mb-0">{formData.authorTitle || "Author"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="secondary" onClick={() => setPreviewMode(false)}>
                      Back to Edit Mode
                    </Button>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter article title"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Summary (Short description) *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      placeholder="Write a brief summary (1-2 sentences)"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Content *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={12}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Write your article content here (use double line breaks for paragraphs)"
                      required
                    />
                    <Form.Text className="text-muted">
                      Use double line breaks to separate paragraphs.
                    </Form.Text>
                  </Form.Group>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Featured Image URL *</Form.Label>
                        <Form.Control
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          placeholder="Enter image URL"
                          required
                        />
                        <Form.Text className="text-muted">
                          Paste the URL of an image (16:9 ratio recommended)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Author Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          placeholder="Enter author name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Author Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="authorTitle"
                          value={formData.authorTitle}
                          onChange={handleChange}
                          placeholder="E.g., Cardiologist, Nutritionist"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Author Avatar URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="authorImage"
                      value={formData.authorImage}
                      onChange={handleChange}
                      placeholder="Enter author image URL"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Tags</Form.Label>
                    <Row>
                      <Col md={6} className="mb-2">
                        <Form.Select 
                          onChange={handleTagSelect}
                          value=""
                        >
                          <option value="">Select from existing tags</option>
                          {availableTags
                            .filter(tag => !formData.tags.includes(tag))
                            .map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))
                          }
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add new tag"
                          />
                          <Button 
                            variant="outline-secondary" 
                            onClick={handleAddTag}
                            className="ms-2"
                          >
                            Add
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <div className="selected-tags mt-3">
                      {formData.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          bg="light" 
                          text="dark" 
                          className="me-2 mb-2 p-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} <i className="bi bi-x-circle"></i>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="featuredCheck"
                      label="Mark as featured article"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        className="me-2"
                        onClick={() => setPreviewMode(true)}
                      >
                        Preview
                      </Button>
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Spinner 
                              as="span" 
                              animation="border" 
                              size="sm" 
                              role="status" 
                              aria-hidden="true" 
                              className="me-2"
                            />
                            Saving...
                          </>
                        ) : (
                          isEditMode ? "Update Article" : "Publish Article"
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogForm;