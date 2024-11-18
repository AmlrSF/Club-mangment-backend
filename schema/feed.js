const mongoose = require('mongoose');

// Import the Interest model
const Interest = require('../schema/interest');

// Define the Feed schema
const feedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest' // Reference to the Interest model
  }]
});

// Create the Feed model
const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
