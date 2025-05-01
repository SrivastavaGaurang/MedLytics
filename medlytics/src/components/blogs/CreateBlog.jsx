import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card,
  Alert,
  Badge,
  CloseButton
} from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CreateBlog = () => {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  
  // Form validation
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  const [alertMessage, setAlertMessage] = useState("");
  
  // Available categories
  const categories = ["Cardiology", "Mental Health", "Nutrition", "Endocrinology", "Sleep Medicine", "General Health"];
  
  // Handle editor changes
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  
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
    
    // Prepare blog data
    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    
    const blogData = {
      title,
      summary,
      content,
      image: imageUrl || "https://via.placeholder.com/600x350?text=Blog+Image",
      date: new Date().toISOString(),
      author,
      authorTitle,
      authorImage: "https://via.placeholder.com/50x50",
      category,
      featured,
      tags
    };
    
    // In a real app, this would be an API call
    console.log("Blog data to be submitted:", blogData);
    
    // Show success message
    setAlertVariant("success");
    setAlertMessage("Article created successfully!");
    setShowAlert(true);
    
    // Reset form after short delay and redirect
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  
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
          <h1 className="page-title">Create New Article</h1>
          <p className="text-muted">Add a new article to the MedLytics blog.</p>
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
                    <Editor
                      editorState={editorState}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class p-2"
                      toolbarClassName="toolbar-class"
                      onEditorStateChange={onEditorStateChange}
                      toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
                        inline: { inDropdown: false },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                      }}
                    />
                  </div>
                  <Form.Control 
                    type="hidden" 
                    required
                    isInvalid={editorState.getCurrentContent().getPlainText().length === 0}
                    value={editorState.getCurrentContent().getPlainText()}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please add some content to your article.
                  </Form.Control.Feedback>
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
                Publish Article
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

export default CreateBlog;