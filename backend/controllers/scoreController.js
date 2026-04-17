const Score = require('../models/Score');

// @desc    Get user scores
// @route   GET /api/scores
// @access  Private
const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new score
// @route   POST /api/scores
// @access  Private
const addScore = async (req, res) => {
  try {
    const { points, courseName } = req.body;

    if (!points || !courseName) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const score = await Score.create({
      points,
      courseName,
      user: req.user.id
    });

    res.status(201).json(score);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all scores (Admin only)
// @route   GET /api/scores/all
// @access  Private/Admin
const getAllScores = async (req, res) => {
  try {
    const scores = await Score.find().populate('user', 'name email').sort({ date: -1 });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getScores,
  addScore,
  getAllScores
};
