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
New-Item -Path .env.local -ItemType File
# Mac/Linux:
# touch .env.local

# 4. Edit .env.local and add your API credentials
# (See SETUP_GUIDE.md for details)

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

**Create manually**
```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Mac/Linux
touch .env.local
```

Then add this content to `.env.local`:

```env
NEXT_PUBLIC_APP_ID=crash-police-app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 4: Configure API Endpoint

Update `NEXT_PUBLIC_API_URL` in `.env.local` with your backend API URL.

### Step 5: Verify Setup

Check that:
- ✅ Node.js version 18+ is installed
- ✅ Dependencies are installed (`node_modules` exists)
- ✅ Environment file exists (`.env.local`)

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
3. **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - API integration guide

## ⚠️ Common Issues

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "API configuration is missing"
- Make sure `.env.local` exists
- Fill in `NEXT_PUBLIC_API_URL` variable
- Restart dev server

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## ✅ Success Checklist

After setup, verify:

- [ ] `npm install` completed without errors
- [ ] `.env.local` file exists with API configuration
- [ ] `npm run dev` starts successfully
- [ ] Can access http://localhost:3000
- [ ] Can log in with admin/admin123
- [ ] Dashboard loads without errors

## 🆘 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting
2. Check browser console (F12) for errors
3. Verify all environment variables in `.env.local`
4. Ensure backend API is running if using API integration
5. For backend integration, see [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)

## 🎉 You're Ready!

Once you see the dashboard, you're all set to start developing!

