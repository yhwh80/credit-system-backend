# ✅ New Admin Account Setup Checklist

## **Before You Start**
- [ ] Save any important work in your main account
- [ ] Know your main account username
- [ ] Have a strong password ready for the new account

## **Account Creation**
- [ ] Open System Settings → Users & Groups
- [ ] Click lock icon and authenticate
- [ ] Click "+" to add new user
- [ ] Set Account Type: **Administrator**
- [ ] Full Name: `Dev Testing Account`
- [ ] Account Name: `devtest`
- [ ] Set strong password
- [ ] Click "Create User"

## **Account Switch**
- [ ] Log out of current account
- [ ] Log into `devtest` account
- [ ] Verify admin access works
- [ ] Open Terminal

## **Development Setup**
- [ ] Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- [ ] Install Node.js: `brew install node`
- [ ] Install Git: `brew install git`
- [ ] Install VS Code: `brew install --cask visual-studio-code`

## **Project Transfer**
- [ ] Navigate to project: `cd /Users/[yourusername]/credit-system-backend`
- [ ] Run transfer script: `./scripts/transfer-to-new-account.sh`
- [ ] Or manually copy to `~/Documents/credit-system-backend`
- [ ] Fix permissions: `sudo chown -R $(whoami) ~/Documents/credit-system-backend`

## **Project Setup**
- [ ] Navigate to project: `cd ~/Documents/credit-system-backend`
- [ ] Install dependencies: `npm install`
- [ ] Verify setup: `./scripts/verify-setup.sh`
- [ ] Check .env file exists and has correct values

## **Testing**
- [ ] Start server: `npm start`
- [ ] Visit: `http://localhost:3000`
- [ ] Test quick login buttons work
- [ ] Get your IP: `ifconfig en0 | grep 'inet '`
- [ ] Share with friends: `http://[YOUR_IP]:3000`

## **Security Verification**
- [ ] Test client login: `client@test.com` / `password123`
- [ ] Test professional login: `pro@test.com` / `password123`
- [ ] Verify job posting works
- [ ] Verify bidding works
- [ ] Check rate limiting works (try 6 wrong logins)

## **Friend Testing**
- [ ] Share URL with friends
- [ ] Give them the testing guide
- [ ] Collect feedback
- [ ] Monitor for any issues

## **When Done Testing**
- [ ] Back up any important changes
- [ ] Log back into main account
- [ ] Delete `devtest` account (System Settings → Users & Groups)
- [ ] Secure delete the account data

**🎉 You're all set for safe, isolated testing!**
