const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recommend-us-uk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestJobs() {
  try {
    console.log('🔍 Looking for test client accounts...');
    
    // Find client accounts
    const clients = await User.find({ role: 'client' });
    
    if (clients.length === 0) {
      console.log('❌ No client accounts found. Please create client accounts first.');
      process.exit(1);
    }
    
    console.log(`✅ Found ${clients.length} client accounts`);
    
    // Test jobs to create
    const testJobs = [
      {
        title: 'Kitchen Renovation Required',
        description: 'Looking for a skilled contractor to renovate my kitchen. This includes removing old cabinets, installing new ones, updating plumbing for a new sink, and painting. The kitchen is approximately 12x10 feet. I have already purchased the cabinets and need someone who can handle the installation professionally. Timeline is flexible but would prefer completion within 2-3 weeks. Please provide detailed quotes including labor and any additional materials needed.',
        category: 'Home Services',
        location: 'Manchester, UK',
        createdBy: clients[0]._id
      },
      {
        title: 'Professional Website Design & Development',
        description: 'I need a modern, responsive website for my small business. The site should include: homepage, about page, services page, contact form, and a small gallery. I prefer a clean, professional design that works well on mobile devices. Must include basic SEO optimization and be easy for me to update content. Looking for someone experienced with WordPress or similar CMS. Please include examples of previous work in your bid.',
        category: 'Tech & Digital',
        location: 'London, UK',
        createdBy: clients[Math.min(1, clients.length - 1)]._id
      },
      {
        title: 'Garden Landscaping Project',
        description: 'Need complete garden makeover for a medium-sized back garden (approximately 8x12 meters). Current garden is mostly lawn with some overgrown shrubs. Looking for: design consultation, removal of old plants, soil preparation, new planting scheme with mix of perennials and shrubs, and installation of a small patio area. Prefer low-maintenance plants suitable for partial shade. Project should be completed before summer season.',
        category: 'Home Services',
        location: 'Birmingham, UK',
        createdBy: clients[0]._id
      },
      {
        title: 'Business Logo & Branding Design',
        description: 'Startup tech company needs a professional logo and basic branding package. This includes: main logo design, alternative versions (horizontal, stacked, icon-only), color palette, typography suggestions, and basic brand guidelines document. Company focuses on sustainable technology solutions. Looking for modern, clean design that conveys innovation and environmental responsibility. Please provide 2-3 initial concepts with revisions included.',
        category: 'Business Services',
        location: 'Edinburgh, UK',
        createdBy: clients[Math.min(1, clients.length - 1)]._id
      },
      {
        title: 'Personal Fitness Training - Weight Loss Program',
        description: 'Looking for a qualified personal trainer to help with weight loss and fitness goals. Need someone who can create a personalized workout plan and provide nutritional guidance. Prefer 2-3 sessions per week, either at a gym or outdoor training. Current fitness level is beginner, with goal to lose 20 pounds over 6 months. Must be certified and have experience with beginners. Availability needed for evening sessions (6-8 PM) or weekend mornings.',
        category: 'Personal Services',
        location: 'Leeds, UK',
        createdBy: clients[0]._id
      }
    ];
    
    console.log('📝 Creating test jobs...');
    
    // Delete existing jobs to start fresh
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');
    
    // Create new jobs
    const createdJobs = [];
    for (const jobData of testJobs) {
      const job = await Job.create(jobData);
      createdJobs.push(job);
      console.log(`✅ Created job: "${job.title}" (ID: ${job._id})`);
    }
    
    console.log(`\n🎉 Successfully created ${createdJobs.length} test jobs!`);
    console.log('\n📋 Test Jobs Summary:');
    createdJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} (${job.category}) - ${job.location}`);
    });
    
    console.log('\n🔗 You can now test the complete workflow:');
    console.log('1. Login as a client and view "My Jobs" to see posted jobs');
    console.log('2. Login as a professional and browse available jobs');
    console.log('3. Place bids on jobs as a professional');
    console.log('4. Review bids as a client');
    
  } catch (error) {
    console.error('❌ Error creating test jobs:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createTestJobs();
