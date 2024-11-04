const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clubname: { type: String, required: true },  // Squad Handle (Club handle)
  description: { type: String },
  genre: { type: String, required: true },     // Category of the club
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Reference to the owner customer
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String },
   
  approved: { type: Boolean, default: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }], // Array of customer references
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }], // Array of customer references for moderators
  featured:{
    type:Boolean,
    default:false
  },
  // Permissions Section
  permissions: {
    postPermission: { type: String, enum: ['all', 'moderators'], default: 'moderators' }, // Post content permissions
    invitePermission: { type: String, enum: ['all', 'moderators'], default: 'all' }      // Invite new members permissions
  }
});

module.exports = mongoose.model('Club', clubSchema);
