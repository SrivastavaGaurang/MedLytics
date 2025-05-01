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
  Badge,
  CloseButton,
  Spinner
} from "react-bootstrap";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  const [alertMessage, setAlertMessage] = useState("");
  
  // Available categories
  const categories = ["Cardiology", "Mental Health", "Nutrition", "Endocrinology", "Sleep Medicine", "General Health"];
  
  // Rich text editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
  
  // Load blog data on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchBlog = async () => {
      try {
        // For demo, we'll simulate fetching the blog by ID
        // This would normally be an API call like:
        // const response = await axios.get(`/api/blogs/${id}`);
        // const blog = response.data;
        
        // Mock data - simulating blog retrieval
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
          // Other blog objects...
        ];
        
        const blog = blogsData.find(blog => blog._id === id);
        
        if (!blog) {
          throw new Error("Blog not found");
        }
        
        // Set form state with blog data
        setTitle(blog.title);
        setSummary(blog.summary);
        setCategory(blog.category);
        setImageUrl(blog.image);
        setAuthor(blog.author);
        setAuthorTitle(blog.authorTitle || "");
        setFeatured(blog.featured);
        setTags(blog.tags || []);
        
        // Set content directly with the plain text or HTML content
        setContent(blog.content);
        
      } catch (error) {
        console.error("Error fetching blog:", error);
        setAlertVariant("danger");
        setAlertMessage("Failed to load article. Please try again.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);
  
  // Handle tag input
  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag("");
      }
    }
  };
  
  const addTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Prepare updated blog data
    const updatedBlogData = {
      _id: id,
      title,
      summary,
      content,
      image: imageUrl || "https://via.placeholder.com/600x350?text=Blog+Image",
      date: new Date().toISOString(), // Update date to now, or keep original date
      author,
      authorTitle,
      category,
      featured,
      tags
    };
    
    // In a real app, this would be an API call to update the blog
    console.log("Updated blog data:", updatedBlogData);
    
    // Show success message
    setAlertVariant("success");
    setAlertMessage("Article updated successfully!");
    setShowAlert(true);
    
    // Redirect back to main page after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading article data...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      {showAlert && (
        <Alert 
          variant={alertVariant} 
          className="mb-4" 
          dismissible
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Edit Article</h1>
          <p className="text-muted">Update article details and content.</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </Button>
        </Col>
      </Row>
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="card-title mb-3">Article Content</h5>
                
                <Form.Group className="mb-3" controlId="blogTitle">
                  <Form.Label>Article Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a title.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="blogSummary">
                  <Form.Label>Summary *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Brief summary of the article"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a summary.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="blogContent">
                  <Form.Label>Content *</Form.Label>
                  <div className="editor-wrapper border rounded">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      className="quill-editor"
                      style={{ height: '300px', marginBottom: '50px' }}
                    />
                  </div>
                  {validated && content.trim() === '' && (
                    <div className="text-danger mt-2 small">
                      Please add some content to your article.
                    </div>
                  )}
                  <Form.Control 
                    type="hidden" 
                    required
                    isInvalid={content.trim() === ''}
                    value={content}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="card-title mb-3">Article Details</h5>
                
                <Form.Group className="mb-3" controlId="blogCategory">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a category.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="blogImageUrl">
                  <Form.Label>Featured Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Leave blank to use a placeholder image.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="blogTags">
                  <Form.Label>Tags</Form.Label>
                  <div className="d-flex mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Add tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={addTag}
                      className="ms-2"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="tags-container">
                    {tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        bg="light" 
                        text="dark" 
                        className="me-2 mb-2 p-2 d-inline-flex align-items-center"
                      >
                        {tag}
                        <CloseButton 
                          onClick={() => removeTag(tag)} 
                          className="ms-1 p-0" 
                          style={{ fontSize: '0.65rem' }}
                        />
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="blogFeatured">
                  <Form.Check
                    type="checkbox"
                    label="Feature this article"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="card-title mb-3">Author Information</h5>
                
                <Form.Group className="mb-3" controlId="blogAuthor">
                  <Form.Label>Author Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an author name.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="blogAuthorTitle">
                  <Form.Label>Author Title/Specialty</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Cardiologist, Registered Dietitian"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                Update Article
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default EditBlog;