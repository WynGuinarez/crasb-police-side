# CRASH Web Dashboard

A comprehensive web dashboard for police authorities to manage emergency reports from the CRASH mobile application.

## Features

### 🔐 Authentication
- Admin-only login system
- Secure session management
- Role-based access control

### 📊 Dashboard
- Real-time active reports overview
- Status tracking (Pending, Acknowledged, En Route, Resolved, Canceled)
- Alert notifications for new reports
- Quick actions for each report

### 🗺️ Live Map Monitoring
- Interactive map with live pins for reports and checkpoints
- Police checkpoint management (Add, Edit, Delete)
- Real-time updates every 5 seconds
- Route planning and navigation

### 📈 Analytics & Reports
- Top locations with most reports
- Category statistics (Crime, Fire, Medical, Traffic)
- Resolved cases tracking
- Export functionality
- Date range filtering

### 💬 Communication
- Send messages to reporters
- Status updates with notifications
- Emergency contact management

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Charts**: Recharts (for future analytics)
- **UI Components**: Custom components with Radix UI primitives

## 🚀 Getting Started

> **New to this project?** Start here: [CLONING_INSTRUCTIONS.md](./CLONING_INSTRUCTIONS.md)

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Firebase Account** (for chat functionality - see Firebase Setup below)

### Quick Setup (5 Minutes)

1. **Clone the repository**
```bash
git clone <repository-url>
cd crasb-police-side
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
# On Windows (PowerShell):
Copy-Item .env.example .env.local

# On Mac/Linux:
cp .env.example .env.local
```

4. **Configure Firebase** (Required for chat functionality)
   - Open `.env.local` file
   - Fill in your Firebase credentials (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions)
   - Or use the quick setup below

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Firebase Setup (Required for Chat)

The chat functionality requires Firebase configuration. Follow these steps:

1. **Get Firebase Credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Go to Project Settings → Your apps → Add web app
   - Copy the `firebaseConfig` values

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   NEXT_PUBLIC_APP_ID=crash-police-app
   ```

3. **Set Firestore Security Rules:**
   - Go to Firestore Database → Rules
   - Use the rules from [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

4. **Restart the dev server** after updating `.env.local`

> 📖 **Detailed Firebase Setup**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete instructions

### Troubleshooting

**"Firebase configuration is missing" error:**
- Make sure `.env.local` exists and contains all Firebase variables
- Restart the dev server after creating/updating `.env.local`

**Port already in use:**
```bash
# Use a different port
npm run dev -- -p 3001
```

**Module not found errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
crasb-police-side/
├── components/          # Reusable UI components
│   ├── ReportChatModal.tsx      # Per-report chat functionality
│   ├── ReportDetailsModal.tsx   # Report details view
│   ├── DirectionsModal.tsx      # Navigation directions
│   ├── AddCheckpointModal.tsx  # Add checkpoint
│   └── EditCheckpointModal.tsx # Edit checkpoint
├── contexts/           # React contexts
│   └── AuthContext.tsx         # Authentication context
├── lib/                # Utility libraries
│   └── firebase-config.ts      # Firebase configuration
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper with Firebase init
│   ├── index.tsx       # Root redirect
│   ├── login.tsx      # Login page
│   ├── dashboard.tsx   # Main dashboard
│   ├── map.tsx        # Live map view
│   └── analytics.tsx  # Analytics page
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS and custom styles
├── .env.example        # Environment variables template
├── .env.local          # Your local config (not in git)
├── SETUP_GUIDE.md      # Complete setup instructions
├── FIREBASE_SETUP.md   # Firebase configuration guide
└── package.json        # Dependencies
```

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete step-by-step setup guide
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Firebase configuration details
- **[SYSTEM_STRUCTURE.md](./SYSTEM_STRUCTURE.md)** - System architecture and features
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API endpoints documentation

## Key Features Implementation

### 1. Authentication System
- Mock authentication with localStorage
- Session persistence
- Protected routes
- Role-based access

### 2. Dashboard Overview
- Real-time report status tracking
- Interactive data tables
- Quick action buttons
- Alert notifications

### 3. Report Management
- Detailed report view with all information
- Status change functionality
- Message sending to reporters
- Attachment viewing

### 4. Map Integration
- Google Maps container ready for API integration
- Checkpoint management system
- Live pin updates
- Route planning

### 5. Analytics Dashboard
- Location-based statistics
- Category breakdowns
- Resolution time tracking
- Export capabilities

## API Integration Ready

The application is structured to easily integrate with:
- Django REST API for report data
- Google Maps API for mapping functionality
- Real-time WebSocket connections for live updates
- File storage for attachments

## Customization

### Styling
- Uses Tailwind CSS with custom color scheme matching mobile app
- Consistent design system with mobile app
- Responsive design for all screen sizes

### Components
- Modular component architecture
- Reusable UI elements
- Consistent interaction patterns

## Future Enhancements

- [ ] Real Google Maps integration
- [ ] WebSocket for real-time updates
- [ ] Advanced filtering and search
- [ ] Mobile responsive optimizations
- [ ] Dark mode support
- [ ] Advanced analytics charts
- [ ] Report templates
- [ ] Bulk operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
