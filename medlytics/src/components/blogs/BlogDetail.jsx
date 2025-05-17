// components/blogs/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getBlogById, deleteBlog } from '../../services/blogService';
import { FaEdit, FaTrash, FaArrowLeft, FaClock, FaUser, FaTags } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load the blog post. It may have been removed or is unavailable.');
        setLoading(false);
        console.error('Error fetching blog details:', err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deleteBlog(id);
        navigate('/blog');
      } catch (err) {
        setError('Failed to delete blog. Please try again.');
        console.error('Error deleting blog:', err);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Check if user is admin (for demo purposes)
  const isAdmin = isAuthenticated && user && user.email === "admin@medlytics.com";

  // Share functionality
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Medical Blog Article';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="blog-detail-container py-5">
      <div className="container">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/blog" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" /> Back to Blogs
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : blog ? (
          <>
            {/* Blog Header */}
            <div className="blog-header mb-5">
              <div className="row">
                <div className="col-md-8 mx-auto text-center">
                  {blog.tags && blog.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-primary-subtle text-primary me-2 mb-2">
                      {tag}
                    </span>
                  ))}
                  <h1 className="display-4 mb-3">{blog.title}</h1>
                  <div className="blog-meta d-flex justify-content-center align-items-center text-muted mb-4">
                    <div className="me-3">
                      <FaUser className="me-1" /> {blog.author}
                    </div>
                    <div>
                      <FaClock className="me-1" /> {formatDate(blog.date)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Featured Image */}
              <div className="blog-featured-image mb-5">
                <img 
                  src={blog.image || "https://via.placeholder.com/1200x600?text=Medical+Article"} 
                  className="img-fluid rounded shadow-sm"
                  alt={blog.title}
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="admin-controls mb-4 text-end">
                <Link to={`/admin/blog/edit/${blog._id}`} className="btn btn-outline-primary me-2">
                  <FaEdit className="me-1" /> Edit
                </Link>
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  <FaTrash className="me-1" /> Delete
                </button>
              </div>
            )}

            {/* Blog Content */}
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="blog-content mb-5">
                  <ReactMarkdown className="blog-markdown">
                    {blog.content}
                  </ReactMarkdown>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags mb-4">
                    <FaTags className="me-2 text-muted" />
                    {blog.tags.map((tag, idx) => (
                      <Link key={idx} to={`/blog?tag=${tag}`} className="badge bg-light text-secondary me-2 text-decoration-none">
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Share Buttons */}
                <div className="blog-share border-top pt-4 mt-4">
                  <p className="text-muted mb-2">Share this article</p>
                  <div className="d-flex">
                    <button 
                      className="btn btn-sm btn-outline-primary me-2" 
                      onClick={() => handleShare('twitter')}
                    >
                      Twitter
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleShare('facebook')} 
                    >
                      Facebook
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleShare('linkedin')}
                    >
                      LinkedIn
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleShare('copy')}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center my-5">
            <h2>Blog post not found</h2>
            <p>The article you're looking for may have been removed or is unavailable.</p>
            <Link to="/blog" className="btn btn-primary mt-3">
              Browse all blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;