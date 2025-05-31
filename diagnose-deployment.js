const https = require('https');
const { execSync } = require('child_process');

console.log('🔍 DIGITALOCEAN DEPLOYMENT DIAGNOSIS');
console.log('====================================\n');

// 1. Check local git status
console.log('📋 LOCAL GIT STATUS:');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('⚠️  Uncommitted changes found:');
    console.log(gitStatus);
  } else {
    console.log('✅ Working directory clean');
  }
} catch (e) {
  console.log('❌ Git status check failed');
}

// 2. Check recent commits
console.log('\n📝 RECENT COMMITS:');
try {
  const commits = execSync('git log --oneline -3', { encoding: 'utf8' });
  console.log(commits);
} catch (e) {
  console.log('❌ Git log check failed');
}

// 3. Check what's actually committed in the current HEAD
console.log('🔍 CHECKING COMMITTED VERSION OF index.ejs:');
try {
  const bodyTag = execSync('git show HEAD:views/index.ejs | grep -A 1 -B 1 "body class"', { encoding: 'utf8' });
  console.log(bodyTag);
} catch (e) {
  console.log('❌ Could not check committed version');
}

// 4. Check production deployment
console.log('\n🌐 CHECKING PRODUCTION DEPLOYMENT:');
const options = {
  hostname: 'hammerhead-app-jg8n7.ondigitalocean.app',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'Cache-Control': 'no-cache',
    'User-Agent': 'DeploymentDiagnostic/1.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Server: ${res.headers.server || 'Unknown'}`);
    console.log(`Date: ${res.headers.date || 'Unknown'}`);
    
    // Extract body tag from production
    const bodyMatch = data.match(/<body[^>]*>/);
    if (bodyMatch) {
      console.log(`Production body tag: ${bodyMatch[0]}`);
      
      if (bodyMatch[0].includes('bg-gradient-to-br from-blue-50 to-indigo-100')) {
        console.log('✅ LIGHT THEME IS DEPLOYED!');
      } else if (bodyMatch[0].includes('bg-dark-950')) {
        console.log('❌ DARK THEME STILL DEPLOYED');
      } else {
        console.log('⚠️  Unknown theme state');
      }
    }
    
    console.log('\n🎯 DIAGNOSIS:');
    console.log('=============');
    
    // Compare local vs production
    try {
      const localBody = execSync('git show HEAD:views/index.ejs | grep "body class"', { encoding: 'utf8' });
      const localTheme = localBody.includes('bg-gradient-to-br from-blue-50 to-indigo-100') ? 'LIGHT' : 'DARK';
      const prodTheme = bodyMatch[0].includes('bg-gradient-to-br from-blue-50 to-indigo-100') ? 'LIGHT' : 'DARK';
      
      console.log(`Local committed theme: ${localTheme}`);
      console.log(`Production theme: ${prodTheme}`);
      
      if (localTheme === 'LIGHT' && prodTheme === 'DARK') {
        console.log('\n❌ DEPLOYMENT ISSUE CONFIRMED!');
        console.log('Your changes are committed but not deployed to DigitalOcean.');
        console.log('\n🔧 SOLUTIONS:');
        console.log('1. Check DigitalOcean App Platform dashboard');
        console.log('2. Verify auto-deploy is enabled');
        console.log('3. Check for build errors in deployment logs');
        console.log('4. Try manual deployment trigger');
        console.log('5. Verify GitHub webhook is working');
      } else if (localTheme === prodTheme) {
        console.log('\n✅ Local and production are in sync');
        console.log('The issue might be browser caching or CSS loading');
      }
    } catch (e) {
      console.log('Could not compare local vs production');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Production check failed:', e.message);
});

req.end();
