const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/credit-system')
  .then(async () => {
    const users = await User.find({});
    console.log('✅ Users in DB:');
    users.forEach(user => {
      console.log(`Name: ${user.name}, ID: ${user._id}, Credits: ${user.credits}`);
    });
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error:', err));
