# Installation Instructions

## For New Developers / Cloning the Project

Follow these steps to get the project running on your machine.

### Step 1: Prerequisites

Make sure you have installed:
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
git --version   # Should show git version
```

### Step 2: Clone the Repository

```bash
git clone <repository-url>
cd crasb-police-side
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages. Wait for completion (2-5 minutes).

**If you encounter errors:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Step 4: Environment Setup

#### Create Environment File

**Windows:**
```powershell
# PowerShell
New-Item -Path .env.local -ItemType File

# Or Command Prompt
type nul > .env.local
```

**Mac/Linux:**
```bash
touch .env.local
```

#### Configure Environment Variables

Open `.env.local` and add the following (you'll fill in the values next):

```env
# Firebase Configuration (Required for chat functionality)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Application ID
NEXT_PUBLIC_APP_ID=crash-police-app

# Optional: Firebase Auth Token
NEXT_PUBLIC_FIREBASE_AUTH_TOKEN=

# Optional: Google Maps API Key (for map features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### Step 5: Firebase Setup

#### 5.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "crash-police-app")
4. Follow the setup wizard
5. **Enable Firestore Database** when prompted

#### 5.2 Get Firebase Credentials

1. In Firebase Console, click ⚙️ (Settings) → Project settings
2. Scroll to "Your apps" section
3. Click "Add app" → Web icon (</>)
4. Register app (use any nickname)
5. Copy the `firebaseConfig` values

#### 5.3 Update .env.local

Fill in the Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (from firebaseConfig)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef
```

#### 5.4 Configure Firestore Rules

1. In Firebase Console → Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/active_reports/{reportId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      match /chats/{userId}/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null 
                     && request.resource.data.text.size() <= 500
                     && request.resource.data.senderType in ['police', 'sender'];
      }
    }
  }
}
```

3. Click "Publish"

### Step 6: Run the Application

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

### Step 7: Access the Application

1. Open browser: http://localhost:3000
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

## ✅ Verification

Check that everything works:

- [ ] Application starts without errors
- [ ] Login page loads
- [ ] Can log in successfully
- [ ] Dashboard displays
- [ ] No errors in browser console (F12)
- [ ] Chat modal opens (may show Firebase error if not configured - that's OK)

## 🔧 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Firebase configuration is missing"
- Check `.env.local` exists
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are filled
- Restart dev server: `Ctrl+C` then `npm run dev`

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

### TypeScript errors
```bash
rm -rf .next
npm run dev
```

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Check [SYSTEM_STRUCTURE.md](./SYSTEM_STRUCTURE.md) for features
- Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for Firebase details

## 🆘 Still Having Issues?

1. Check browser console (F12) for errors
2. Check terminal for build errors
3. Verify Node.js version: `node --version` (should be 18+)
4. Make sure `.env.local` is in project root (not in subfolder)
5. Restart your code editor

## ✨ Success!

If you see the dashboard, you're all set! 🎉

