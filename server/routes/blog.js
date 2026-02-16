// routes/blog.js
import express from 'express';
import Blog from '../models/Blog.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all blogs (public) with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ published: true })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Blog.countDocuments({ published: true });

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single blog by ID (public) - increment views
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.user', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog by ID:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new blog (requires authentication)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, summary, image, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newBlog = new Blog({
      title,
      content,
      summary: summary || content.substring(0, 150) + '...',
      image: image || 'https://via.placeholder.com/800x400?text=Medical+Blog+Image',
      author: req.user._id,
      authorName: req.user.name,
      tags: tags || []
    });

    const savedBlog = await newBlog.save();
    await savedBlog.populate('author', 'name email');

    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update blog (requires authentication and ownership)
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const { title, content, summary, image, tags, published } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.summary = summary || blog.summary;
    blog.image = image || blog.image;
    blog.tags = tags || blog.tags;
    blog.published = published !== undefined ? published : blog.published;

    const updatedBlog = await blog.save();
    await updatedBlog.populate('author', 'name email');

    res.json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete blog (requires authentication and ownership)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Like/Unlike blog (requires authentication)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userIndex = blog.likes.indexOf(req.user._id);

    if (userIndex > -1) {
      // Unlike - remove user from likes
      blog.likes.splice(userIndex, 1);
    } else {
      // Like - add user to likes
      blog.likes.push(req.user._id);
    }

    await blog.save();
    await blog.populate('author', 'name email');

    res.json({
      message: userIndex > -1 ? 'Blog unliked' : 'Blog liked',
      likeCount: blog.likes.length,
      isLiked: userIndex === -1
    });
  } catch (err) {
    console.error('Error liking blog:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add comment to blog (requires authentication)
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = {
      user: req.user._id,
      userName: req.user.name,
      content: content.trim()
    };

    blog.comments.push(newComment);
    await blog.save();
    await blog.populate('comments.user', 'name');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: blog.comments[blog.comments.length - 1]
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete comment (requires authentication and ownership)
router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or the blog
    if (comment.user.toString() !== req.user._id.toString() &&
      blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    blog.comments.pull(req.params.commentId);
    await blog.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get blogs by tag (public)
router.get('/tag/:tag', async (req, res) => {
  try {
    const tag = req.params.tag;
    const blogs = await Blog.find({ tags: tag, published: true })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs by tag:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's own blogs (requires authentication)
router.get('/my/blogs', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching user blogs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Search blogs (public)
router.get('/search/query', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const blogs = await Blog.find({
      published: true,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { authorName: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error('Error searching blogs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;