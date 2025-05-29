const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /directory with optional search, category filter, and sorting
router.get('/', async (req, res) => {
  try {
    const { q, category, sortBy } = req.query;
    const filter = { role: 'professional' };

    // Search filter
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { category: regex },
        { location: regex },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Sort logic
    let sort = {};
    if (sortBy === 'featured') sort = { isFeatured: -1 };
    else if (sortBy === 'recommended') sort = { isRecommended: -1 };
    else sort = { rating: -1 };

    const professionals = await User.find(filter)
      .select('name category location rating isFeatured isRecommended recommendationsCount')
      .sort(sort);

    res.render('directory', {
      professionals,
      query: q,
      selectedCategory: category,
    });
  } catch (err) {
    console.error('❌ Directory load error:', err);
    res.status(500).send('Error loading directory');
  }
});

// GET /directory/:id
router.get('/:id', async (req, res) => {
  try {
    const pro = await User.findById(req.params.id).select('name category location rating bio reviews isRecommended recommendationsCount');
    if (!pro) return res.status(404).send('Professional not found');
    res.render('profile', { pro, currentUser: req.user });
  } catch (err) {
    res.status(500).send('Error loading profile');
  }
});

// GET /profile/edit — Edit form for current user
router.get('/profile/edit', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'professional') {
    return res.status(403).send('Not authorized - Only professionals can edit profiles');
  }

  try {
    const pro = await User.findById(req.user._id);
    if (!pro) {
      return res.status(404).send('User not found');
    }

    res.render('edit-profile', { pro });
  } catch (err) {
    console.error('Error loading profile editor:', err);
    res.status(500).send('Error loading profile editor');
  }
});

// POST /profile/edit — Save updated profile
router.post('/profile/edit', authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser || currentUser.role !== 'professional') {
      return res.status(403).send('Not authorized');
    }

    const { name, category, otherCategory, location, bio } = req.body;

    // Handle "Other" category selection
    let finalCategory = category;
    if (category === 'Other' && otherCategory && otherCategory.trim()) {
      finalCategory = otherCategory.trim();
    }

    await User.findByIdAndUpdate(currentUser._id, {
      name,
      category: finalCategory,
      location,
      bio,
    });

    res.redirect(`/directory/${currentUser._id}`);
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).send('Error updating profile');
  }
});

module.exports = router;
