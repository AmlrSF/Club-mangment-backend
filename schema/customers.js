const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  profileImage: String,
  phoneNumber: String,
  bio: String,
  passwordHash: String,
  role: {
    type: Number,
    default: 0
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  },
  facebookLink: String,
  linkedinLink: String,
  Identificated:{
    type:Boolean,
    default: false
  },
  classe:String,
  cvAttachment: String, // Assuming the CV attachment is stored as a file path
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }] // Assuming interests are stored in another schema named 'Interest'
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
