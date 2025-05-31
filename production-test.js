#!/usr/bin/env node

console.log('🎯 PRODUCTION DEPLOYMENT TEST');
console.log('============================');

// Test production site availability
const https = require('https');

function testHomepage() {
  return new Promise((resolve, reject) => {
    console.log('🌐 Testing homepage...');
    https.get('https://hammerhead-app-jg8n7.ondigitalocean.app', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Homepage accessible');
          
          // Check if light theme is deployed
          if (data.includes('bg-gradient-to-br from-blue-50 to-indigo-100')) {
            console.log('✅ Light theme deployed successfully!');
          } else if (data.includes('bg-dark-950')) {
            console.log('❌ Still showing dark theme - deployment may not be complete');
          } else {
            console.log('⚠️  Theme status unclear');
          }
          
          resolve(true);
        } else {
          console.log(`❌ Homepage error: ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Homepage connection error: ${err.message}`);
      resolve(false);
    });
  });
}

function testLoginPage() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Testing login page...');
    https.get('https://hammerhead-app-jg8n7.ondigitalocean.app/auth/login', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Login page accessible');
        resolve(true);
      } else {
        console.log(`❌ Login page error: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ Login page error: ${err.message}`);
      resolve(false);
    });
  });
}

async function runTests() {
  try {
    const homepageOk = await testHomepage();
    const loginOk = await testLoginPage();
    
    console.log('\n📊 DEPLOYMENT SUMMARY');
    console.log('=====================');
    console.log(`Homepage: ${homepageOk ? '✅ Working' : '❌ Error'}`);
    console.log(`Login: ${loginOk ? '✅ Working' : '❌ Error'}`);
    
    console.log('\n🧪 MANUAL TESTING STEPS:');
    console.log('========================');
    console.log('1. Visit: https://hammerhead-app-jg8n7.ondigitalocean.app');
    console.log('   - Check if homepage shows light theme (light blue/indigo background)');
    console.log('   - Verify mobile navigation works (hamburger menu)');
    console.log('');
    console.log('2. Login as professional: pro@test.com / password123');
    console.log('   - Go to "Browse Jobs"');
    console.log('   - Verify jobs are listed');
    console.log('   - Test "Place Bid" functionality');
    console.log('');
    console.log('3. Login as client: client@test.com / password123');
    console.log('   - Go to "My Jobs" to verify jobs are posted');
    console.log('   - Check if any bids have been received');
    
    if (homepageOk && loginOk) {
      console.log('\n🎉 Production site is live and accessible!');
    } else {
      console.log('\n⚠️  Some issues detected - check manually');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

runTests();
