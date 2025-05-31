const https = require('https');

console.log('🚀 DEPLOYMENT VERIFICATION');
console.log('==========================');

// Test the production site and check for light theme
function checkDeployment() {
  return new Promise((resolve, reject) => {
    console.log('🌐 Checking current deployment...');
    
    const options = {
      hostname: 'hammerhead-app-jg8n7.ondigitalocean.app',
      port: 443,
      path: '/',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'User-Agent': 'DeploymentChecker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Response Status: ${res.statusCode}`);
        console.log(`📅 Last-Modified: ${res.headers['last-modified'] || 'Not provided'}`);
        console.log(`🔄 Cache-Control: ${res.headers['cache-control'] || 'Not provided'}`);
        
        // Check for light theme
        if (data.includes('bg-gradient-to-br from-blue-50 to-indigo-100')) {
          console.log('✅ LIGHT THEME DEPLOYED SUCCESSFULLY!');
          console.log('🎉 Your deployment is working!');
        } else if (data.includes('bg-dark-950')) {
          console.log('❌ Still showing DARK THEME');
          console.log('🔄 Deployment may still be in progress...');
          
          // Show a snippet of what we're getting
          const bodyMatch = data.match(/<body[^>]*>/);
          if (bodyMatch) {
            console.log('🔍 Current body tag:', bodyMatch[0]);
          }
        } else {
          console.log('⚠️  Theme status unclear - checking response...');
          console.log('First 500 chars:', data.substring(0, 500));
        }
        
        resolve(data.includes('bg-gradient-to-br from-blue-50 to-indigo-100'));
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request failed:', e.message);
      reject(e);
    });

    req.end();
  });
}

// Run the check
checkDeployment()
  .then(success => {
    if (success) {
      console.log('\n🎯 NEXT STEPS:');
      console.log('1. Hard refresh your browser (Cmd+Shift+R)');
      console.log('2. Try incognito/private window');
      console.log('3. Test bidding: Login as pro@test.com / password123');
    } else {
      console.log('\n🔧 TROUBLESHOOTING OPTIONS:');
      console.log('1. Wait 2-3 more minutes for deployment');
      console.log('2. Check DigitalOcean App Platform dashboard');
      console.log('3. Verify auto-deploy is enabled');
      console.log('4. Try manual deployment trigger in DO dashboard');
      console.log('5. Check if there are any build errors in DO logs');
    }
  })
  .catch(err => console.error('Error:', err.message));
