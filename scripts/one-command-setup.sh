#!/bin/bash

# 🚀 ONE-COMMAND SETUP FOR NEW ACCOUNT
# Just copy and paste this entire script into Terminal

echo "🚀 Setting up development environment in new account..."

# Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Install essential tools
echo "🔧 Installing Node.js, Git, and VS Code..."
brew install node git
brew install --cask visual-studio-code

# Create project directory
echo "📁 Creating project directory..."
mkdir -p ~/Documents/Projects
cd ~/Documents/Projects

# Copy project from main account
echo "📂 Copying project from main account..."
sudo cp -R /Users/s.dot/credit-system-backend ./
sudo chown -R $(whoami) credit-system-backend

# Setup project
echo "⚙️ Setting up project..."
cd credit-system-backend
npm install

# Get IP address for sharing
IP=$(ifconfig en0 | grep 'inet ' | awk '{print $2}')

echo ""
echo "🎉 SETUP COMPLETE!"
echo ""
echo "📍 Your project is at: ~/Documents/Projects/credit-system-backend"
echo "🚀 To start: cd ~/Documents/Projects/credit-system-backend && npm start"
echo "🌐 Local URL: http://localhost:3000"
echo "📱 Share URL: http://$IP:3000"
echo ""
echo "✅ Test accounts ready:"
echo "   Client: client@test.com / password123"
echo "   Pro: pro@test.com / password123"
echo ""
echo "📖 For detailed guides, check these files:"
echo "   - START_HERE.md"
echo "   - NEW_ACCOUNT_CHECKLIST.md" 
echo "   - TESTING_GUIDE.md"
echo ""
echo "🎯 Ready to test! Run: npm start"
