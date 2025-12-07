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

### 3. Add Configuration

Open `.env.local` and add:

```env
NEXT_PUBLIC_APP_ID=crash-police-app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Get Google Maps API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing one
3. Enable Maps JavaScript API
4. Create API key and add to `.env.local`

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

For backend integration, see [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)

