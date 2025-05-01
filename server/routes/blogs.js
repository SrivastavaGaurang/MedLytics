// routes/blogs.js
import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

/**
 * @route   GET /api/blogs
 * @desc    Get all blogs
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/blogs/:id
 * @desc    Get blog by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err.message);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Private (TODO: Add authentication middleware)
 */
router.post('/', async (req, res) => {
  try {
    const { title, content, image, summary, author, tags } = req.body;
    
    // Create new blog
    const newBlog = new Blog({
      title,
      content,
      image,
      summary,
      author,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    const blog = await newBlog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update a blog
 * @access  Private (TODO: Add authentication middleware)
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, content, image, summary, author, tags } = req.body;
    
    // Find blog by ID
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (image) blog.image = image;
    if (summary) blog.summary = summary;
    if (author) blog.author = author;
    if (tags) blog.tags = tags.split(',').map(tag => tag.trim());
    
    // Save updated blog
    blog = await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error updating blog:', err.message);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete a blog
 * @access  Private (TODO: Add authentication middleware)
 */
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;