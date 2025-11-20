# 📥 Instructions for Cloning This Project

This document provides step-by-step instructions for anyone cloning this repository.

## 🎯 Quick Start (Copy-Paste Ready)

```bash
# 1. Clone the repository
git clone <repository-url>
cd crasb-police-side

# 2. Install dependencies
npm install

# 3. Create environment file
# Windows (PowerShell):
Copy-Item .env.example .env.local
# Mac/Linux:
# cp .env.example .env.local

# 4. Edit .env.local and add your Firebase credentials
# (See FIREBASE_SETUP.md for details)

# 5. Run the application
npm run dev

# 6. Open http://localhost:3000
# Login: admin / admin123
```

## 📋 Detailed Steps

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd crasb-police-side
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 567 packages, and audited 567 packages in 2m
```

### Step 3: Create Environment File

**Option A: Copy from example (if .env.example exists)**
```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

**Option B: Create manually**
```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Mac/Linux
touch .env.local
```

Then add this content to `.env.local`:

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

### Step 4: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/Select project
3. Project Settings → Your apps → Add web app
4. Copy the `firebaseConfig` values
5. Paste into `.env.local`

### Step 5: Verify Setup

```bash
npm run setup-check
```

This will verify:
- ✅ Node.js version
- ✅ Dependencies installed
- ✅ Environment file exists
- ✅ Firebase config present

### Step 6: Run Application

```bash
npm run dev
```

Visit: http://localhost:3000

## 🔑 Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 📚 Documentation Files

After cloning, read these in order:

1. **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup guide
3. **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Firebase configuration
4. **[INSTALL_INSTRUCTIONS.md](./INSTALL_INSTRUCTIONS.md)** - Detailed installation

## ⚠️ Common Issues

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Firebase configuration is missing"
- Make sure `.env.local` exists
- Fill in all `NEXT_PUBLIC_FIREBASE_*` variables
- Restart dev server

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## ✅ Success Checklist

After setup, verify:

- [ ] `npm install` completed without errors
- [ ] `.env.local` file exists with Firebase config
- [ ] `npm run dev` starts successfully
- [ ] Can access http://localhost:3000
- [ ] Can log in with admin/admin123
- [ ] Dashboard loads without errors

## 🆘 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting
2. Run `npm run setup-check` to verify setup
3. Check browser console (F12) for errors
4. Verify all environment variables in `.env.local`

## 🎉 You're Ready!

Once you see the dashboard, you're all set to start developing!

