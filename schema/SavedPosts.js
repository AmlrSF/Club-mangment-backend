const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', 
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now 
  }
});

const SavedPost = mongoose.model('SavedPost', savedPostSchema);

module.exports = SavedPost;
