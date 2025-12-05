// routes/blog.js
import express from 'express';
import Blog from '../models/Blog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new blog (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, summary, image, author, tags } = req.body;
    const newBlog = new Blog({
      title,
      content,
      summary,
      image,
      author,
      tags
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, summary, image, author, tags } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, summary, image, author, tags },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blogs by tag (public)
router.get('/tag/:tag', async (req, res) => {
  try {
    const tag = req.params.tag;
    const blogs = await Blog.find({ tags: tag }).sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs by tag:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search blogs (public)
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { author: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error searching blogs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;