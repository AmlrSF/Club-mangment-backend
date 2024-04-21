const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  clubName: { type: String },
  description: { type: String },
  genre: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Reference to the owner customer
  createdAt: { type: Date, default:Date.now() },
  profilePicture: { type: String },
  categorie: { type: String },
  approved: { type: Boolean, default: false } ,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }] // Array of customer references
});

module.exports = mongoose.model('Club', clubSchema);
