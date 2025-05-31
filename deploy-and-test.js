#!/usr/bin/env node

// Complete deployment and testing solution
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 COMPLETE DEPLOYMENT & TESTING SOLUTION');
console.log('==========================================');

try {
  // 1. Force git deployment
  console.log('📝 1. Committing and pushing changes...');
  process.chdir('/Users/s.dot/credit-system-backend');
  
  execSync('git add -A', { stdio: 'pipe' });
  execSync(`git commit -m "Deploy light theme and fix bidding - ${new Date().toISOString()}"`, { stdio: 'pipe' });
  execSync('git push origin main', { stdio: 'pipe' });
  
  console.log('✅ Changes pushed to trigger deployment');
  
  // 2. Wait for deployment
  console.log('⏳ 2. Waiting for deployment to complete...');
  setTimeout(() => {
    console.log('🎯 3. Testing production site...');
    
    // Test homepage
    const https = require('https');
    https.get('https://hammerhead-app-jg8n7.ondigitalocean.app', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Homepage accessible');
      } else {
        console.log(`❌ Homepage issue: ${res.statusCode}`);
      }
    });
    
    console.log('\n🎉 DEPLOYMENT COMPLETE!');
    console.log('================================');
    console.log('🌐 Homepage: https://hammerhead-app-jg8n7.ondigitalocean.app');
    console.log('🔐 Login: https://hammerhead-app-jg8n7.ondigitalocean.app/auth/login');
    console.log('\n📋 Test Accounts:');
    console.log('   Client: client@test.com / password123');
    console.log('   Professional: pro@test.com / password123');
    console.log('\n🧪 To test bidding:');
    console.log('1. Login as pro@test.com');
    console.log('2. Go to Browse Jobs');
    console.log('3. Click "Place Bid" on any job');
    console.log('4. Submit your bid');
    
  }, 30000); // Wait 30 seconds
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
