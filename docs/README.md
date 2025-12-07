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

- **Frontend**: Next.js 14, React 18, JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Maps**: Google Maps API
- **UI Components**: Custom components with Radix UI primitives

## 🚀 Getting Started

> **New to this project?** Start here: [CLONING_INSTRUCTIONS.md](./CLONING_INSTRUCTIONS.md)

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**

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

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Troubleshooting

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
│   ├── ReportChatModal.jsx      # Per-report chat functionality
│   ├── ReportDetailsModal.jsx   # Report details view
│   ├── DirectionsModal.jsx      # Navigation directions
│   ├── AddCheckpointModal.jsx  # Add checkpoint
│   ├── EditCheckpointModal.jsx # Edit checkpoint
│   ├── PageHeader.jsx          # Shared page header
│   └── NavigationTabs.jsx       # Shared navigation tabs
├── contexts/           # React contexts
│   └── AuthContext.jsx         # Authentication context
├── lib/                # Utility libraries
│   ├── TemporaryDatabase.js   # Temporary mock data (to be replaced with API)
│   └── utils.js               # Shared utility functions
├── pages/              # Next.js pages
│   ├── _app.jsx        # App wrapper
│   ├── index.jsx       # Root redirect
│   ├── login.jsx      # Login page
│   ├── dashboard.jsx   # Main dashboard
│   ├── map.jsx        # Live map view
│   ├── analytics.jsx  # Analytics page
│   └── resolved-cases.jsx # Resolved cases page
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS and custom styles
├── docs/               # Documentation
│   ├── README.md       # Project overview
│   ├── SETUP_GUIDE.md  # Complete setup guide
│   └── ...             # Other documentation files
├── .env.local          # Your local config (not in git)
└── package.json        # Dependencies
```

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete step-by-step setup guide
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start
- **[SYSTEM_STRUCTURE.md](./SYSTEM_STRUCTURE.md)** - System architecture and features
- **[DJANGO_BACKEND_INTEGRATION.md](./DJANGO_BACKEND_INTEGRATION.md)** - **START HERE!** Complete Django backend integration guide (CORS, Axios, Authentication)
- **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)** - Endpoint mappings and integration points reference
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Legacy API integration guide (deprecated)

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
