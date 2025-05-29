const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ NEW: Render dashboard page
router.get('/', authMiddleware, (req, res) => {
  res.render('dashboard', { user: req.user, query: req.query });
});

// ✅ NEW: Test route without auth middleware
router.get('/test', (req, res) => {
  console.log('🧪 Dashboard test route hit!');
  console.log('🔍 req.user:', req.user);
  console.log('🔍 req.isAuthenticated():', req.isAuthenticated ? req.isAuthenticated() : 'undefined');
  
  // Create a mock user for testing
  const mockUser = {
    name: 'Test User',
    role: 'client',
    email: 'test@example.com'
  };
  
  res.render('dashboard', { user: mockUser });
});

// @route   GET /dashboard/client
// @desc    Render client job management page
// @access  Private (client only)
router.get('/client', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.redirect('/dashboard?error=clients_only');
    }

    res.render('client-jobs', { user: req.user });
  } catch (err) {
    console.error('Client dashboard page error:', err);
    res.redirect('/dashboard?error=page_load_failed');
  }
});

// @route   GET /dashboard/professional
// @desc    Get professional dashboard with bids and projects
// @access  Private (professional only)
router.get('/professional', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.redirect('/dashboard?error=professionals_only');
    }

    // Get jobs where user has placed bids
    const jobsWithMyBids = await Job.find({ 'bids.user': req.user._id })
      .populate('createdBy', 'name email')
      .populate('bids.user', 'name email')
      .sort({ createdAt: -1 });

    // Filter to only show user's bids
    const myBids = jobsWithMyBids.map(job => {
      const myBid = job.bids.find(bid => bid.user._id.toString() === req.user._id.toString());
      return {
        job: {
          _id: job._id,
          title: job.title,
          category: job.category,
          location: job.location,
          status: job.status,
          createdBy: job.createdBy,
          createdAt: job.createdAt
        },
        bid: myBid,
        totalBids: job.bids.length,
        maxBids: job.maxBids
      };
    });

    res.render('professional-dashboard', { 
      user: req.user, 
      myBids: myBids 
    });
  } catch (err) {
    console.error('Professional dashboard error:', err);
    res.redirect('/dashboard?error=page_load_failed');
  }
});

module.exports = router;
