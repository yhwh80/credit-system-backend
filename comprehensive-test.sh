#!/bin/bash

echo "🚀 COMPREHENSIVE DEPLOYMENT AND TESTING SCRIPT"
echo "=============================================="

# Navigate to project directory
cd /Users/s.dot/credit-system-backend

echo "📁 Current directory: $(pwd)"

# Check git status
echo "📋 Git Status:"
git status --short

# Add and commit changes
echo "📝 Adding and committing changes..."
git add -A
git commit -m "Deploy light theme homepage and mobile navigation improvements - $(date)"

# Push to trigger deployment
echo "🚀 Pushing to trigger deployment..."
git push origin main

echo "⏳ Waiting for deployment to complete..."
sleep 30

# Test production deployment
echo "🌐 Testing production homepage..."
curl -I https://hammerhead-app-jg8n7.ondigitalocean.app | head -1

# Create production test jobs
echo "📋 Creating test jobs in production database..."
export DATABASE_URL="mongodb+srv://appuser:429k5g7CQ16B8uOR@credit-system-db-0ec28f8c.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=credit-system-db&tls=true"
node scripts/createProductionJobs.js

# Test login functionality
echo "🔐 Testing login functionality..."
curl -X POST https://hammerhead-app-jg8n7.ondigitalocean.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pro@test.com","password":"password123"}' \
  -c test_cookies.txt -v | head -10

# Test browse jobs page
echo "📋 Testing browse jobs page..."
curl -b test_cookies.txt https://hammerhead-app-jg8n7.ondigitalocean.app/jobs/browse -s | grep -i "browse jobs" || echo "❌ Browse jobs not accessible"

echo "✅ Deployment and testing complete!"
echo "🌐 Visit: https://hammerhead-app-jg8n7.ondigitalocean.app"
