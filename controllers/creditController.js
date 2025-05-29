const User = require('../models/User');

// POST /credits/buy
exports.buyCredits = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.credits += amount || 10; // default 10 credits
    await user.save();

    res.json({ message: 'Credits added', credits: user.credits });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /credits/spend
exports.spendCredits = async (req, res) => {
  try {
    const { userId, cost } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.credits < cost) {
      return res.status(400).json({ message: 'Not enough credits' });
    }

    user.credits -= cost;
    await user.save();

    res.json({ message: 'Credits spent', credits: user.credits });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
