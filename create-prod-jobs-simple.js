const mongoose = require('mongoose');

// Simple production job creation
const dbUrl = 'mongodb+srv://appuser:429k5g7CQ16B8uOR@credit-system-db-0ec28f8c.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=credit-system-db&tls=true';

console.log('🔗 Connecting to production database...');

mongoose.connect(dbUrl)
  .then(async () => {
    console.log('✅ Connected to production database');
    
    const Job = require('./models/Job');
    const User = require('./models/User');
    
    // Find clients
    const clients = await User.find({ role: 'client' });
    console.log(`📋 Found ${clients.length} client accounts`);
    
    if (clients.length === 0) {
      console.log('❌ No client accounts found!');
      process.exit(1);
    }
    
    // Clear and create jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');
    
    const testJobs = [
      {
        title: 'Kitchen Renovation - Full Remodel',
        description: 'Complete kitchen renovation including new cabinets, countertops, appliances, plumbing, and electrical work. Looking for experienced contractor with references. Kitchen is 12x14 feet. Budget £10,000-£15,000. Timeline 4-6 weeks. Must be fully insured and provide portfolio of previous work.',
        category: 'Home Services',
        location: 'Manchester, Greater Manchester',
        createdBy: clients[0]._id
      },
      {
        title: 'Professional Business Website',
        description: 'Modern, responsive website for growing consulting business. Need 5-6 pages including homepage, about, services, portfolio, blog, and contact. Must include contact forms, SEO optimization, and content management system. Clean, professional design preferred. Timeline 3-4 weeks. Budget £2,500-£4,000.',
        category: 'Tech & Digital',
        location: 'London, Greater London',
        createdBy: clients[Math.min(1, clients.length-1)]._id
      },
      {
        title: 'Garden Landscaping & Design',
        description: 'Transform back garden (12x15 meters) including design consultation, soil preparation, new lawn, flower beds, patio area (4x4m), and garden path. Remove existing overgrown plants. Looking for professional landscaper with design experience. Budget £4,000-£6,000. Complete before summer.',
        category: 'Home Services',
        location: 'Birmingham, West Midlands',
        createdBy: clients[0]._id
      },
      {
        title: 'Corporate Logo & Branding',
        description: 'Professional logo and branding package for tech startup. Need primary logo, variations, color palette, typography guide, business cards, and brand guidelines. Company focuses on sustainable technology. Modern, clean design that conveys innovation. Timeline 2-3 weeks with revisions.',
        category: 'Business Services',
        location: 'Edinburgh, Scotland',
        createdBy: clients[Math.min(1, clients.length-1)]._id
      },
      {
        title: 'Personal Training - Weight Loss',
        description: 'Qualified personal trainer needed for weight loss program. Want personalized workout plan, nutritional guidance, and motivation. 2-3 sessions per week, gym or outdoor training. Beginner level, goal to lose 20 pounds over 6 months. Evenings (6-8 PM) or weekend mornings. Must be certified.',
        category: 'Personal Services',
        location: 'Leeds, West Yorkshire',
        createdBy: clients[0]._id
      }
    ];
    
    const createdJobs = await Job.insertMany(testJobs);
    console.log(`✅ Created ${createdJobs.length} production test jobs`);
    
    createdJobs.forEach((job, i) => {
      console.log(`${i+1}. ${job.title} (${job.category})`);
    });
    
    console.log('\n🎯 PRODUCTION TESTING READY!');
    console.log('============================');
    console.log('🌐 Homepage: https://hammerhead-app-jg8n7.ondigitalocean.app');
    console.log('🔐 Login: https://hammerhead-app-jg8n7.ondigitalocean.app/auth/login');
    console.log('📋 Browse Jobs: https://hammerhead-app-jg8n7.ondigitalocean.app/jobs/browse');
    console.log('');
    console.log('TEST ACCOUNTS:');
    console.log('Client: client@test.com / password123');
    console.log('Professional: pro@test.com / password123');
    console.log('');
    console.log('BIDDING TEST STEPS:');
    console.log('1. Login as pro@test.com');
    console.log('2. Go to Browse Jobs');
    console.log('3. Click "Place Bid" on any job');
    console.log('4. Fill in bid message');
    console.log('5. Submit bid (costs 5 credits)');
    console.log('6. Verify bid is placed successfully');
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
