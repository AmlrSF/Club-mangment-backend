const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true
  },
  commentDate: {
    type: Date,
    default: Date.now
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the author of the comment this replies to
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }]
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }],
  postType: {
    type: String,
    enum: ['profile', 'club'],
    required: true
  },
  comments: [commentSchema] // Embedding comments as a subdocument
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
