#!/bin/bash

# 🚀 Project Transfer Script for New Admin Account
# Run this from your NEW admin account

echo "🔄 Starting project transfer to new admin account..."

# Get the original username
echo "📝 What's your original username? (the account you're copying FROM)"
read -p "Username: " ORIGINAL_USER

# Verify the source exists
SOURCE_PATH="/Users/$ORIGINAL_USER/credit-system-backend"
if [ ! -d "$SOURCE_PATH" ]; then
    echo "❌ Error: Cannot find project at $SOURCE_PATH"
    echo "Please check the username and try again."
    exit 1
fi

echo "✅ Found project at $SOURCE_PATH"

# Create destination
DEST_PATH="$HOME/Documents/credit-system-backend"
mkdir -p "$HOME/Documents"

echo "📁 Copying project files..."
sudo cp -R "$SOURCE_PATH" "$DEST_PATH"

echo "🔑 Fixing file permissions..."
sudo chown -R $(whoami):staff "$DEST_PATH"

echo "📦 Installing dependencies..."
cd "$DEST_PATH"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js not found. Please install it first:"
    echo "   brew install node"
    exit 1
fi

# Install project dependencies
npm install

echo ""
echo "🎉 Project transfer complete!"
echo ""
echo "📍 Your project is now at: $DEST_PATH"
echo ""
echo "🚀 To start your server:"
echo "   cd $DEST_PATH"
echo "   npm start"
echo ""
echo "🌐 Then visit: http://localhost:3000"
echo ""
echo "🔒 Remember to:"
echo "   1. Check your .env file has the right settings"
echo "   2. Test the quick login buttons work"
echo "   3. Share your IP with friends for testing"
echo ""
