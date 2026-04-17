const Charity = require('../models/Charity');

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find();
    res.status(200).json(charities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a charity
// @route   POST /api/charities
// @access  Private/Admin
const createCharity = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }
    const charity = await Charity.create({ name, description });
    res.status(201).json(charity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCharities,
  createCharity
};
