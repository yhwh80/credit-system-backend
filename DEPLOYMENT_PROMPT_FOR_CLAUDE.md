# DigitalOcean Deployment Prompt for Claude

Copy and paste this entire prompt to Claude when you're ready to deploy:

---

## TASK: Deploy Credit System Backend to DigitalOcean App Platform

I have a working Node.js credit system backend application that I need to deploy to DigitalOcean App Platform so friends in other cities can test it remotely.

### Current Local Setup ✅
- **Application**: Node.js Express server with authentication, credit system, job posting
- **Database**: MongoDB running locally with test users
- **Authentication**: Passport.js with bcrypt password hashing
- **Frontend**: EJS templates with Tailwind CSS
- **Security**: Helmet, rate limiting, session management
- **Local URLs**: 
  - http://localhost:3000
  - http://192.168.4.89:3000 (network accessible)

### Test Users Already Created ✅
- client@test.com / password123
- pro@test.com / password123  
- sarah@test.com / password123
- mike@test.com / password123

### Files Ready for Deployment ✅
- Complete Node.js application in `/Users/s.dot/credit-system-backend/`
- Package.json with all dependencies
- Environment variables configured
- DigitalOcean app configuration started

### Tools Already Installed ✅
- DigitalOcean CLI (doctl) - authenticated
- GitHub CLI (gh) - authenticated with HTTPS
- Node.js v24.1.0, npm v11.3.0

### What I Need You To Do:

1. **Create GitHub Repository**
   - Create a new GitHub repo for the project
   - Push all code to GitHub
   - Set up proper .gitignore for Node.js

2. **Set Up Production Database**
   - Set up MongoDB Atlas (free tier) or DigitalOcean managed MongoDB
   - Create production database with same structure as local
   - Migrate test users to production database

3. **Deploy to DigitalOcean App Platform**
   - Configure the app for Node.js deployment
   - Set up environment variables for production
   - Configure domain/subdomain for easy access
   - Ensure HTTPS is properly configured

4. **Production Environment Variables Needed**
   ```
   NODE_ENV=production
   MONGO_URI=<production-mongodb-connection-string>
   SESSION_SECRET=<secure-random-string>
   PORT=3000
   ```

5. **Verify Deployment**
   - Test login functionality with existing test users
   - Verify all routes work (dashboard, jobs, credits, directory)
   - Ensure security headers are properly configured
   - Test from external network to confirm remote access

6. **Provide Final URLs**
   - Give me the live URL where friends can test
   - Provide admin/monitoring URLs if applicable

### Expected Outcome:
A live, secure URL (like https://my-credit-system.ondigitalocean.app) that friends in other cities can visit to test the credit system application with the existing test accounts.

### My Project Structure:
```
credit-system-backend/
├── server.js (main app file)
├── package.json
├── .env (local config)
├── config/passport.js
├── routes/ (authRoutes, credits, jobs, dashboard, directory)
├── models/ (User, Job)
├── views/ (EJS templates)
├── controllers/
├── middleware/
└── public/
```

Please guide me through each step and handle the deployment process. I'm ready to follow your instructions!

---

**COPY EVERYTHING ABOVE THIS LINE TO CLAUDE** 📋
