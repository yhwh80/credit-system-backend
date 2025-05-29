#!/bin/bash

# 🔍 Quick Setup Verification Script
# Run this after transferring to verify everything works

echo "🔍 Verifying your development setup..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js: Not installed"
    echo "   Run: brew install node"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm: Not installed"
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
else
    echo "❌ Git: Not installed"
    echo "   Run: brew install git"
fi

# Check project directory
if [ -d "./node_modules" ]; then
    echo "✅ Dependencies: Installed"
else
    echo "❌ Dependencies: Not installed"
    echo "   Run: npm install"
fi

# Check .env file
if [ -f ".env" ]; then
    echo "✅ Environment: .env file found"
else
    echo "⚠️  Environment: .env file missing"
    echo "   You'll need to recreate this with your secrets"
fi

# Check key files
KEY_FILES=("server.js" "package.json" "views/index.ejs" "views/login.ejs")
for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Project file: $file"
    else
        echo "❌ Project file: $file missing"
    fi
done

echo ""
echo "🌐 Network Information:"
echo "   Local URL: http://localhost:3000"
echo "   Your IP: $(ifconfig en0 | grep 'inet ' | awk '{print $2}')"
echo "   Network URL: http://$(ifconfig en0 | grep 'inet ' | awk '{print $2}'):3000"

echo ""
echo "🚀 Ready to start? Run:"
echo "   npm start"
echo ""
