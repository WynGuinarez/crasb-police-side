# 🚀 Quick Start Guide

Get the project running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Git installed

## Setup Steps

### 1. Clone & Install
```bash
git clone <repository-url>
cd crasb-police-side
npm install
```

### 2. Create Environment File

**Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
```

**Mac/Linux:**
```bash
touch .env.local
```

### 3. Add Firebase Configuration

Open `.env.local` and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_APP_ID=crash-police-app
```

**Get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Your apps → Add web app
3. Copy the config values

### 4. Run the App
```bash
npm run dev
```

### 5. Login
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin123`

## That's it! 🎉

For detailed setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

