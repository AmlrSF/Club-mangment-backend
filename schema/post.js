const mongoose = require('mongoose');

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
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
