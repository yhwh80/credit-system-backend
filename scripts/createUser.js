const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/credit-system')
  .then(async () => {
    const user = await User.create({
      name: 'Test Pro',
      email: 'pro@example.com',
      role: 'professional',
      credits: 0
    });

    console.log('✅ Test user created:');
    console.log(`🆔 ID: ${user._id}`);
    console.log(`📧 Email: ${user.email}`);
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error:', err));
