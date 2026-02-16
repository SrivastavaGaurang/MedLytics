// services/blogService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Get all blogs with pagination
export const getAllBlogs = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/blog?page=${page}&limit=${limit}`);
  return response.data;
};

// Get single blog by ID
export const getBlogById = async (id) => {
  const response = await axios.get(`${API_URL}/blog/${id}`);
  return response.data;
};

// Create new blog (requires authentication)
export const createBlog = async (blogData) => {
  const response = await axios.post(`${API_URL}/blog`, blogData, getAuthHeader());
  return response.data;
};

// Update blog (requires authentication and ownership)
export const updateBlog = async (id, blogData) => {
  const response = await axios.put(`${API_URL}/blog/${id}`, blogData, getAuthHeader());
  return response.data;
};

// Delete blog (requires authentication and ownership)
export const deleteBlog = async (id) => {
  const response = await axios.delete(`${API_URL}/blog/${id}`, getAuthHeader());
  return response.data;
};

// Like/Unlike blog
export const toggleLikeBlog = async (id) => {
  const response = await axios.post(`${API_URL}/blog/${id}/like`, {}, getAuthHeader());
  return response.data;
};

// Add comment to blog
export const addComment = async (id, content) => {
  const response = await axios.post(
    `${API_URL}/blog/${id}/comment`,
    { content },
    getAuthHeader()
  );
  return response.data;
};

// Delete comment
export const deleteComment = async (blogId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/blog/${blogId}/comment/${commentId}`,
    getAuthHeader()
  );
  return response.data;
};

// Get blogs by tag
export const getBlogsByTag = async (tag) => {
  const response = await axios.get(`${API_URL}/blog/tag/${tag}`);
  return response.data;
};

// Get user's own blogs
export const getMyBlogs = async () => {
  const response = await axios.get(`${API_URL}/blog/my/blogs`, getAuthHeader());
  return response.data;
};

// Search blogs
export const searchBlogs = async (searchTerm) => {
  const response = await axios.get(`${API_URL}/blog/search/query?term=${encodeURIComponent(searchTerm)}`);
  return response.data;
};