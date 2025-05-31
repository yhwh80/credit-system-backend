#!/usr/bin/env node

// Quick deployment verification
const https = require('https');

console.log('🔍 DEPLOYMENT VERIFICATION');
console.log('==========================');

https.get('https://hammerhead-app-jg8n7.ondigitalocean.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    
    if (data.includes('bg-gradient-to-br from-blue-50 to-indigo-100')) {
      console.log('✅ LIGHT THEME DEPLOYED SUCCESSFULLY!');
    } else if (data.includes('bg-dark-950')) {
      console.log('❌ Still showing dark theme');
    }
    
    if (data.includes('mobile-menu-button')) {
      console.log('✅ Mobile navigation deployed');
    }
    
    if (data.includes('Recommend Us UK')) {
      console.log('✅ Site title correct');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit https://hammerhead-app-jg8n7.ondigitalocean.app');
    console.log('2. Test light theme and mobile navigation');
    console.log('3. Login and test bidding: pro@test.com / password123');
    console.log('4. Run: node create-prod-jobs-simple.js (to create test jobs)');
  });
}).on('error', err => {
  console.log('❌ Error:', err.message);
});
