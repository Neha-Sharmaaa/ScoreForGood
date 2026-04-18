const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
