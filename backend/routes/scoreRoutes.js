const express = require('express');
const router = express.Router();
const { getScores, addScore, getAllScores } = require('../controllers/scoreController');
const { protect, admin } = require('../middlewares/auth');

router.route('/').get(protect, getScores).post(protect, addScore);
router.route('/all').get(protect, admin, getAllScores);

module.exports = router;
