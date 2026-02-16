// models/Blog.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/800x400?text=Medical+Blog+Image'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema],
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
BlogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for like count
BlogSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Ensure virtuals are included in JSON
BlogSchema.set('toJSON', { virtuals: true });
BlogSchema.set('toObject', { virtuals: true });

const Blog = mongoose.model('Blog', BlogSchema);

export default Blog;