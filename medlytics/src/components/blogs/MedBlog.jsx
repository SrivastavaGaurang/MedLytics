// components/blogs/Med Blog.jsx - Professional Enhanced Version
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBlogs, deleteBlog, getBlogsByTag } from '../../services/blogService';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaTags, FaClock,
  FaCalendarAlt, FaBookmark, FaUser, FaEye, FaHeart, FaComment
} from 'react-icons/fa';
import './Medblog.css';

const MedBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [allTags, setAllTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch all blogs on component mount and handle query params
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setFilterTag(tagFromUrl);
      fetchBlogsByTag(tagFromUrl);
    } else {
      fetchBlogs();
    }

    // Load bookmarked blogs from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedBlogs');
    if (savedBookmarks) {
      setBookmarkedBlogs(JSON.parse(savedBookmarks));
    }
  }, [searchParams]);

  // Function to fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs();

      // Handle both array and paginated object response
      let blogsArray = [];
      if (Array.isArray(response)) {
        blogsArray = response;
      } else if (response && response.blogs) {
        blogsArray = response.blogs;
      } else if (response && typeof response === 'object') {
        // Fallback for unexpected formats
        blogsArray = [];
      }

      setBlogs(blogsArray);

      // Extract all unique tags
      const tags = blogsArray.flatMap(blog => blog.tags || []).filter(Boolean);
      setAllTags([...new Set(tags)]);

      setLoading(false);
    } catch (err) {
      setError('Failed to load blogs. Please try again later.');
      setLoading(false);
      console.error('Error fetching blogs:', err);
    }
  };

  // Function to fetch blogs by tag
  const fetchBlogsByTag = async (tag) => {
    try {
      setLoading(true);
      const response = await getBlogsByTag(tag);

      // Handle both array and object response
      const blogsArray = Array.isArray(response) ? response : (response?.blogs || []);
      setBlogs(blogsArray);

      setLoading(false);
    } catch (err) {
      setError(`Failed to load blogs with tag "${tag}". Please try again.`);
      setLoading(false);
      console.error('Error fetching blogs by tag:', err);
    }
  };

  // Handle blog deletion
  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));

        // Also remove from bookmarks if present
        if (bookmarkedBlogs.includes(id)) {
          const updatedBookmarks = bookmarkedBlogs.filter(bookmarkId => bookmarkId !== id);
          setBookmarkedBlogs(updatedBookmarks);
          localStorage.setItem('bookmarkedBlogs', JSON.stringify(updatedBookmarks));
        }
      } catch (err) {
        setError('Failed to delete blog. Please try again.');
        console.error('Error deleting blog:', err);
      }
    }
  };

  // Handle filter by tag
  const handleTagFilter = (tag) => {
    setFilterTag(tag);
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
      fetchBlogs();
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle bookmark
  const toggleBookmark = (blogId, e) => {
    e.preventDefault();
    e.stopPropagation();

    let updatedBookmarks;
    if (bookmarkedBlogs.includes(blogId)) {
      updatedBookmarks = bookmarkedBlogs.filter(id => id !== blogId);
    } else {
      updatedBookmarks = [...bookmarkedBlogs, blogId];
    }
    setBookmarkedBlogs(updatedBookmarks);
    localStorage.setItem('bookmarkedBlogs', JSON.stringify(updatedBookmarks));
  };

  // Filter and sort blogs
  const getFilteredBlogs = () => {
    let filtered = [...blogs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by bookmarked
    if (showBookmarked) {
      filtered = filtered.filter(blog => bookmarkedBlogs.includes(blog._id));
    }

    // Sort blogs
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredBlogs = getFilteredBlogs();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Check if user is admin or author
  const isAdmin = isAuthenticated && user && (user.email === "admin@medlytics.com" || user.role === 'admin');
  const isAuthor = (blog) => isAuthenticated && user && (blog.author === user.id || blog.author === user._id || blog.author?._id === user._id);

  return (
    <div className="medblog-page">
      {/* Hero Section */}
      <div className="medblog-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="hero-title">MedLytics Health Blog</h1>
              <p className="hero-subtitle">Discover insights on health, wellness, and medical technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="medblog-content">
        <div className="container">
          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              <strong>Error!</strong> {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="search-filter-section mb-4">
            <div className="row g-3">
              <div className="col-lg-5">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search articles by title, content..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <select
                  className="form-select sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">📅 Newest First</option>
                  <option value="oldest">🕒 Oldest First</option>
                  <option value="popular">❤️ Most Popular</option>
                </select>
              </div>
              <div className="col-lg-4 text-end">
                <Link to="/admin/blog/create" className="btn-create-blog">
                  <FaPlus /> New Article
                </Link>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="tags-section mb-4">
              <div className="tags-label">
                <FaTags /> Filter by Tag:
              </div>
              <div className="tags-list">
                <button
                  className={`tag-btn ${!filterTag ? 'active' : ''}`}
                  onClick={() => handleTagFilter('')}
                >
                  All
                </button>
                {allTags.map((tag, idx) => (
                  <button
                    key={idx}
                    className={`tag-btn ${filterTag === tag ? 'active' : ''}`}
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bookmark Filter */}
          <div className="bookmark-filter mb-4">
            <label className="bookmark-checkbox">
              <input
                type="checkbox"
                checked={showBookmarked}
                onChange={(e) => setShowBookmarked(e.target.checked)}
              />
              <FaBookmark className="ms-2 me-1" />
              Show only bookmarked ({bookmarkedBlogs.length})
            </label>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading articles...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No articles found</h3>
              <p className="text-muted">
                {showBookmarked
                  ? 'You haven\'t bookmarked any articles yet.'
                  : searchTerm || filterTag
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Be the first to create an article!'}
              </p>
              {isAuthenticated && !searchTerm && !filterTag && (
                <Link to="/admin/blog/create" className="btn-create-blog mt-3">
                  <FaPlus /> Create First Article
                </Link>
              )}
            </div>
          ) : (
            <div className="row">
              {filteredBlogs.map((blog) => (
                <div key={blog._id} className="col-lg-4 col-md-6 mb-4">
                  <Link to={`/blog/${blog._id}`} className="blog-card-link">
                    <div className="blog-card">
                      {/* Card Image */}
                      {blog.image && (
                        <div className="blog-card-image">
                          <img src={blog.image} alt={blog.title} />
                          <div className="blog-card-overlay">
                            <span className="read-more-text">Read Article →</span>
                          </div>
                        </div>
                      )}

                      {/* Card Body */}
                      <div className="blog-card-body">
                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="blog-card-tags">
                            {blog.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="tag-badge">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="blog-card-title">{blog.title}</h3>

                        {/* Summary */}
                        <p className="blog-card-summary">
                          {blog.summary || (blog.content?.substring(0, 120) + '...')}
                        </p>

                        {/* Meta Info */}
                        <div className="blog-card-meta">
                          <div className="meta-left">
                            <span className="meta-item">
                              <FaUser /> {blog.authorName || 'Anonymous'}
                            </span>
                            <span className="meta-item">
                              <FaClock /> {formatDate(blog.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="blog-card-stats">
                          <span className="stat-item">
                            <FaHeart /> {blog.likes?.length || 0}
                          </span>
                          <span className="stat-item">
                            <FaComment /> {blog.comments?.length || 0}
                          </span>
                          <span className="stat-item">
                            <FaEye /> {blog.views || 0}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="blog-card-actions">
                          <button
                            className={`btn-bookmark ${bookmarkedBlogs.includes(blog._id) ? 'bookmarked' : ''}`}
                            onClick={(e) => toggleBookmark(blog._id, e)}
                            title="Bookmark"
                          >
                            <FaBookmark />
                          </button>

                          {(isAdmin || isAuthor(blog)) && (
                            <>
                              <Link
                                to={`/admin/blog/edit/${blog._id}`}
                                className="btn-edit-card"
                                onClick={(e) => e.stopPropagation()}
                                title="Edit"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                className="btn-delete-card"
                                onClick={(e) => handleDelete(blog._id, e)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedBlog;