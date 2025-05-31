const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const initializePassport = require('./config/passport');


dotenv.config(); // Load .env config

const app = express();
app.set('view engine', 'ejs');

// ✅ Trust proxy for DigitalOcean App Platform
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// 🔐 Security Headers (production-ready)
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      formAction: ["'self'"],
      // Removed upgrade-insecure-requests to fix login issues
    },
  } : false, // Disable CSP in development
  hsts: process.env.NODE_ENV === 'production', // Enable HTTPS enforcement in production
}));

// 🔐 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// 🔐 Stricter rate limiting for auth routes (relaxed for testing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased limit for testing - allow 50 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
});
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Parse form data from HTML
app.use(express.urlencoded({ extended: true }));

// ✅ Express Session setup with enhanced security
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ✅ Initialize Passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Import route files
const authRoutes = require('./routes/authRoutes');
const creditsRoutes = require('./routes/credits');
const jobsRoutes = require('./routes/jobs');
const dashboardRoutes = require('./routes/dashboard'); // ✅ Add this with your other route imports
const directoryRoutes = require('./routes/directoryRoutes');
const path = require('path');


// ✅ Mount routes
app.use('/auth', authRoutes);
console.log('✅ Auth routes mounted');

app.use('/credits', creditsRoutes);
console.log('✅ Credits routes mounted');

app.use('/jobs', jobsRoutes);
console.log('✅ Jobs routes mounted');

app.use('/dashboard', dashboardRoutes);
console.log('✅ Dashboard routes mounted');

app.use('/directory', directoryRoutes);
console.log('✅ Directory routes mounted');

app.use(express.static(path.join(__dirname, 'public')));

// ✅ Root route - show landing page
app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/dashboard');
  } else {
    res.render('index');
  }
});

// ✅ Convenience redirect for /login
app.get('/login', (req, res) => {
  res.redirect('/auth/login');
});

app.get('/test-user', (req, res) => {
  console.log('🧪 req.user:', req.user);
  res.send(req.user ? `Logged in as ${req.user.email || req.user.name}` : '❌ Not logged in');
});


// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`   Production server started`);
  } else {
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://192.168.4.89:${PORT}`);
    console.log(`\n📱 Share the Network URL with friends to let them test!`);
  }
});
