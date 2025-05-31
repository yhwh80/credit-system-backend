const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

// Use production database URL
const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/recommend-us-uk';

console.log('🔗 Connecting to database...');

async function createProductionTestJobs() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to database');
    
    // Find client accounts
    const clients = await User.find({ role: 'client' });
    console.log(`📋 Found ${clients.length} client accounts`);
    
    if (clients.length === 0) {
      console.log('❌ No client accounts found!');
      process.exit(1);
    }
    
    // Clear existing jobs
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      await Job.deleteMany({});
      console.log(`🗑️  Removed ${existingJobs} existing jobs`);
    }
    
    // Create comprehensive test jobs
    const testJobs = [
      {
        title: 'Kitchen Renovation - Full Remodel Needed',
        description: 'Looking for an experienced contractor to completely renovate my kitchen. The project includes: removing all existing cabinets and appliances, updating electrical and plumbing, installing new cabinets, countertops, flooring, and painting. Kitchen size is approximately 12x14 feet. I have a budget of £8,000-£12,000 and would like the work completed within 4-6 weeks. Please provide detailed quotes including materials and labor. Must be fully insured and provide references from previous kitchen projects.',
        category: 'Home Services',
        location: 'Manchester, Greater Manchester',
        createdBy: clients[0]._id
      },
      {
        title: 'Modern Business Website Development',
        description: 'Small tech startup needs a professional website built from scratch. Requirements: responsive design for mobile/tablet/desktop, 6-8 pages including homepage, about, services, portfolio, blog, and contact. Must include contact forms, SEO optimization, fast loading speeds, and easy content management system. Prefer modern, clean design with professional color scheme. Timeline: 3-4 weeks. Budget: £2,000-£4,000. Please include portfolio examples of similar business websites.',
        category: 'Tech & Digital',
        location: 'London, Greater London',
        createdBy: clients[Math.min(1, clients.length - 1)]._id
      },
      {
        title: 'Garden Landscaping & Design Project',
        description: 'Complete garden transformation needed for medium-sized back garden (10x15 meters). Current garden is mostly overgrown lawn with few old shrubs. Looking for: professional design consultation, soil preparation, new lawn installation, flower beds with perennial plants, small patio/seating area (4x4m), garden path, and low-maintenance plant selection suitable for partial shade. Prefer English cottage garden style. Budget: £3,000-£5,000. Project completion needed before summer season.',
        category: 'Home Services',
        location: 'Birmingham, West Midlands',
        createdBy: clients[0]._id
      },
      {
        title: 'Corporate Branding & Logo Design Package',
        description: 'Established consulting firm needs complete rebrand including new logo and brand identity. Package should include: primary logo design, logo variations (horizontal, stacked, monogram), color palette, typography guide, business card design, letterhead template, and brand guidelines document. Company specializes in financial consulting for SMEs. Looking for professional, trustworthy design that appeals to business clients. Timeline: 2-3 weeks with 2 revision rounds included.',
        category: 'Business Services',
        location: 'Edinburgh, Scotland',
        createdBy: clients[Math.min(1, clients.length - 1)]._id
      },
      {
        title: 'Personal Training - Weight Loss & Fitness',
        description: 'Looking for qualified personal trainer to help achieve weight loss and fitness goals. Need personalized workout plan, nutritional guidance, and motivation. Current fitness level: beginner, goal: lose 25 pounds over 6 months and build strength. Prefer 3 sessions per week, flexible between gym and outdoor training. Available evenings (6-8 PM) and weekend mornings. Must be certified (REPS/CIMSPA), experienced with beginners, and able to adapt workouts for joint-friendly exercises.',
        category: 'Personal Services',
        location: 'Leeds, West Yorkshire',
        createdBy: clients[0]._id
      },
      {
        title: 'Bathroom Renovation - En-suite Makeover',
        description: 'Small en-suite bathroom needs complete renovation. Space is approximately 2x3 meters. Project includes: removing old suite, retiling walls and floor, installing new toilet, sink, shower cubicle, ventilation fan, and LED lighting. Looking for modern, space-efficient design with good storage solutions. Budget: £4,000-£6,000. Need work completed within 2-3 weeks. Must provide own materials sourcing or work with supplied materials. Fully qualified plumber/tiler required with insurance and references.',
        category: 'Home Services',
        location: 'Bristol, South West England',
        createdBy: clients[Math.min(1, clients.length - 1)]._id
      }
    ];
    
    console.log('📝 Creating test jobs...');
    
    const createdJobs = [];
    for (const jobData of testJobs) {
      const job = await Job.create(jobData);
      createdJobs.push(job);
      console.log(`✅ Created: "${job.title}" (${job.category})`);
    }
    
    console.log(`\n🎉 Successfully created ${createdJobs.length} test jobs!`);
    console.log('\n📋 Complete Test Jobs List:');
    createdJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Category: ${job.category} | Location: ${job.location}`);
      console.log(`   ID: ${job._id}\n`);
    });
    
    console.log('🚀 Ready to test the complete workflow:');
    console.log('1. Visit https://hammerhead-app-jg8n7.ondigitalocean.app');
    console.log('2. Login as client@test.com (password: password123) to see posted jobs');
    console.log('3. Login as pro@test.com (password: password123) to browse and bid on jobs');
    console.log('4. Test the complete bidding process!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

createProductionTestJobs();
