// controllers/blogController.js
const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', ['name', 'email'])
      .sort({ createdAt: -1 });
    
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', ['name', 'email'])
      .populate('comments.user', ['name']);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    
    const newBlog = new Blog({
      title,
      content,
      category,
      image,
      author: req.user.id
    });
    
    const blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    
    // Find the blog
    let blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check user
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this blog' });
    }
    
    // Update fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.image = image || blog.image;
    
    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check user
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this blog' });
    }
    
    await blog.remove();
    res.json({ message: 'Blog post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    const newComment = {
      text: req.body.text,
      name: user.name,
      user: req.user.id
    };
    
    blog.comments.unshift(newComment);
    
    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Get comment
    const comment = blog.comments.find(
      comment => comment.id === req.params.comment_id
    );
    
    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Get remove index
    const removeIndex = blog.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);
    
    blog.comments.splice(removeIndex, 1);
    
    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like blog post
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check if the blog has already been liked by this user
    if (blog.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Blog already liked' });
    }
    
    blog.likes.unshift({ user: req.user.id });
    
    await blog.save();
    res.json(blog.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unlike blog post
exports.unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check if the blog has been liked by this user
    if (!blog.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Blog has not yet been liked' });
    }
    
    // Get remove index
    const removeIndex = blog.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    
    blog.likes.splice(removeIndex, 1);
    
    await blog.save();
    res.json(blog.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};