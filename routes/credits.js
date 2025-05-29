const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /credits/buy
// @desc    Add credits to logged-in user's account
// @access  Private
router.post('/buy', authMiddleware, async (req, res) => {
  const amount = req.body.amount;

  try {
    // Add credits directly to the authenticated user
    req.user.credits += amount;
    await req.user.save();

    res.json({ message: 'Credits added', credits: req.user.credits });
  } catch (err) {
    console.error('💥 Credit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
