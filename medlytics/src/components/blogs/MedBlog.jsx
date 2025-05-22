// components/blogs/MedBlog.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllBlogs, deleteBlog, getBlogsByTag } from '../../services/blogService';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTags, FaClock, FaCalendarAlt, FaBookmark, FaFilter, FaTools, FaTimes, FaWrench, FaUser } from 'react-icons/fa';

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
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(true);
  const { isAuthenticated, user } = useAuth0();

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
      const data = await getAllBlogs();
      setBlogs(data);
      
      // Extract all unique tags
      const tags = data.flatMap(blog => blog.tags || []).filter(Boolean);
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
      const data = await getBlogsByTag(tag);
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load blogs with tag "${tag}". Please try again.`);
      setLoading(false);
      console.error('Error fetching blogs by tag:', err);
    }
  };

  // Handle blog deletion
  const handleDelete = async (id) => {
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
    }
  };

  // Handle sorting blogs
  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    
    // Create a sorted copy of the blogs array
    const sortedBlogs = [...blogs];
    
    switch (sortOption) {
      case 'newest':
        sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'az':
        sortedBlogs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sortedBlogs.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setBlogs(sortedBlogs);
  };

  // Toggle bookmark for a blog
  const toggleBookmark = (blogId) => {
    let updatedBookmarks;
    
    if (bookmarkedBlogs.includes(blogId)) {
      updatedBookmarks = bookmarkedBlogs.filter(id => id !== blogId);
    } else {
      updatedBookmarks = [...bookmarkedBlogs, blogId];
    }
    
    setBookmarkedBlogs(updatedBookmarks);
    localStorage.setItem('bookmarkedBlogs', JSON.stringify(updatedBookmarks));
  };
  
  // Toggle showing only bookmarked blogs
  const toggleShowBookmarked = () => {
    setShowBookmarked(!showBookmarked);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate read time based on content length (rough estimate)
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes < 1 ? '< 1 min read' : `${minutes} min read`;
  };

  // Check if user is admin (for demo purposes)
  const isAdmin = isAuthenticated && user && user.email === "admin@medlytics.com";

  // Apply all filters to get final list of blogs to display
  const getFilteredBlogs = () => {
    return blogs.filter(blog => {
      // Filter by search term
      const matchesSearchTerm = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by tag
      const matchesTag = !filterTag || (blog.tags && blog.tags.includes(filterTag));
      
      // Filter by bookmarks
      const matchesBookmark = !showBookmarked || (bookmarkedBlogs.includes(blog._id));
      
      return matchesSearchTerm && matchesTag && matchesBookmark;
    });
  };

  const filteredBlogs = getFilteredBlogs();

  return (
    <div className="med-blog-container py-5">
      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div 
          className="modal d-block"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-body p-0">
                <div className="text-center p-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-3"
                    style={{ filter: 'invert(1)' }}
                    onClick={() => setShowMaintenanceModal(false)}
                  ></button>
                  
                  <div className="mb-4">
                    <div 
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '50%',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <FaTools className="text-white" size={35} />
                    </div>
                    <h2 className="text-white mb-0 fw-bold">Under Maintenance</h2>
                  </div>
                  
                  <div className="text-white-50 mb-4">
                    <p className="mb-3 fs-5">
                      We're currently upgrading our blog platform to serve you better!
                    </p>
                    <p className="mb-0">
                      Our team is working hard to bring you an enhanced reading experience with new features and improved performance.
                    </p>
                  </div>
                  
                  <div className="row text-center mb-4">
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="mb-2">
                          <FaWrench className="text-white" size={24} />
                        </div>
                        <h6 className="text-white mb-1">Performance</h6>
                        <small className="text-white-50">Faster loading times</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="mb-2">
                          <FaBookmark className="text-white" size={24} />
                        </div>
                        <h6 className="text-white mb-1">Features</h6>
                        <small className="text-white-50">Enhanced bookmarking</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="mb-2">
                          <FaSearch className="text-white" size={24} />
                        </div>
                        <h6 className="text-white mb-1">Search</h6>
                        <small className="text-white-50">Improved search functionality</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="progress mb-2" style={{ height: '6px', background: 'rgba(255,255,255,0.2)' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: '75%', 
                          background: 'linear-gradient(90deg, #00d4ff, #090979)'
                        }}
                      ></div>
                    </div>
                    <small className="text-white-50">75% Complete</small>
                  </div>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-light px-4 py-2"
                      onClick={() => setShowMaintenanceModal(false)}
                    >
                      Continue Browsing
                    </button>
                    <Link to="/" className="btn btn-outline-light px-4 py-2">
                      Back to Home
                    </Link>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-white-50 small mb-0">
                      Expected completion: <strong className="text-white">Soon</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Hero Section */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 mb-3">Medical Blog</h1>
            <p className="lead text-muted mb-4">
              Latest insights, research, and advice from healthcare professionals for better understanding of medical conditions and health management.
            </p>
            <div className="d-flex justify-content-center gap-3">
              {isAuthenticated && (
                <Link to="/admin/blog/create" className="btn btn-primary">
                  <FaPlus className="me-2" /> New Article
                </Link>
              )}
              <button 
                className={`btn ${showBookmarked ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={toggleShowBookmarked}
              >
                <FaBookmark className="me-2" /> {showBookmarked ? 'Showing Bookmarks' : 'Show Bookmarks'}
              </button>
            </div>
          </div>
        </div>

        {/* Search, Filter, and Sort Row */}
        <div className="card shadow-sm mb-5">
          <div className="card-body p-4">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search articles by title, content, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Tag Filter */}
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaTags />
                  </span>
                  <select 
                    className="form-select"
                    value={filterTag}
                    onChange={(e) => handleTagFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {allTags.map((tag, index) => (
                      <option key={index} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Sort By */}
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaFilter />
                  </span>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
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
            <p className="mt-3 text-muted">Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="text-muted mb-0">
                {filteredBlogs.length === 0 
                  ? 'No articles found' 
                  : `Showing ${filteredBlogs.length} article${filteredBlogs.length !== 1 ? 's' : ''}`}
                {filterTag && ` in "${filterTag}"`}
                {showBookmarked && ' from your bookmarks'}
              </p>
              
              {filterTag && (
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleTagFilter('')}
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Featured Article (first blog) */}
            {filteredBlogs.length > 0 && (
              <div className="featured-article mb-5">
                <div className="card border-0 shadow-sm">
                  <div className="row g-0">
                    <div className="col-lg-6">
                      <img 
                        src={filteredBlogs[0].image || "https://via.placeholder.com/800x600?text=Medical+Blog"} 
                        className="img-fluid rounded-start h-100"
                        alt={filteredBlogs[0].title}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-lg-6">
                      <div className="card-body p-4 h-100 d-flex flex-column">
                        <div>
                          {filteredBlogs[0].tags && filteredBlogs[0].tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="badge bg-primary-subtle text-primary me-2 mb-2 clickable"
                              onClick={() => handleTagFilter(tag)}
                              style={{ cursor: 'pointer' }}
                            >
                              {tag}
                            </span>
                          ))}
                          <h2 className="card-title h3 mt-3">{filteredBlogs[0].title}</h2>
                          <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                            <div>
                              <FaUser className="me-1" /> {filteredBlogs[0].author}
                            </div>
                            <div>
                              <FaCalendarAlt className="me-1" /> {formatDate(filteredBlogs[0].date)}
                            </div>
                            <div>
                              <FaClock className="me-1" /> {calculateReadTime(filteredBlogs[0].content)}
                            </div>
                          </div>
                          <p className="card-text">
                            {filteredBlogs[0].summary || filteredBlogs[0].content.substring(0, 200)}...
                          </p>
                        </div>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <Link to={`/blog/${filteredBlogs[0]._id}`} className="btn btn-primary">
                            Read Full Article
                          </Link>
                          
                          <button 
                            className={`btn btn-sm ${bookmarkedBlogs.includes(filteredBlogs[0]._id) ? 'btn-warning' : 'btn-outline-secondary'}`}
                            onClick={() => toggleBookmark(filteredBlogs[0]._id)}
                            aria-label={bookmarkedBlogs.includes(filteredBlogs[0]._id) ? "Remove bookmark" : "Add bookmark"}
                          >
                            <FaBookmark />
                          </button>
                        </div>
                        
                        {isAdmin && (
                          <div className="mt-3">
                            <Link to={`/admin/blog/edit/${filteredBlogs[0]._id}`} className="btn btn-sm btn-outline-secondary me-2">
                              <FaEdit className="me-1" /> Edit
                            </Link>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(filteredBlogs[0]._id)}
                            >
                              <FaTrash className="me-1" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Blog Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredBlogs.slice(1).map((blog) => (
                <div className="col" key={blog._id}>
                  <div className="card h-100 border-0 shadow-sm hover-effect">
                    <img 
                      src={blog.image || "https://via.placeholder.com/400x200?text=Medical+Blog"}
                      className="card-img-top"
                      alt={blog.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <div className="mb-2">
                        {blog.tags && blog.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="badge bg-primary-subtle text-primary me-1 mb-1"
                            onClick={() => handleTagFilter(tag)}
                            style={{ cursor: 'pointer' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h5 className="card-title">{blog.title}</h5>
                      <div className="d-flex flex-wrap gap-2 text-muted small mb-2">
                        <span>
                          <FaUser className="me-1" /> {blog.author}
                        </span>
                        <span>•</span>
                        <span>
                          <FaCalendarAlt className="me-1" /> {formatDate(blog.date)}
                        </span>
                        <span>•</span>
                        <span>
                          <FaClock className="me-1" /> {calculateReadTime(blog.content)}
                        </span>
                      </div>
                      <p className="card-text">
                        {blog.summary || blog.content.substring(0, 120)}...
                      </p>
                    </div>
                    <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                      <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
                        Read More
                      </Link>
                      
                      <div className="d-flex gap-2">
                        <button 
                          className={`btn btn-sm ${bookmarkedBlogs.includes(blog._id) ? 'btn-warning' : 'btn-outline-secondary'}`}
                          onClick={() => toggleBookmark(blog._id)}
                          aria-label={bookmarkedBlogs.includes(blog._id) ? "Remove bookmark" : "Add bookmark"}
                        >
                          <FaBookmark />
                        </button>
                        
                        {isAdmin && (
                          <>
                            <Link to={`/admin/blog/edit/${blog._id}`} className="btn btn-sm btn-outline-secondary">
                              <FaEdit />
                            </Link>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(blog._id)}
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <div className="text-center my-5 py-5">
                <div className="display-6 text-muted mb-4">No articles found</div>
                <p className="lead">
                  {showBookmarked 
                    ? "You haven't bookmarked any articles yet." 
                    : (filterTag 
                      ? `No articles match the "${filterTag}" category${searchTerm ? ' and search term' : ''}.` 
                      : "Try adjusting your search or filter criteria.")}
                </p>
                <div className="mt-4">
                  {showBookmarked && (
                    <button 
                      className="btn btn-primary me-3"
                      onClick={() => setShowBookmarked(false)}
                    >
                      View All Articles
                    </button>
                  )}
                  {filterTag && (
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => handleTagFilter('')}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination (basic implementation) */}
            {filteredBlogs.length > 0 && (
              <nav className="d-flex justify-content-center mt-5">
                <ul className="pagination">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedBlog;