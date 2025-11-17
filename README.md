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

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd crash-web-dashboard
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- **Username**: admin
- **Password**: admin123

## Project Structure

```
crash-web-dashboard/
├── components/          # Reusable UI components
│   ├── AddCheckpointModal.tsx
│   ├── EditCheckpointModal.tsx
│   ├── DirectionsModal.tsx
│   └── ReportDetailsModal.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Next.js pages
│   ├── _app.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── map.tsx
│   └── analytics.tsx
├── styles/             # Global styles
│   └── globals.css
└── public/             # Static assets
```

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
