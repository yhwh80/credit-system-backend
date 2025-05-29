const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login flow...');
    
    // First get the login page to establish session
    const loginPage = await axios.get('http://localhost:3000/auth/login');
    console.log('✅ Login page accessible');
    
    // Try to login with test user
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'pro@example.com',
      password: 'password123'
    }, {
      maxRedirects: 0,
      validateStatus: () => true // Accept any status code
    });
    
    console.log('📝 Login response status:', loginResponse.status);
    console.log('📝 Login response headers:', loginResponse.headers);
    
  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

testLogin();
