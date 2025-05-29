# 🚀 START HERE - New Account Setup

## **📍 You Are Here: New Admin Account**

Welcome to your new `devtest` account! All the setup instructions are saved in these files:

### **📂 Where to Find Everything:**
```
/Users/s.dot/credit-system-backend/SETUP_NEW_MACHINE.md    ← Complete guide
/Users/s.dot/credit-system-backend/NEW_ACCOUNT_CHECKLIST.md ← Step-by-step checklist  
/Users/s.dot/credit-system-backend/scripts/                ← Automated scripts
```

## **⚡ Super Quick Setup (Copy & Paste These Commands):**

### **Step 1: Install Tools (10 minutes)**
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install development tools
brew install node git
brew install --cask visual-studio-code
```

### **Step 2: Copy Project (2 minutes)**
```bash
# Create workspace
mkdir -p ~/Documents/Projects
cd ~/Documents/Projects

# Copy your project (replace 's.dot' with your username)
sudo cp -R /Users/s.dot/credit-system-backend ./
sudo chown -R $(whoami) credit-system-backend

# Navigate to project
cd credit-system-backend
```

### **Step 3: Setup & Start (2 minutes)**
```bash
# Install dependencies
npm install

# Start the server
npm start
```

### **Step 4: Test Everything**
- Open browser: `http://localhost:3000`
- Test quick login buttons
- Share with friends: `http://[YOUR_IP]:3000`

## **🎯 That's It - Total Time: ~15 minutes!**

### **📱 Test Accounts Ready:**
- **Client:** `client@test.com` / `password123`
- **Professional:** `pro@test.com` / `password123`
- **Sarah (Client):** `sarah@test.com` / `password123`
- **Mike (Pro):** `mike@test.com` / `password123`

## **🆘 Need Help?**
- **Full Guide:** Open `SETUP_NEW_MACHINE.md`
- **Checklist:** Open `NEW_ACCOUNT_CHECKLIST.md`
- **Automated Scripts:** Use files in `scripts/` folder

**🎉 See you on the other side! Your platform will be running safely in isolation!**
