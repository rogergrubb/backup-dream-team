# Firebase Setup Guide for MultiPowerAI

## 🚀 Complete Firebase Integration Setup

This guide will walk you through setting up Firebase for your MultiPowerAI application.

---

## Step 1: Firebase Console Setup

### 1.1 Create/Access Your Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select your existing project
3. Follow the wizard (enable Google Analytics if desired)
4. Wait for project creation to complete

### 1.2 Register Your Web App

1. In your Firebase project, click the **Web icon** (</>) to add a web app
2. Register app:
   - **App nickname**: `MultiPowerAI` (or your choice)
   - ✅ Check "Also set up Firebase Hosting" (optional but recommended)
3. Click **Register app**
4. **IMPORTANT**: Copy the `firebaseConfig` object that appears - you'll need these values!

Example of what you'll see:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on Email/Password
   - Toggle to **Enabled**
   - Click **Save**

---

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in production mode** (we'll set rules next)
4. Select a location (choose closest to your users, e.g., `us-central1`)
5. Click **Enable**

### 3.1 Set Firestore Security Rules

1. Click on **Rules** tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User API Keys - users can only read/write their own keys
    match /userApiKeys/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Usage tracking - users can only read/write their own usage
    match /usage/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

## Step 4: Configure Your .env.local File

1. Open `.env.local` in your project root
2. Replace the placeholder values with your Firebase config:

```bash
# Firebase Configuration
# Get these from: Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Firebase Function URL (after deployment - see Step 6)
VITE_FIREBASE_FUNCTION_URL=https://us-central1-your-project-id.cloudfunctions.net/dreamTeamStream
```

**Where to find your Firebase values:**
- Firebase Console → Click the ⚙️ gear icon → Project settings
- Scroll down to "Your apps" section
- Find your web app and click on it
- Copy the config values

---

## Step 5: Enable Billing (Required for Firebase Functions)

**⚠️ IMPORTANT**: Firebase Functions require the Blaze (pay-as-you-go) plan.

1. Go to Firebase Console → Bottom left → **Upgrade**
2. Select **Blaze plan**
3. Add a payment method
4. Set budget alerts (recommended):
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your project
   - Go to **Billing** → **Budgets & alerts**
   - Create a budget (e.g., $10-$25/month is typical for small apps)

**Cost estimates:**
- Free tier includes: 2M invocations/month, 400K GB-seconds, 200K CPU-seconds
- After free tier: ~$0.40 per million invocations
- Most small apps stay within free tier

---

## Step 6: Deploy Firebase Functions

### 6.1 Install Firebase CLI

**Option 1: Using GUI (Recommended for you)**

1. Download and install Node.js from: https://nodejs.org (if not already installed)
2. Open the Firebase Console
3. Go to your project
4. The setup will guide you through installing Firebase CLI

**Option 2: Quick Install via GUI**
1. Go to: https://firebase.google.com/docs/cli#install-cli-windows
2. Download the standalone binary installer for Windows
3. Run the installer
4. Restart your terminal/command prompt

### 6.2 Initialize Firebase in Your Project

1. Open a terminal in your project directory
2. Run: `firebase login`
   - This opens a browser - sign in with your Google account
   - Allow Firebase CLI access

3. Run: `firebase init functions`
   - Choose "Use an existing project"
   - Select your Firebase project from the list
   - Choose **JavaScript** (not TypeScript)
   - Do **NOT** overwrite `functions/index.js` when asked!
   - Say **Yes** to installing dependencies

### 6.3 Deploy Your Functions

1. In your terminal, run:
   ```bash
   firebase deploy --only functions
   ```

2. Wait for deployment to complete (usually 2-5 minutes)

3. After deployment, you'll see output like:
   ```
   ✔  functions[dreamTeamStream(us-central1)] Successful create operation.
   Function URL (dreamTeamStream): https://us-central1-your-project-id.cloudfunctions.net/dreamTeamStream
   ```

4. **COPY THE FUNCTION URL** and update it in your `.env.local`:
   ```bash
   VITE_FIREBASE_FUNCTION_URL=https://us-central1-your-project-id.cloudfunctions.net/dreamTeamStream
   ```

---

## Step 7: Test Your Setup

### 7.1 Start Your Development Server

1. In your project directory, run:
   ```bash
   npm install
   npm run dev
   ```

2. Open your browser to: http://localhost:3000

### 7.2 Create a Test Account

1. Click "Sign Up" or register
2. Enter an email and password
3. Verify you can log in

### 7.3 Configure API Keys

1. Click "API Keys" button in the header
2. Add your Gemini API key:
   - Get it from: https://aistudio.google.com/app/apikey
   - Paste in the "Google (Gemini, Imagen)" field
3. Click "Save Keys"

### 7.4 Test Dream Team

1. In the "Describe the Task" field, enter: "Explain quantum computing in simple terms"
2. Go through steps 2-4 (Files optional, Team should have defaults, Settings)
3. Click "Start Dream Team"
4. Watch the AIs collaborate!

---

## Step 8: Enable Additional APIs (For Image/Video Studios)

If you want to use Image Studio and Video Studio features:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to **APIs & Services** → **Library**
4. Search for and enable:
   - "Vertex AI API"
   - "Cloud AI Platform API"

---

## 🎉 You're Done!

Your Firebase integration is now complete. Here's what's working:

✅ **Authentication** - Users can sign up and log in
✅ **Firestore Database** - Securely stores user API keys and usage data
✅ **Firebase Functions** - Backend handles AI API calls securely
✅ **Dream Team** - Multi-AI collaboration system is operational

---

## 📊 Monitoring & Maintenance

### View Usage & Logs

**Firebase Console:**
- **Authentication**: See user signups
- **Firestore**: View stored data
- **Functions**: Monitor invocations and logs

**Important Links:**
- Firebase Console: https://console.firebase.google.com
- Function Logs: Firebase Console → Functions → Logs tab
- Usage & Billing: Firebase Console → Usage → Details

### Set Up Budget Alerts

1. Go to [Google Cloud Console Billing](https://console.cloud.google.com/billing)
2. Select your project
3. Click "Budgets & alerts"
4. Create a budget with email alerts at 50%, 90%, and 100%

---

## 🐛 Troubleshooting

### Issue: "Firebase config is not set"
**Fix**: Make sure all VITE_FIREBASE_* variables in `.env.local` have actual values (no placeholders)

### Issue: "Function not found" or 404 errors
**Fix**: 
1. Make sure you deployed functions: `firebase deploy --only functions`
2. Check the function URL in `.env.local` matches the deployed URL
3. Restart your dev server after changing `.env.local`

### Issue: "User not authenticated" in functions
**Fix**: Make sure you're logged in. If still failing, check Firebase Authentication is enabled.

### Issue: Functions timing out
**Fix**: This usually means the Gemini API key is not configured or invalid. Add your Gemini key via the API Keys manager in the app.

### Issue: CORS errors
**Fix**: The function already has CORS headers. If you still get errors, make sure you're calling the exact URL from `.env.local`

---

## 🚀 Next Steps

1. **Deploy to Production**: 
   - Run `firebase deploy` to deploy hosting too
   - Or deploy to Vercel/Netlify pointing to your build folder

2. **Add More AI Providers**: 
   - Update `functions/index.js` to support OpenAI, Anthropic, etc.
   - Users can add those API keys in the API Key Manager

3. **Customize AI Agents**:
   - Users can add/edit agents in the Dream Team interface
   - Customize system instructions and models

4. **Monitor Costs**:
   - Check Firebase Console → Usage regularly
   - Review Google Cloud Console → Billing dashboard

---

## 📝 Important Security Notes

1. **API Keys**: User API keys are stored in Firestore. Consider encrypting them for production.
2. **Function URL**: Never expose your Firebase service account keys in client code
3. **Rate Limiting**: Consider adding rate limiting to your functions for production
4. **Budget Alerts**: Always set up budget alerts to avoid unexpected charges

---

Need help? Check the logs:
- Browser Console (F12)
- Firebase Functions Logs (Firebase Console → Functions → Logs)
- Firestore Rules Simulator (Firebase Console → Firestore → Rules → Test)
