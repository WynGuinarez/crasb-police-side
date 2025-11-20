# Complete Setup Guide for New Developers

This guide will help you set up the CRASH Police Side Dashboard project from scratch.

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Node.js 18 or higher** installed ([Download here](https://nodejs.org/))
- [ ] **Git** installed ([Download here](https://git-scm.com/))
- [ ] **Code Editor** (VS Code recommended)
- [ ] **Firebase Account** (free tier is fine) - [Sign up here](https://firebase.google.com/)
- [ ] **Google Cloud Account** (for Maps API - optional, only if using map features)

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd crasb-police-side
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. Wait for it to complete (may take 2-5 minutes).

### Step 3: Set Up Environment Variables

#### Option A: Quick Setup (Using Example File)

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**Mac/Linux:**
```bash
cp .env.example .env.local
```

#### Option B: Manual Setup

Create a new file named `.env.local` in the project root with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_ID=crash-police-app
NEXT_PUBLIC_FIREBASE_AUTH_TOKEN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### Step 4: Configure Firebase

#### 4.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard
4. Enable **Firestore Database** when prompted

#### 4.2 Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If no web app exists, click "Add app" → Select web icon (</>)
5. Register your app (you can use any app nickname)
6. Copy the `firebaseConfig` object values

#### 4.3 Update .env.local

Fill in the Firebase values in your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyExample123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### 4.4 Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reports collection
    match /artifacts/{appId}/public/data/active_reports/{reportId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      // Chat subcollection per user
      match /chats/{userId}/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null 
                     && request.resource.data.text.size() > 0
                     && request.resource.data.text.size() <= 500
                     && request.resource.data.senderType in ['police', 'sender']
                     && request.resource.data.timestamp is timestamp;
      }
    }
  }
}
```

4. Click **Publish**

### Step 5: Run the Application

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

### Step 6: Access the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. You'll be redirected to the login page
4. Use these credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Application starts without errors
- [ ] Login page loads correctly
- [ ] Can log in with admin credentials
- [ ] Dashboard page loads
- [ ] No console errors in browser
- [ ] Chat modal opens (may show error if Firebase not configured - that's expected)

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Firebase configuration is missing"

**Solution:**
- Make sure `.env.local` exists in project root
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are filled
- Restart the dev server after updating `.env.local`

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: "Permission denied" in Firestore

**Solution:**
- Check Firestore security rules (Step 4.4)
- Make sure rules are published
- Verify you're using the correct Firebase project

### Issue: TypeScript errors

**Solution:**
```bash
# Clear TypeScript cache
rm -rf .next
npm run dev
```

## 📁 Project Structure

```
crasb-police-side/
├── components/          # React components
│   ├── ReportChatModal.tsx
│   ├── ReportDetailsModal.tsx
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/                # Utility functions
│   └── firebase-config.ts
├── pages/              # Next.js pages
│   ├── _app.tsx
│   ├── dashboard.tsx
│   └── ...
├── styles/             # Global styles
│   └── globals.css
├── .env.example        # Environment variables template
├── .env.local          # Your local environment (not in git)
├── package.json        # Dependencies
└── README.md           # Project documentation
```

## 🎯 Next Steps

After successful setup:

1. **Explore the Dashboard**: Navigate through different pages
2. **Test Chat Functionality**: Open a report and click "Open Chat"
3. **Check Firebase Console**: Verify data is being stored correctly
4. **Read Documentation**: Check `SYSTEM_STRUCTURE.md` for feature details

## 📚 Additional Resources

- **Firebase Setup**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **System Structure**: See [SYSTEM_STRUCTURE.md](./SYSTEM_STRUCTURE.md)
- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🆘 Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review error messages in browser console (F12)
3. Check terminal output for build errors
4. Verify all environment variables are set correctly
5. Ensure Firebase project is properly configured

## ✨ You're All Set!

Once you see the dashboard, you're ready to start developing! 🎉

