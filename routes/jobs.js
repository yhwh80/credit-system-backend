const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');

const BID_COST = 5;

// @route   GET /jobs/post
// @desc    Display job posting form
// @access  Private (clients only)
router.get('/post', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.redirect('/dashboard?error=clients_only');
    }
    
    res.render('post-job', { user: req.user });
  } catch (err) {
    console.error('Post job page error:', err);
    res.redirect('/dashboard?error=page_load_failed');
  }
});

// @route   GET /jobs/browse
// @desc    Browse available jobs for professionals
// @access  Private (professionals only)
router.get('/browse', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.redirect('/dashboard?error=professionals_only');
    }

    const { category, location, search } = req.query;
    let query = { status: 'open' };

    // Build search query
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'name')
      .populate('bids.user', 'name')
      .sort({ createdAt: -1 });

    // Filter out full jobs and jobs user already bid on
    const availableJobs = jobs.filter(job => {
      const hasUserBid = job.bids.some(bid => bid.user._id.toString() === req.user._id.toString());
      const isNotFull = job.bids.length < job.maxBids;
      return !hasUserBid && isNotFull;
    });

    res.render('browse-jobs', { 
      user: req.user, 
      jobs: availableJobs,
      filters: { 
        category: category || '', 
        location: location || '', 
        search: search || '' 
      },
      bidCost: BID_COST
    });
  } catch (err) {
    console.error('Browse jobs error:', err);
    res.redirect('/dashboard?error=browse_failed');
  }
});

// @route   POST /jobs/create
// @desc    Create a new job (clients only)
// @access  Private
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, location, category, otherCategory } = req.body;

  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create jobs' });
    }

    // Handle "Other" category
    const finalCategory = category === 'Other' && otherCategory ? otherCategory : category;

    const job = await Job.create({
      title,
      description,
      category: finalCategory,
      location,
      createdBy: req.user._id
    });

    // For web form submissions, redirect to dashboard
    if (req.get('Content-Type') && req.get('Content-Type').includes('application/x-www-form-urlencoded')) {
      return res.redirect('/dashboard?jobCreated=true');
    }

    res.status(201).json({ message: 'Job created', job });
  } catch (err) {
    console.error('Job creation error:', err);
    
    // For web form submissions, redirect with error
    if (req.get('Content-Type') && req.get('Content-Type').includes('application/x-www-form-urlencoded')) {
      return res.redirect('/dashboard?error=job_creation_failed');
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /jobs/:id/bid
// @desc    Professionals can bid on jobs using credits
// @access  Private
router.post('/:id/bid', authMiddleware, async (req, res) => {
  const jobId = req.params.id;
  const { message } = req.body;

  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can bid' });
    }

    if (req.user.credits < BID_COST) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer accepting bids' });
    }

    // Check if maximum bids reached
    if (job.bids.length >= job.maxBids) {
      return res.status(400).json({ 
        message: `This job has reached the maximum of ${job.maxBids} bids` 
      });
    }

    // Check if user already bid on this job
    const existingBid = job.bids.find(bid => bid.user.toString() === req.user._id.toString());
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this job' });
    }

    job.bids.push({ user: req.user._id, message });
    await job.save();

    req.user.credits -= BID_COST;
    await req.user.save();

    res.json({
      message: `Bid placed successfully. ${BID_COST} credits deducted.`,
      remainingCredits: req.user.credits,
      bidsRemaining: job.maxBids - job.bids.length
    });
  } catch (err) {
    console.error('Bid error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /jobs/my - return all jobs created by the logged-in client with full bid info
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can view their jobs' });
    }

    const jobs = await Job.find({ createdBy: req.user._id })
      .populate('bids.user', 'name email'); // ✅ populate name and email only

    res.json(jobs);
  } catch (err) {
    console.error('GetMyJobs error:', err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /jobs/:id
// @desc    Get a specific job with all bids and bidder info
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId)
      .populate('bids.user', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('GetJobById error:', err);
    res.status(500).json({ message: 'Server error fetching job' });
  }
});

// @route   POST /jobs/:jobId/accept/:bidId
// @desc    Client accepts a bid
// @access  Private
router.post('/:jobId/accept/:bidId', authMiddleware, async (req, res) => {
  const { jobId, bidId } = req.params;

  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can accept bids' });
    }

    const job = await Job.findById(jobId).populate('bids.user', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only accept bids on your own jobs' });
    }

    const bid = job.bids.id(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Mark the accepted bid
    bid.accepted = true;

    // Optional: update job status
    job.status = 'in progress';

    await job.save();

    res.json({
      message: 'Bid accepted successfully',
      job
    });
  } catch (err) {
    console.error('AcceptBid error:', err);
    res.status(500).json({ message: 'Server error accepting bid' });
  }
});

// @route   POST /jobs/:jobId/complete
// @desc    Client marks the job as completed
// @access  Private
router.post('/:jobId/complete', authMiddleware, async (req, res) => {
  const { jobId } = req.params;

  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can complete jobs' });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only complete your own jobs' });
    }

    if (job.status !== 'in progress') {
      return res.status(400).json({ message: 'Job must be in progress to mark it as completed' });
    }

    job.status = 'completed';
    await job.save();

    res.json({ message: 'Job marked as completed', job });
  } catch (err) {
    console.error('CompleteJob error:', err);
    res.status(500).json({ message: 'Server error completing job' });
  }
});

// @route   POST /jobs/:jobId/rate
// @desc    Client leaves a rating for completed job
// @access  Private
router.post('/:jobId/rate', authMiddleware, async (req, res) => {
  const { jobId } = req.params;
  const { score, comment } = req.body;

  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can leave ratings' });
    }

    const job = await Job.findById(jobId).populate('bids.user');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only rate your own jobs' });
    }

    if (job.status !== 'completed') {
      return res.status(400).json({ message: 'You can only rate completed jobs' });
    }

    // Prevent duplicate rating by same client
    const alreadyRated = job.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyRated) {
      return res.status(400).json({ message: 'You have already rated this job' });
    }

    // Find the accepted professional
    const acceptedBid = job.bids.find(bid => bid.accepted === true);
    if (!acceptedBid) {
      return res.status(400).json({ message: 'No professional was accepted for this job' });
    }

    // Add the rating
    job.ratings.push({
      user: req.user._id,
      score,
      comment
    });

    await job.save();

    // ✅ Update professional's recommendation status if 5-star rating
    if (score === 5) {
      const User = require('../models/User');
      const professional = await User.findById(acceptedBid.user._id);
      
      if (professional) {
        professional.recommendationsCount = (professional.recommendationsCount || 0) + 1;
        
        // Mark as recommended if they have at least 1 five-star rating
        // You can adjust this logic (e.g., require 3+ five-star ratings)
        professional.isRecommended = professional.recommendationsCount >= 1;
        
        await professional.save();
        
        console.log(`✅ Professional ${professional.name} now has ${professional.recommendationsCount} recommendations`);
      }
    }

    res.status(201).json({ message: 'Rating submitted successfully', ratings: job.ratings });
  } catch (err) {
    console.error('RateJob error:', err);
    res.status(500).json({ message: 'Server error while rating job' });
  }
});



module.exports = router; // ✅ Always put this LAST
