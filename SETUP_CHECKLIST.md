# ✅ Firebase Setup Checklist

Copy this checklist and check off each step as you complete it!

---

## 🔥 Firebase Console Setup

### Step 1: Create/Access Project
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Add project" or select existing project
- [ ] Project created successfully

### Step 2: Register Web App
- [ ] Click the Web icon (</>) 
- [ ] Enter app nickname: "MultiPowerAI"
- [ ] Copy the `firebaseConfig` values shown
- [ ] Saved config values somewhere safe

### Step 3: Enable Authentication
- [ ] Go to Authentication in sidebar
- [ ] Click "Get started"
- [ ] Enable Email/Password sign-in method
- [ ] Click Save

### Step 4: Create Firestore Database
- [ ] Go to Firestore Database in sidebar
- [ ] Click "Create database"
- [ ] Select "Production mode"
- [ ] Choose a location (e.g., us-central1)
- [ ] Click Enable

### Step 5: Set Firestore Rules
- [ ] Click Rules tab in Firestore
- [ ] Copy the rules from FIREBASE_SETUP_GUIDE.md
- [ ] Paste into the editor
- [ ] Click Publish

### Step 6: Upgrade to Blaze Plan
- [ ] Click Upgrade in bottom left
- [ ] Select Blaze (pay-as-you-go) plan
- [ ] Add payment method
- [ ] Set up budget alerts (recommended)

---

## ⚙️ Local Configuration

### Step 7: Update .env.local
- [ ] Open `.env.local` file in project
- [ ] Replace `VITE_FIREBASE_API_KEY` with your value
- [ ] Replace `VITE_FIREBASE_AUTH_DOMAIN` with your value
- [ ] Replace `VITE_FIREBASE_PROJECT_ID` with your value
- [ ] Replace `VITE_FIREBASE_STORAGE_BUCKET` with your value
- [ ] Replace `VITE_FIREBASE_MESSAGING_SENDER_ID` with your value
- [ ] Replace `VITE_FIREBASE_APP_ID` with your value
- [ ] Leave `VITE_FIREBASE_FUNCTION_URL` for now (will update after deploy)
- [ ] Saved the file

---

## 🚀 Firebase Functions Deployment

### Step 8: Install Firebase CLI
Choose one option:
- [ ] Option A: Downloaded standalone installer from firebase.google.com
- [ ] Option B: Installed via npm (if you prefer command line)
- [ ] Restarted terminal/command prompt

### Step 9: Login to Firebase
- [ ] Ran: `firebase login`
- [ ] Browser opened and logged in with Google account
- [ ] Terminal shows "Success! Logged in as..."

### Step 10: Initialize Functions
- [ ] Opened terminal in project directory
- [ ] Ran: `firebase init functions`
- [ ] Selected "Use an existing project"
- [ ] Chose your Firebase project from list
- [ ] Selected JavaScript (not TypeScript)
- [ ] Said NO to overwriting functions/index.js
- [ ] Said Yes to install dependencies
- [ ] Initialization completed

### Step 11: Deploy Functions
- [ ] Ran: `firebase deploy --only functions`
- [ ] Waited for deployment (2-5 minutes)
- [ ] Copied the function URL from output
- [ ] Updated `VITE_FIREBASE_FUNCTION_URL` in `.env.local`
- [ ] Saved `.env.local` file

---

## 💻 Run the Application

### Step 12: Install Dependencies
- [ ] Ran: `npm install`
- [ ] No errors during installation

### Step 13: Start Dev Server
- [ ] Ran: `npm run dev`
- [ ] Server started successfully
- [ ] Opened http://localhost:3000 in browser
- [ ] App loads without errors

---

## 🧪 Test the Application

### Step 14: Create Test Account
- [ ] Clicked Sign Up
- [ ] Entered email and password
- [ ] Successfully created account
- [ ] Logged in successfully

### Step 15: Add API Keys
- [ ] Clicked "API Keys" button in header
- [ ] Got Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Pasted Gemini API key
- [ ] Clicked "Save Keys"
- [ ] Keys saved successfully

### Step 16: Test Dream Team
- [ ] Entered a test prompt: "Explain quantum computing simply"
- [ ] Went through setup steps 2-4
- [ ] Clicked "Start Dream Team"
- [ ] Saw AIs responding in sequence
- [ ] Responses streaming correctly
- [ ] No errors in browser console (F12)

---

## 🎉 Final Checks

### Step 17: Verify Everything Works
- [ ] Can sign up new users
- [ ] Can sign in/out
- [ ] Can add/edit API keys
- [ ] Dream Team runs successfully
- [ ] Responses are being streamed
- [ ] No console errors
- [ ] Functions logs look good (Firebase Console → Functions → Logs)

### Step 18: Set Up Monitoring
- [ ] Checked Firebase Console → Authentication (see user count)
- [ ] Checked Firebase Console → Firestore (see userApiKeys collection)
- [ ] Checked Firebase Console → Functions (see invocation count)
- [ ] Set up budget alerts in Google Cloud Console

---

## 🏆 Completion Status

Count your checkmarks:

- [ ] **Firebase Setup** (Steps 1-6): ___/6 complete
- [ ] **Local Config** (Step 7): ___/1 complete
- [ ] **Functions Deploy** (Steps 8-11): ___/4 complete
- [ ] **Run App** (Steps 12-13): ___/2 complete
- [ ] **Testing** (Steps 14-16): ___/3 complete
- [ ] **Final Checks** (Steps 17-18): ___/2 complete

**Total: ___/18 steps complete**

---

## 🚨 Stuck on a Step?

### Check These First:
1. All `.env.local` values filled in (no placeholders)?
2. Firebase Functions deployed successfully?
3. Restarted dev server after changing `.env.local`?
4. Check browser console (F12) for error messages
5. Check Firebase Console → Functions → Logs

### Still Need Help?
See **FIREBASE_SETUP_GUIDE.md** → Troubleshooting section

---

## ✅ All Done!

Once all boxes are checked, you have:
- ✅ Fully working Firebase integration
- ✅ Secure authentication system
- ✅ Backend functions processing AI requests
- ✅ Database storing user data
- ✅ Dream Team collaboration working

**Congratulations! Your MultiPowerAI app is live! 🎊**

---

## 📝 Optional Next Steps

- [ ] Customize AI agents in UI
- [ ] Add more AI provider API keys
- [ ] Deploy to production (Firebase Hosting/Vercel)
- [ ] Share with friends to test
- [ ] Monitor usage and costs

---

*Save this file and use it as your setup guide!*
