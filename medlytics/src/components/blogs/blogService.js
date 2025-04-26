// src/services/blogService.js
import axios from 'axios';

export const getBlogs = () => axios.get('/api/blogs');
export const getBlogById = (id) => axios.get(`/api/blogs/${id}`);
export const createBlog = (data) => axios.post('/api/blogs', data);
