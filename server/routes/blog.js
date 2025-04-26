// routes/blog.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', blogController.getAllBlogs);

// @route   GET api/posts/:id
// @desc    Get blog post by ID
// @access  Public
router.get('/:id', blogController.getBlogById);

// @route   POST api/posts
// @desc    Create a blog post
// @access  Private
router.post('/', auth, blogController.createBlog);

// @route   PUT api/posts/:id
// @desc    Update a blog post
// @access  Private
router.put('/:id', auth, blogController.updateBlog);

// @route   DELETE api/posts/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id', auth, blogController.deleteBlog);

// @route   POST api/posts/comment/:id
// @desc    Comment on a blog post
// @access  Private
router.post('/comment/:id', auth, blogController.addComment);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, blogController.deleteComment);

// @route   PUT api/posts/like/:id
// @desc    Like a blog post
// @access  Private
router.put('/like/:id', auth, blogController.likeBlog);

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a blog post
// @access  Private
router.put('/unlike/:id', auth, blogController.unlikeBlog);

module.exports = router;