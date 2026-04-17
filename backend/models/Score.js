const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  points: {
    type: Number,
    required: [true, 'Please add stableford points'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  courseName: {
    type: String,
    required: [true, 'Please add a course name'],
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Score', scoreSchema);
