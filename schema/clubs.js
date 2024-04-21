const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  club_name: { type: String },
  club_description: { type: String },
  club_genre: { type: String, required: true },
  club_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Reference to the owner customer
  created_at: { type: Date, default:Date.now() },
  profile_picture: { type: String },
  categorie: { type: String },
  approved: { type: Boolean, default: false } ,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }] // Array of customer references
});

module.exports = mongoose.model('Club', clubSchema);
