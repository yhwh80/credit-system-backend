const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const { validatePassword, validateEmail, sanitizeInput } = require('../utils/security');

// GET register
router.get('/register', (req, res) => {
  res.render('register');
});

// POST register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 🔐 Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).send('All fields are required');
    }

    // 🔐 Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // 🔐 Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).send('Invalid email format');
    }

    // 🔐 Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).send(`Password requirements: ${passwordValidation.errors.join(', ')}`);
    }

    // 🔐 Validate role
    if (!['client', 'professional'].includes(role)) {
      return res.status(400).send('Invalid role selected');
    }

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) return res.status(409).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    const newUser = new User({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      role,
      credits: role === 'client' ? 100 : 50 // Give starting credits
    });

    await newUser.save();
    res.redirect('/auth/login?success=registered');
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).send('Registration failed - please try again');
  }
});

// GET login
router.get('/login', (req, res) => {
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.redirect('/auth/login?error=login_failed');
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// GET logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
