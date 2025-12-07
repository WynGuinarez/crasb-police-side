# Complete Setup Guide for New Developers

This guide will help you set up the CRASH Police Side Dashboard project from scratch.

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Node.js 18 or higher** installed ([Download here](https://nodejs.org/))
- [ ] **Git** installed ([Download here](https://git-scm.com/))
- [ ] **Code Editor** (VS Code recommended)
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
New-Item -Path .env.local -ItemType File
```

**Mac/Linux:**
```bash
touch .env.local
```

#### Option B: Manual Setup

Create a new file named `.env.local` in the project root with this content:

```env
NEXT_PUBLIC_APP_ID=crash-police-app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

> **Note**: The application uses a temporary mock database (`lib/TemporaryDatabase.js`) for development. When the backend API is ready, update `NEXT_PUBLIC_API_URL` with your API endpoint.

### Step 4: Run the Application

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

### Step 5: Access the Application

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
- [ ] Chat modal opens and displays mock conversations

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: Build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📁 Project Structure

```
crasb-police-side/
├── components/          # React components
│   ├── ReportChatModal.jsx
│   ├── ReportDetailsModal.jsx
│   ├── PageHeader.jsx
│   ├── NavigationTabs.jsx
│   └── ...
├── lib/                 # Utility functions and data
│   ├── TemporaryDatabase.js
│   └── utils.js
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── lib/                # Utility functions
│   ├── TemporaryDatabase.js   # Temporary mock data (to be replaced with API)
│   └── utils.js               # Shared utility functions
├── pages/              # Next.js pages
│   ├── _app.jsx
│   ├── dashboard.jsx
│   ├── map.jsx
│   ├── analytics.jsx
│   ├── resolved-cases.jsx
│   └── ...
├── styles/             # Global styles
│   └── globals.css
├── .env.local          # Your local environment (not in git)
├── package.json        # Dependencies
└── README.md           # Project documentation
```

## 🎯 Next Steps

After successful setup:

1. **Explore the Dashboard**: Navigate through different pages
2. **Test Chat Functionality**: Open a report and click "Open Chat"
3. **Review Backend Integration**: Check [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for complete endpoint mappings and integration instructions
4. **Read Documentation**: Check `SYSTEM_STRUCTURE.md` for feature details

## 📚 Additional Resources

- **System Structure**: See [SYSTEM_STRUCTURE.md](./SYSTEM_STRUCTURE.md)
- **Backend Integration**: See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) - Complete guide for integrating Django REST API backend
- **Legacy API Guide**: See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) (deprecated, use BACKEND_INTEGRATION_GUIDE.md)

## 🆘 Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review error messages in browser console (F12)
3. Check terminal output for build errors
4. Verify all environment variables are set correctly
5. Check that the application is using mock data from `TemporaryDatabase.js`

## ✨ You're All Set!

Once you see the dashboard, you're ready to start developing! 🎉

