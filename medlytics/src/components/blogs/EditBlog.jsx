// components/blogs/EditBlog.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../../services/blogService';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSave, FaTimes, FaArrowLeft, FaImage, FaEye, FaEdit } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    image: '',
    author: '',
    tags: []
  });
  const [originalBlog, setOriginalBlog] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    }
  }, [isAuthenticated, loginWithRedirect]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setFormData({
          title: data.title,
          content: data.content,
          summary: data.summary || '',
          image: data.image || 'https://via.placeholder.com/800x400?text=Medical+Blog+Image',
          author: data.author,
          tags: data.tags || []
        });
        setOriginalBlog(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog. It may have been removed or is unavailable.');
        setLoading(false);
        console.error('Error fetching blog:', err);
      }
    };

    if (isAuthenticated) {
      fetchBlog();
    }
  }, [id, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // If no summary is provided, create one from the first 150 characters of content
      const blogToSubmit = {
        ...formData,
        summary: formData.summary.trim() || formData.content.substring(0, 150) + '...'
      };
      
      await updateBlog(id, blogToSubmit);
      setSubmitting(false);
      
      // Redirect to the blog post
      navigate(`/blog/${id}`);
    } catch (err) {
      setError('Failed to update blog post. Please try again.');
      setSubmitting(false);
      console.error('Error updating blog:', err);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const suggestedTags = [
    'Healthcare', 'Medical Research', 'Wellness', 'Patient Care',
    'Mental Health', 'Nutrition', 'Disease Prevention', 'Technology',
    'COVID-19', 'Cardiology', 'Pediatrics', 'Surgery', 'Public Health'
  ];

  // If not authenticated or loading, show loading spinner
  if (!isAuthenticated || loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-blog-container py-5">
      <div className="container">
        <div className="mb-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/blog/${id}`)}
          >
            <FaArrowLeft className="me-2" /> Back to Article
          </button>
        </div>
        
        <div className="row mb-4">
          <div className="col">
            <h1 className="mb-3">Edit Article</h1>
            {originalBlog && <p className="text-muted">Editing: {originalBlog.title}</p>}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          <div className="col-lg-12">
            {/* Preview Toggle */}
            <div className="d-flex justify-content-end mb-3">
              <button 
                className={`btn ${previewMode ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={togglePreview}
              >
                {previewMode ? <><FaEdit className="me-2" /> Edit</> : <><FaEye className="me-2" /> Preview</>}
              </button>
            </div>

            {/* Preview Mode */}
            {previewMode ? (
              <div className="preview-container border rounded p-4 mb-4">
                <h2 className="preview-title mb-3">{formData.title || 'Untitled Article'}</h2>
                
                {formData.tags.length > 0 && (
                  <div className="mb-3">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-primary-subtle text-primary me-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-muted small mb-3">
                  By {formData.author} • {originalBlog ? new Date(originalBlog.date).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
                
                {formData.image && (
                  <div className="preview-image mb-4">
                    <img 
                      src={formData.image} 
                      className="img-fluid rounded" 
                      alt={formData.title} 
                      style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                
                <div className="preview-content">
                  <ReactMarkdown>{formData.content || 'No content to preview'}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        name="title"
                        placeholder="Enter article title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="summary" className="form-label">Summary</label>
                      <textarea
                        className="form-control"
                        id="summary"
                        name="summary"
                        placeholder="Brief summary of your article (optional, will use first 150 characters of content if left empty)"
                        value={formData.summary}
                        onChange={handleChange}
                        rows="2"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Featured Image URL</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaImage /></span>
                        <input
                          type="text"
                          className="form-control"
                          id="image"
                          name="image"
                          placeholder="Enter image URL"
                          value={formData.image}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-text">Leave default for a placeholder image</div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="author" className="form-label">Author</label>
                      <input
                        type="text"
                        className="form-control"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="tags" className="form-label">Tags</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="tags"
                          placeholder="Add a tag"
                          value={tagInput}
                          onChange={handleTagInput}
                          onKeyPress={handleTagKeyPress}
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={addTag}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      {/* Tag suggestions */}
                      <div className="suggested-tags my-2">
                        <small className="text-muted">Suggested: </small>
                        {suggestedTags.slice(0, 5).map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="btn btn-sm btn-outline-secondary me-1 mb-1"
                            onClick={() => {
                              if (!formData.tags.includes(tag)) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: [...prev.tags, tag]
                                }));
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      
                      {/* Tags display */}
                      {formData.tags.length > 0 && (
                        <div className="selected-tags mt-2">
                          {formData.tags.map((tag, idx) => (
                            <span key={idx} className="badge bg-primary me-1 mb-1">
                              {tag} <FaTimes className="ms-1 clickable" onClick={() => removeTag(tag)} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">Content <span className="text-danger">*</span></label>
                      <div className="form-text mb-2">Supports Markdown formatting</div>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        placeholder="Write your article content here..."
                        value={formData.content}
                        onChange={handleChange}
                        rows="15"
                        required
                      />
                    </div>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/blog/${id}`)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" /> Update Article
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;