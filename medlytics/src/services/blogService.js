// services/blogService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all blog posts
 */
export const getAllBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

/**
 * Get a single blog post by ID
 * @param {string} id - Blog post ID
 */
export const getBlogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new blog post
 * @param {Object} blogData - Blog data object
 */
export const createBlog = async (blogData) => {
  try {
    const response = await axios.post(`${API_URL}/blogs`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

/**
 * Update an existing blog post
 * @param {string} id - Blog post ID
 * @param {Object} blogData - Updated blog data
 */
export const updateBlog = async (id, blogData) => {
  try {
    const response = await axios.put(`${API_URL}/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a blog post
 * @param {string} id - Blog post ID
 */
export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get blogs filtered by tag
 * @param {string} tag - Tag to filter by
 */
export const getBlogsByTag = async (tag) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/tag/${tag}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blogs with tag ${tag}:`, error);
    throw error;
  }
};

/**
 * Search blogs by term
 * @param {string} term - Search term
 */
export const searchBlogs = async (term) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/search?term=${term}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching blogs with term ${term}:`, error);
    throw error;
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByTag,
  searchBlogs
};