import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBlogById, deleteBlog, toggleLikeBlog, addComment } from '../../services/blogService';
import ReactMarkdown from 'react-markdown';
import {
  FaArrowLeft, FaEdit, FaTrash, FaHeart, FaRegHeart,
  FaComment, FaShareAlt, FaCalendarAlt, FaUser, FaClock,
  FaTwitter, FaFacebook, FaLinkedin, FaLink, FaTags, FaEye
} from 'react-icons/fa';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogById(id);
      setBlog(data);
      setLikesCount(data.likes?.length || 0);

      // Check if current user has liked
      if (isAuthenticated && user && data.likes) {
        setLiked(data.likes.includes(user.id || user._id));
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load blog post. Please try again later.');
      setLoading(false);
      console.error('Error fetching blog:', err);
    }
  };

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

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like this post');
      return;
    }

    try {
      await toggleLikeBlog(id);
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    } catch (err) {
      console.error('Error liking blog:', err);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      setSubmittingComment(true);
      await addComment(id, newComment);
      setNewComment('');
      // Refresh blog to get updated comments
      await fetchBlog();
      setSubmittingComment(false);
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
      setSubmittingComment(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this article: ${blog?.title}`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isAdmin = isAuthenticated && user && (user.email === "admin@medlytics.com" || user.role === 'admin');
  const isAuthor = isAuthenticated && user && blog && (blog.author === user.id || blog.author === user._id || blog.author?._id === user._id);

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-error">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error || 'Blog post not found.'}</p>
            <hr />
            <Link to="/blog" className="btn btn-primary">
              <FaArrowLeft className="me-2" /> Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <div className="blog-hero" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {/* Back Button - Positioned below navbar */}
              <Link to="/blog" className="blog-back-button">
                <FaArrowLeft /> Back to Blogs
              </Link>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="blog-tags-hero mb-3">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-primary me-2">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="blog-title-hero">{blog.title}</h1>

              {/* Meta Information */}
              <div className="blog-meta-hero">
                <div className="meta-item">
                  <FaUser /> <span>{blog.authorName || blog.author?.name || 'Anonymous'}</span>
                </div>
                <div className="meta-item">
                  <FaCalendarAlt /> <span>{formatDate(blog.createdAt || blog.date)}</span>
                </div>
                <div className="meta-item">
                  <FaClock /> <span>{Math.ceil((blog.content?.length || 0) / 1000)} min read</span>
                </div>
                <div className="meta-item">
                  <FaEye /> <span>{blog.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {/* Featured Image */}
              {blog.image && (
                <div className="blog-featured-image mb-4">
                  <img src={blog.image} alt={blog.title} className="img-fluid rounded" />
                </div>
              )}

              {/* Blog Summary */}
              {blog.summary && (
                <div className="blog-summary-box">
                  <p className="lead">{blog.summary}</p>
                </div>
              )}

              {/* Blog Content */}
              <div className="blog-markdown-content">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>

              {/* Interaction Bar */}
              <div className="blog-interaction-bar">
                <div className="interaction-left">
                  <button
                    className={`btn-like ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    title="Like this article"
                  >
                    {liked ? <FaHeart /> : <FaRegHeart />}
                    <span>{likesCount}</span>
                  </button>

                  <button
                    className="btn-comment"
                    onClick={() => setShowComments(!showComments)}
                    title="View comments"
                  >
                    <FaComment />
                    <span>{blog.comments?.length || 0}</span>
                  </button>

                  <div className="share-dropdown">
                    <button className="btn-share">
                      <FaShareAlt /> Share
                    </button>
                    <div className="share-menu">
                      <button onClick={() => handleShare('twitter')}>
                        <FaTwitter /> Twitter
                      </button>
                      <button onClick={() => handleShare('facebook')}>
                        <FaFacebook /> Facebook
                      </button>
                      <button onClick={() => handleShare('linkedin')}>
                        <FaLinkedin /> LinkedIn
                      </button>
                      <button onClick={() => handleShare('copy')}>
                        <FaLink /> Copy Link
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admin Controls */}
                {(isAdmin || isAuthor) && (
                  <div className="interaction-right">
                    <Link
                      to={`/admin/blog/edit/${blog._id}`}
                      className="btn-edit"
                      title="Edit article"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="btn-delete"
                      title="Delete article"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="blog-comments-section">
                  <h3 className="comments-title">
                    <FaComment /> Comments ({blog.comments?.length || 0})
                  </h3>

                  {/* Add Comment Form */}
                  {isAuthenticated ? (
                    <form onSubmit={handleAddComment} className="add-comment-form">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={submittingComment}
                      ></textarea>
                      <button
                        type="submit"
                        className="btn btn-primary mt-2"
                        disabled={submittingComment || !newComment.trim()}
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </form>
                  ) : (
                    <div className="alert alert-info">
                      Please <Link to="/login">login</Link> to leave a comment.
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="comments-list">
                    {blog.comments && blog.comments.length > 0 ? (
                      blog.comments.map((comment, idx) => (
                        <div key={idx} className="comment-item">
                          <div className="comment-header">
                            <FaUser className="comment-avatar" />
                            <div>
                              <strong>{comment.userName || 'Anonymous'}</strong>
                              <small className="text-muted ms-2">
                                {formatDate(comment.createdAt)}
                              </small>
                            </div>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;