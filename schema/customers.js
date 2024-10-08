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
  Identificated:{
    type:Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  },
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }] // Assuming interests are stored in another schema named 'Interest'
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
