// Production Test Job Creator and System Validator
const https = require('https');

async function createProductionJobs() {
  console.log('🎯 CREATING PRODUCTION TEST JOBS');
  console.log('================================');
  
  // This will run in production environment
  const mongoose = require('mongoose');
  const Job = require('../models/Job');
  const User = require('../models/User');
  
  try {
    // Connect to production database
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to production database');
    
    // Find clients
    const clients = await User.find({ role: 'client' });
    console.log(`Found ${clients.length} client accounts`);
    
    if (clients.length === 0) {
      console.log('❌ No clients found!');
      return;
    }
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');
    
    // Create jobs
    const jobs = [
      {
        title: 'Kitchen Renovation - Professional Needed',
        description: 'Complete kitchen renovation including new cabinets, countertops, plumbing, and electrical work. Looking for experienced contractor with references. Kitchen is 12x10 feet. Budget £10,000-£15,000. Timeline 3-4 weeks. Must be fully insured.',
        category: 'Home Services',
        location: 'Manchester, UK',
        createdBy: clients[0]._id
      },
      {
        title: 'Modern Website Development Required',
        description: 'Professional website needed for growing business. 5-6 pages including homepage, about, services, contact. Must be mobile-responsive and include contact forms. Clean, modern design preferred. Timeline 2-3 weeks. Budget £2,000-£4,000.',
        category: 'Tech & Digital',
        location: 'London, UK',
        createdBy: clients[Math.min(1, clients.length-1)]._id
      },
      {
        title: 'Garden Landscaping Project',
        description: 'Transform back garden (10x12m) including new lawn, flower beds, patio area, and garden path. Remove existing overgrown plants. Looking for professional landscaper with design experience. Budget £4,000-£6,000.',
        category: 'Home Services',
        location: 'Birmingham, UK',
        createdBy: clients[0]._id
      }
    ];
    
    const createdJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${createdJobs.length} test jobs`);
    
    // List created jobs
    createdJobs.forEach((job, i) => {
      console.log(`${i+1}. ${job.title} (ID: ${job._id})`);
    });
    
    await mongoose.disconnect();
    console.log('✅ Production jobs created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  createProductionJobs();
}

module.exports = createProductionJobs;
