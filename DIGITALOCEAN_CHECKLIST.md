# 🔍 DigitalOcean Deployment Troubleshooting Checklist
## What to Check in Your DigitalOcean Dashboard

### 🎯 Primary Issues to Investigate
1. **Light theme changes not deploying** (local changes complete but production still shows dark theme)
2. **Bidding functionality broken** (no test jobs in production database)

---

## 📱 Step 1: App Platform - Deployment Status

### Navigate to: **Apps → hammerhead-app-jg8n7**

**Check These Sections:**

#### A. **Overview Tab**
- [ ] **App Status**: Should show "Running" in green
- [ ] **Last Deployment**: Check date/time of last successful deployment
- [ ] **Current Build**: Look for any failed or pending builds
- [ ] **Live URL**: Verify it's `https://hammerhead-app-jg8n7.ondigitalocean.app`

#### B. **Activity Tab** 🔍 **MOST IMPORTANT**
- [ ] **Recent Deployments**: Look for failed builds or deployments
- [ ] **Build Logs**: Check for any error messages during build process
- [ ] **Deploy Logs**: Look for runtime errors or deployment failures
- [ ] **Git Commits**: Verify your recent commits are being picked up

#### C. **Settings Tab**
- [ ] **Source Code**: 
  - Repository: `yhwh80/credit-system-backend`
  - Branch: `main`
  - Auto Deploy: Should be enabled
- [ ] **Build & Deploy**:
  - Build Command: Check if correct
  - Run Command: Verify it's starting your app properly

---

## 🗄️ Step 2: Database - Connection & Data

### Navigate to: **Databases → db-mongodb-nyc3-71492**

**Check These Sections:**

#### A. **Overview**
- [ ] **Status**: Should show "Available" 
- [ ] **Connection Details**: Verify connection string matches your app.yaml
- [ ] **Current Connections**: Check if your app is connecting

#### B. **Users & Databases**
- [ ] **Database User**: `doadmin` should exist with proper permissions
- [ ] **Database Name**: Check what databases exist
- [ ] **Connection String**: Copy and compare with your `.do/app.yaml` file

#### C. **Metrics** 
- [ ] **Connection Activity**: See if there are recent connections
- [ ] **Query Activity**: Check if your app is making database queries

---

## 🚨 Red Flags to Look For

### In App Platform:
- ❌ **Failed Deployments**: Any builds marked as "Failed"
- ❌ **Build Errors**: Error messages in build logs
- ❌ **Old Deployment Time**: Last deployment much older than your recent commits
- ❌ **Wrong Branch**: Not deploying from `main` branch
- ❌ **Disabled Auto-Deploy**: Manual deployments required

### In Database:
- ❌ **Connection Refused**: App can't connect to database
- ❌ **Wrong Connection String**: Mismatch between DB and app config
- ❌ **Empty Database**: No collections or data
- ❌ **Permission Errors**: Database user lacking proper permissions

---

## 🔧 Actions to Take Based on What You Find

### If Deployments Are Failing:
1. **Manual Deploy**: Click "Deploy" button to force new deployment
2. **Check Build Logs**: Look for specific error messages
3. **Verify GitHub Integration**: Ensure repo connection is working
4. **Review Environment Variables**: Check if all required vars are set

### If Database Issues:
1. **Test Connection**: Use the connection string in a local script
2. **Check Permissions**: Verify database user has read/write access
3. **Review Configuration**: Compare `.do/app.yaml` with actual DB settings
4. **Population Status**: See if test jobs/users exist in production DB

### If Everything Looks Good But Still Broken:
1. **Force Rebuild**: Trigger manual deployment even if last one shows "success"
2. **Clear Cache**: Some platforms cache builds
3. **Check Runtime Logs**: Look for errors after deployment completes
4. **Environment Variables**: Verify all secrets and configs are properly set

---

## 📋 Quick Diagnostic Commands

After checking DigitalOcean, run these to verify:

```bash
# Test if your production site is actually updated
curl -s https://hammerhead-app-jg8n7.ondigitalocean.app | grep -i "bg-dark\|bg-gradient" | head -3

# Test database connection from your local machine
node -e "
const mongoose = require('mongoose');
const uri = 'YOUR_PRODUCTION_DB_STRING_FROM_DIGITALOCEAN';
mongoose.connect(uri).then(() => console.log('✅ DB Connected')).catch(err => console.log('❌ DB Failed:', err.message));
"

# Check if any jobs exist in production
node -e "
const mongoose = require('mongoose');
mongoose.connect('YOUR_DB_STRING').then(async () => {
  const Job = require('./models/Job');
  const count = await Job.countDocuments();
  console.log(\`Jobs in production: \${count}\`);
  process.exit(0);
});
"
```

---

## 🎯 What You're Looking For

### ✅ **Good Signs**:
- Recent successful deployments matching your commit times
- Database showing active connections
- Build logs showing no errors
- App status "Running"

### ❌ **Problem Indicators**:
- Failed builds or deployments
- Old deployment timestamps
- Database connection errors
- Missing environment variables
- No data in production database

---

**Next Step**: After checking DigitalOcean, report back what you find and we can create a targeted fix plan based on the specific issues discovered.

*Created: May 31, 2025*
*Priority: Check this FIRST to understand deployment failures*
