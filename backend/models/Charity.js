const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a charity name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  totalDonationRaised: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Charity', charitySchema);
