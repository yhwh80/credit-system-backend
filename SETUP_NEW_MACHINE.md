# 🚀 Quick Setup Guide for New Mac Account

## **Development Environment Setup**

### **1. Install Essential Tools**
```bash
# Install Homebrew (package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and npm
brew install node

# Install Git
brew install git

# Install VS Code
brew install --cask visual-studio-code
```

### **2. Clone Your Project**
```bash
# Navigate to desired location
cd ~/Documents

# Clone your project
git clone [YOUR_REPO_URL] credit-system-backend
cd credit-system-backend

# Install dependencies
npm install
```

### **3. Environment Setup**
```bash
# Copy your .env file to the new setup
# You'll need to recreate the .env file with:
# - Strong JWT secrets
# - Database connection string
# - Session secrets
```

### **4. Quick Start Commands**
```bash
# Start the development server
npm start

# Or start with nodemon for auto-reload
npm install -g nodemon
nodemon server.js
```

## **🔒 Security Benefits of Separate Account**

✅ **Isolated Environment** - Development work won't affect personal files
✅ **Limited Permissions** - Easier to control what has access
✅ **Clean Testing** - Fresh environment for testing
✅ **Easy Cleanup** - Can delete entire account when done
✅ **Backup Safety** - Personal account remains untouched

## **📱 Testing Your Platform**

### **Option 1: Same Machine Testing**
- Use `http://localhost:3000` in the new account
- Perfect for development and debugging

### **Option 2: Network Testing** 
- Find your Mac's IP: `ifconfig | grep inet`
- Share with friends: `http://[YOUR_IP]:3000`
- Great for real-world testing

### **Option 3: Public Testing with ngrok**
```bash
# Install ngrok
brew install ngrok

# Create public tunnel
ngrok http 3000

# Share the public URL with testers
```

## **🎯 Step-by-Step Account Creation**

### **Part A: Create New Admin Account (5 minutes)**

1. **Open System Settings**
   - Click Apple logo → System Settings
   - Or press `Cmd + Space` and type "System Settings"

2. **Navigate to Users & Groups**
   - Click "Users & Groups" in the sidebar
   - Click the lock icon (🔒) at bottom left
   - Enter your current password

3. **Add New User**
   - Click the "+" button
   - **Account Type:** Administrator
   - **Full Name:** `Dev Testing Account`
   - **Account Name:** `devtest`
   - **Password:** Create a strong password (write it down!)
   - Click "Create User"

4. **Test the Account**
   - Apple menu → Log Out [Your Current User]
   - Log in as `devtest`
   - Verify you can access admin functions

### **Part B: Quick Project Transfer (10 minutes)**

From your NEW account, run these commands in Terminal:

```bash
# Create project directory
mkdir -p ~/Documents/Projects
cd ~/Documents/Projects

# Copy the entire project from your main account
# Replace 'yourusername' with your actual username
sudo cp -R /Users/yourusername/credit-system-backend ./
sudo chown -R $(whoami) credit-system-backend

# Navigate to project
cd credit-system-backend
```

## **⚡ Super Quick Method (Recommended)**

Once you've created your new admin account and logged in, just run:

```bash
# Download and run the transfer script
curl -o transfer.sh https://raw.githubusercontent.com/yourusername/yourrepo/main/scripts/transfer-to-new-account.sh
chmod +x transfer.sh
./transfer.sh
```

Or if you have the project folder accessible:

```bash
# Navigate to the scripts folder
cd /path/to/credit-system-backend/scripts

# Run the transfer script
./transfer-to-new-account.sh

# Verify everything works
./verify-setup.sh
```

## **📋 Complete Workflow Summary**

### **Phase 1: Account Setup (5 min)**
1. Create new admin account "devtest"
2. Log out and log into new account
3. Open Terminal

### **Phase 2: Environment Setup (10 min)**
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install essential tools
brew install node git
brew install --cask visual-studio-code
```

### **Phase 3: Project Transfer (5 min)**
```bash
# Run the transfer script
./scripts/transfer-to-new-account.sh

# Verify setup
./scripts/verify-setup.sh
```

### **Phase 4: Start Testing (1 min)**
```bash
npm start
# Visit http://localhost:3000
# Test the quick login buttons!
```

**Total Time: ~20 minutes for complete isolation! 🎉**
