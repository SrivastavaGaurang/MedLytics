import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  InputGroup,
  Badge,
  Dropdown,
  Modal,
  Spinner,
  Alert,
  Pagination
} from "react-bootstrap";
import { 
  getAllBlogs, 
  deleteBlog, 
  getAllCategories,
  searchBlogs 
} from "../../services/blogService";

const BlogManagement = () => {
  const navigate = useNavigate();
  
  // State for blogs and UI
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch blogs and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsData, categoriesData] = await Promise.all([
          getAllBlogs(),
          getAllCategories()
        ]);
        
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("Failed to load blog posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters, sorting, and search
  useEffect(() => {
    let results = [...blogs];
    
    // Apply category filter
    if (selectedCategory) {
      results = results.filter(blog => blog.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === "author") {
        comparison = a.author.localeCompare(b.author);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredBlogs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogs, selectedCategory, searchTerm, sortField, sortDirection]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  // Confirm delete blog
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    
    setDeleting(true);
    try {
      await deleteBlog(blogToDelete._id);
      
      // Update blogs list
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setDeleteSuccess(true);
      
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteSuccess(false);
        setBlogToDelete(null);
      }, 1500);
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("Failed to delete the blog post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate text
  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render pagination
  const renderPagination = () => {
    const pageItems = [];
    
    // Previous button
    pageItems.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );
    
    // First page
    if (currentPage > 2) {
      pageItems.push(
        <Pagination.Item 
          key={1} 
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );
      
      if (currentPage > 3) {
        pageItems.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }
    
    // Pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pageItems.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pageItems.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }
      
      pageItems.push(
        <Pagination.Item 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Next button
    pageItems.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );
    
    return (
      <Pagination className="justify-content-center mt-4">
        {pageItems}
      </Pagination>
    );
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading blog management dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-0">Blog Management</h1>
          <p className="text-muted">Manage all your medical blog posts</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => navigate("/blog/new")}
            className="d-flex align-items-center"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create New Article
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col lg={4} className="mb-3 mb-lg-0">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title, summary, or author"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            <Col lg={3} className="mb-3 mb-lg-0">
              <Form.Select 
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={5} className="d-flex justify-content-lg-end">
              <div className="d-flex align-items-center">
                <span className="me-2">Sort by:</span>
                <div className="d-flex gap-2">
                  <Button 
                    variant={sortField === "date" ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleSortChange("date")}
                    className="d-flex align-items-center"
                  >
                    Date
                    {sortField === "date" && (
                      <i className={`bi bi-arrow-${sortDirection === "asc" ? "up" : "down"} ms-1`}></i>
                    )}
                  </Button>
                  <Button 
                    variant={sortField === "title" ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleSortChange("title")}
                    className="d-flex align-items-center"
                  >
                    Title
                    {sortField === "title" && (
                      <i className={`bi bi-arrow-${sortDirection === "asc" ? "up" : "down"} ms-1`}></i>
                    )}
                  </Button>
                  <Button 
                    variant={sortField === "author" ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleSortChange("author")}
                    className="d-flex align-items-center"
                  >
                    Author
                    {sortField === "author" && (
                      <i className={`bi bi-arrow-${sortDirection === "asc" ? "up" : "down"} ms-1`}></i>
                    )}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: "45%" }}>Title</th>
                  <th style={{ width: "15%" }}>Author</th>
                  <th style={{ width: "15%" }}>Category</th>
                  <th style={{ width: "15%" }}>Date</th>
                  <th style={{ width: "10%" }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map(blog => (
                    <tr key={blog._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="blog-thumbnail me-3"
                            style={{ 
                              width: "60px", 
                              height: "60px", 
                              backgroundImage: `url(${blog.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: "4px"
                            }}
                          ></div>
                          <div>
                            <h6 className="mb-1">
                              <Link to={`/blog/${blog._id}`} className="text-decoration-none">
                                {blog.title}
                              </Link>
                              {blog.featured && (
                                <Badge bg="warning" text="dark" className="ms-2">Featured</Badge>
                              )}
                            </h6>
                            <p className="text-muted small mb-0">
                              {truncate(blog.summary, 80)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{blog.author}</td>
                      <td>
                        <Badge bg="info" className="text-white">
                          {blog.category}
                        </Badge>
                      </td>
                      <td>{formatDate(blog.date)}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${blog._id}`}>
                              <i className="bi bi-three-dots"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item as={Link} to={`/blog/${blog._id}`}>
                                <i className="bi bi-eye me-2"></i>
                                View
                              </Dropdown.Item>
                              <Dropdown.Item as={Link} to={`/blog/edit/${blog._id}`}>
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger"
                                onClick={() => handleDeleteClick(blog)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <i className="bi bi-journal-x fs-3 mb-3 d-block text-muted"></i>
                      <p className="mb-0">No blog posts found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-white">
          <Row className="align-items-center">
            <Col>
              <span className="text-muted">
                Showing {Math.min(filteredBlogs.length, 1 + (currentPage - 1) * blogsPerPage)}-
                {Math.min(filteredBlogs.length, currentPage * blogsPerPage)} of {filteredBlogs.length} posts
              </span>
            </Col>
            <Col xs="auto">
              {renderPagination()}
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteSuccess ? (
            <Alert variant="success" className="mb-0">
              <i className="bi bi-check-circle me-2"></i>
              Blog post deleted successfully!
            </Alert>
          ) : (
            <>
              <p>Are you sure you want to delete the following blog post?</p>
              {blogToDelete && (
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div 
                    className="blog-thumbnail me-3"
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      backgroundImage: `url(${blogToDelete.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "4px"
                    }}
                  ></div>
                  <div>
                    <h6 className="mb-1">{blogToDelete.title}</h6>
                    <p className="text-muted small mb-0">
                      By {blogToDelete.author} • {formatDate(blogToDelete.date)}
                    </p>
                  </div>
                </div>
              )}
              <p className="mt-3 mb-0 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                This action cannot be undone.
              </p>
            </>
          )}
        </Modal.Body>
        {!deleteSuccess && (
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                    className="me-2"
                  />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default BlogManagement;