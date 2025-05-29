const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.create({
      name: 'Jane BoilerFix',
      email: 'jane@boilerfix.com',
      password: 'hashedpassword', // just for placeholder
      role: 'professional',
      category: 'Heating Engineer',
      location: 'London',
      rating: 4.9,
      isFeatured: true,
      bio: 'Certified boiler expert with 12 years of field experience.',
      reviews: [
        { rating: 5, comment: 'Great service!' },
        { rating: 4, comment: 'Quick and professional.' }
      ]
    });
    console.log('✅ Test professional added!');
    mongoose.disconnect();
  });
