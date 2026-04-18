const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/stripeController');
const { protect } = require('../middleware/authMiddleware'); // Assuming we want it protected

router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;
