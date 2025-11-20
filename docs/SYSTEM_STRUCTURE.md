# CRASH Police Side - System Structure Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Page Structure](#page-structure)
3. [Navigation Flow](#navigation-flow)
4. [Components & Modals](#components--modals)
5. [User Actions & Buttons](#user-actions--buttons)
6. [Data Models](#data-models)
7. [Feature Flows](#feature-flows)

---

## Application Overview

**CRASH Police Side Dashboard** - A comprehensive web dashboard for police authorities to manage emergency reports and checkpoints from the CRASH mobile application.

**Technology Stack:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Google Maps API
- React Hot Toast (Notifications)

---

## Page Structure

### 1. **Index Page** (`/` - `pages/index.tsx`)
- **Purpose**: Root redirect page
- **Actions**:
  - Auto-redirects authenticated users to `/dashboard`
  - Auto-redirects unauthenticated users to `/login`
- **No UI Elements**

### 2. **Login Page** (`/login` - `pages/login.tsx`)
- **Purpose**: Authentication entry point
- **UI Elements**:
  - CRASH Logo (C icon in circle)
  - Page Title: "CRASH Dashboard"
  - Subtitle: "Police Authority Login"
  - **Form Fields**:
    - Username input (text field)
    - Password input (with show/hide toggle)
  - **Buttons**:
    - **Login Button** (Primary) - Submits credentials
    - **Show/Hide Password Toggle** (Eye icon)
- **Actions**:
  - Form validation (username & password required)
  - Authentication check
  - Redirect to dashboard on success
  - Error display for invalid credentials
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`

### 3. **Dashboard Page** (`/dashboard` - `pages/dashboard.tsx`)
- **Purpose**: Main control center for active reports
- **Header Elements**:
  - CRASH Logo & Title
  - User Info Display (Name & Role)
  - Notification Bell Icon
  - **Logout Button** (LogOut icon)
- **Navigation Tabs**:
  - **Dashboard Tab** (Home icon) - Current page
  - **Live Map Tab** (Map icon) - Navigate to `/map`
  - **Analytics Tab** (BarChart3 icon) - Navigate to `/analytics`
- **Main Content**:
  - **Page Title**: "Active Reports Dashboard"
  - **Reports Table** with columns:
    - Reporter Name
    - Category (Crime, Fire, Medical, Traffic)
    - Location (City, Barangay)
    - Status Badge (Pending, Acknowledged, En Route, Resolved, Canceled)
    - Timestamp
    - **Action Buttons** (per row):
      - **View Button** (Eye icon) - Opens Report Details Modal
      - **Directions Button** (Navigation icon) - Opens Directions Modal
- **Modals**:
  - Report Details Modal
  - Directions Modal
- **Features**:
  - Real-time report updates (every 5 seconds)
  - New report alerts
  - Status filtering by badge colors

### 4. **Live Map Page** (`/map` - `pages/map.tsx`)
- **Purpose**: Interactive map with checkpoints and reports
- **Header Elements**:
  - CRASH Logo & Title
  - User Info Display
  - Notification Bell Icon
  - **Logout Button**
- **Navigation Tabs**:
  - **Dashboard Tab** - Navigate to `/dashboard`
  - **Live Map Tab** - Current page
  - **Analytics Tab** - Navigate to `/analytics`
- **Map Controls**:
  - **Page Title**: "Live Map Monitoring"
  - **Legend Button** (Info icon, Secondary) - Opens Map Legend Modal
  - **Add Checkpoint Button** (Plus icon, Primary) - Opens Add Checkpoint Modal
- **Filter Buttons**:
  - **Active Cases Toggle** (Red indicator) - Shows/hides report pins
  - **Police Checkpoints Toggle** (Blue indicator) - Shows/hides checkpoint pins
  - **Police Offices/Station Toggle** (Green indicator) - Shows/hides office pins
  - **Checkpoint Filter Dropdown** (conditional, appears when Police Checkpoints is active):
    - All Checkpoints
    - Active Checkpoints
    - Inactive Checkpoints
- **Map Features**:
  - Google Maps integration
  - **Report Pins** (color-coded by category):
    - Red: Crime Reports
    - Orange: Fire Reports
    - Green: Medical Reports
    - Gray: Other Reports
  - **Checkpoint Pins** (color-coded by status):
    - Blue: Active Checkpoints
    - Gray: Inactive Checkpoints
  - Click on pin → Shows detail popup
- **Pin Detail Popup** (when pin clicked):
  - **For Reports**:
    - Category & Reporter name
    - Location details
    - Status
    - **View Full Details Button** - Opens Report Details Modal
    - Close button (X)
  - **For Checkpoints**:
    - Checkpoint name
    - Assigned officers
    - Operating hours (Time: HH:MM - HH:MM or 24/7)
    - Contact number
    - Address
    - **Edit Button** (Pencil icon) - Opens Edit Checkpoint Modal
    - **Remove Button** (Trash2 icon) - Deletes checkpoint
    - Close button (X)
- **Modals**:
  - Add Checkpoint Modal
  - Edit Checkpoint Modal
  - Report Details Modal
  - Map Legend Modal
- **Features**:
  - Real-time checkpoint status updates (every minute)
  - Active checkpoint determination based on current time vs operating hours

### 5. **Analytics Page** (`/analytics` - `pages/analytics.tsx`)
- **Purpose**: Data analysis and statistics
- **Header Elements**:
  - CRASH Logo & Title
  - User Info Display
  - Notification Bell Icon
  - **Logout Button**
- **Navigation Tabs**:
  - **Dashboard Tab** - Navigate to `/dashboard`
  - **Live Map Tab** - Navigate to `/map`
  - **Analytics Tab** - Current page
- **Page Controls**:
  - **View Toggle**:
    - **Top Locations View** (default)
    - **Resolved Cases View**
  - **Date Range Dropdown** (Calendar icon):
    - Last 7 days
    - Last 30 days
    - Last 90 days
    - Last year
  - **Category Filter Dropdown** (Filter icon):
    - All Categories
    - Crime
    - Fire
    - Medical
    - Traffic
  - **Export Button** (Download icon) - Exports analytics data
- **Top Locations View**:
  - Statistics cards:
    - Total Reports
    - Resolved Cases
    - Average Resolution Time
  - Top Locations Table:
    - City & Barangay
    - Report count
    - Percentage
    - Visual progress bars
- **Resolved Cases View**:
  - Resolved Cases Table:
    - Reporter name
    - Category
    - Location
    - Date reported
    - Date resolved
    - Resolution time
    - **View Details Button** (Eye icon) - Opens Resolved Case Details Modal
- **Modals**:
  - Resolved Case Details Modal
- **Features**:
  - Data visualization
  - Export functionality
  - Filtering and date range selection

---

## Navigation Flow

```
┌─────────────────┐
│   Index (/)     │
│  (Auto-redirect)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│ Login │  │Dashboard│
└───┬───┘  └───┬────┘
    │          │
    └────┬─────┘
         │
    ┌────▼────┐
    │Dashboard│◄─────────┐
    └────┬────┘          │
         │               │
    ┌────┴────┐          │
    │         │          │
┌───▼───┐  ┌──▼────┐     │
│  Map  │  │Analytics│    │
└───────┘  └────────┘     │
    │          │          │
    └──────────┴──────────┘
         (Tab Navigation)
```

**Navigation Rules:**
- Unauthenticated users → Redirected to `/login`
- Authenticated users → Can access Dashboard, Map, Analytics
- Tab navigation available on all main pages
- Logout → Returns to `/login`

---

## Components & Modals

### 1. **AddCheckpointModal** (`components/AddCheckpointModal.tsx`)
- **Trigger**: "Add Checkpoint" button on Map page
- **Purpose**: Create new police checkpoint
- **Form Fields**:
  - Checkpoint Name* (text input)
  - Checkpoint Contact Number* (tel input with Phone icon)
  - Location Address* (text input)
  - Latitude (number input, optional)
  - Longitude (number input, optional)
  - Assigned Officers (dynamic list):
    - Multiple officer name inputs
    - **Add Officer Button** (Plus icon)
    - **Remove Officer Button** (Minus icon, per officer)
  - Time Start (24-hour format)* (text input with Clock icon, HH:MM format)
  - Time End (24-hour format)* (text input with Clock icon, HH:MM format)
  - Status (dropdown):
    - Active
    - Inactive
- **Buttons**:
  - **Cancel Button** (Secondary) - Closes modal
  - **Add Checkpoint Button** (Primary) - Submits form
- **Validation**:
  - Required fields check
  - Phone number format validation
  - Time format validation (HH:MM, 00-23 hours, 00-59 minutes)
- **Actions**:
  - Creates checkpoint with unique ID
  - Adds to map
  - Shows success toast

### 2. **EditCheckpointModal** (`components/EditCheckpointModal.tsx`)
- **Trigger**: "Edit" button in checkpoint pin popup or checkpoint detail
- **Purpose**: Modify existing checkpoint
- **Form Fields**: (Same as AddCheckpointModal, pre-filled)
  - Checkpoint Name*
  - Checkpoint Contact Number*
  - Location Address*
  - Latitude
  - Longitude
  - Assigned Officers (comma-separated input)
  - Time Start (24-hour format)*
  - Time End (24-hour format)*
  - Status
- **Buttons**:
  - **Cancel Button** (Secondary)
  - **Update Checkpoint Button** (Primary)
  - **Delete Checkpoint Button** (Danger, full width) - Opens confirmation modal
- **Delete Confirmation Modal**:
  - Warning message
  - **Cancel Button**
  - **Delete Button** (Danger)
- **Actions**:
  - Updates checkpoint data
  - Resets filter to "All" after update
  - Deletes checkpoint on confirmation

### 3. **ReportDetailsModal** (`components/ReportDetailsModal.tsx`)
- **Trigger**: "View" button on Dashboard or "View Full Details" in map popup
- **Purpose**: Display complete report information
- **Sections**:
  - **Header**: Category icon & title
  - **Reporter Information**:
    - Name
    - Phone (clickable to call)
    - Email (clickable to email)
  - **Location Information**:
    - City & Barangay
    - Full address
    - Coordinates
  - **Report Details**:
    - Description
    - Timestamp
    - Current status
  - **Emergency Contact**:
    - Name
    - Phone
  - **Attachments** (expandable):
    - Image attachments
    - Video attachments
    - **Show/Hide Attachments Toggle**
  - **Status Update Section**:
    - Status dropdown:
      - Pending
      - Acknowledged
      - En Route
      - Resolved
      - Canceled
    - **Update Status Button**
  - **Message Section**:
    - Message textarea
    - **Send Message Button**
- **Buttons**:
  - **Close Button** (X icon, top right)
  - **Update Status Button** (Primary)
  - **Send Message Button** (Primary)
- **Actions**:
  - Updates report status
  - Sends message to reporter
  - Shows success/error toasts

### 4. **DirectionsModal** (`components/DirectionsModal.tsx`)
- **Trigger**: "Directions" button on Dashboard
- **Purpose**: Navigation to report location
- **Content**:
  - **From**: Police Station location
  - **To**: Report location
  - **Address Display**
  - **Google Maps Link** (External link icon)
  - **QR Code Section** (optional):
    - **Show QR Code Toggle**
    - QR code display
- **Buttons**:
  - **Copy Directions URL Button** (Copy icon)
  - **Open in Google Maps Button** (External link icon)
  - **Close Button** (X icon)
- **Actions**:
  - Generates Google Maps directions URL
  - Copies URL to clipboard
  - Opens Google Maps in new tab

### 5. **MapLegendModal** (`components/MapLegendModal.tsx`)
- **Trigger**: "Legend" button on Map page
- **Purpose**: Explain pin colors and meanings
- **Content Sections**:
  - **Active Cases**:
    - Red pin → Crime Reports
    - Orange pin → Fire Reports
    - Green pin → Medical Reports
    - Gray pin → Other Reports
  - **Police Checkpoints**:
    - Blue pin → Active Checkpoints
    - Gray pin → Inactive Checkpoints
  - **Info Note**: "Click on any pin on the map to view detailed information."
- **Buttons**:
  - **Close Button** (Primary, bottom)
  - **X Button** (top right)

### 6. **ResolvedCaseDetailsModal** (`components/ResolvedCaseDetailsModal.tsx`)
- **Trigger**: "View Details" button in Analytics Resolved Cases view
- **Purpose**: Display resolved case information
- **Content Sections**:
  - Case ID
  - Reporter information
  - Category
  - Location details
  - Description
  - Date reported
  - Date resolved
  - Resolution time
  - Final status
  - Resolution notes (if available)
- **Buttons**:
  - **Close Button** (X icon)

---

## User Actions & Buttons

### Authentication Actions
- **Login** (`/login`)
  - Submit credentials
  - Show/hide password
  - Navigate to dashboard

- **Logout** (All pages)
  - Clear session
  - Redirect to login

### Dashboard Actions
- **View Report** → Opens Report Details Modal
- **Get Directions** → Opens Directions Modal
- **Navigate to Map** → Routes to `/map`
- **Navigate to Analytics** → Routes to `/analytics`

### Map Actions
- **Add Checkpoint** → Opens Add Checkpoint Modal
- **View Legend** → Opens Map Legend Modal
- **Toggle Active Cases** → Show/hide report pins
- **Toggle Police Checkpoints** → Show/hide checkpoint pins
- **Toggle Police Offices** → Show/hide office pins
- **Filter Checkpoints** → Filter by All/Active/Inactive
- **Click Pin** → Show detail popup
- **Edit Checkpoint** (from popup) → Opens Edit Checkpoint Modal
- **Delete Checkpoint** (from popup) → Confirms and deletes
- **View Report Details** (from popup) → Opens Report Details Modal

### Analytics Actions
- **Switch View** → Toggle between Top Locations and Resolved Cases
- **Change Date Range** → Filter by time period
- **Filter by Category** → Filter by report category
- **Export Data** → Download analytics data
- **View Resolved Case** → Opens Resolved Case Details Modal

### Modal Actions
- **Close Modal** → X button or Cancel button
- **Submit Form** → Primary action buttons
- **Delete with Confirmation** → Two-step delete process

---

## Data Models

### Report Interface
```typescript
interface Report {
  id: string
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  city: string
  barangay: string
  category: string  // 'Crime' | 'Fire' | 'Medical' | 'Traffic'
  status: 'pending' | 'acknowledged' | 'en-route' | 'resolved' | 'canceled'
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  attachments: string[]
  emergencyContact: {
    name: string
    phone: string
  }
  timestamp: string
}
```

### Checkpoint Interface
```typescript
interface Checkpoint {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    address: string
  }
  assignedOfficers: string[]
  schedule: string
  timeStart: string  // HH:MM format (24-hour)
  timeEnd: string    // HH:MM format (24-hour)
  status: 'active' | 'inactive'
  contactNumber: string
}
```

### Analytics Data Interface
```typescript
interface AnalyticsData {
  topLocations: {
    city: string
    barangay: string
    count: number
    percentage: number
  }[]
  resolvedCases: {
    id: string
    reporterName: string
    reporterPhone: string
    reporterEmail: string
    category: string
    city: string
    barangay: string
    location: {
      address: string
      lat: number
      lng: number
    }
    description: string
    dateReported: string
    dateResolved: string
    resolutionTime: string
    finalStatus: string
    resolutionNotes?: string
  }[]
  categoryStats: {
    category: string
    count: number
    percentage: number
  }[]
  timeStats: {
    period: string
    count: number
  }[]
}
```

---

## Feature Flows

### 1. Login Flow
```
User visits site
  ↓
Redirected to /login
  ↓
Enter credentials
  ↓
Click Login
  ↓
Validation
  ↓
Success → Redirect to /dashboard
  ↓
Failure → Show error message
```

### 2. Report Management Flow
```
Dashboard
  ↓
View Reports Table
  ↓
Click "View" → Report Details Modal
  ↓
[Option 1] Update Status
  ↓
Select new status → Update
  ↓
[Option 2] Send Message
  ↓
Type message → Send
  ↓
[Option 3] Get Directions
  ↓
Click "Directions" → Directions Modal
  ↓
Copy URL or Open in Google Maps
```

### 3. Checkpoint Management Flow
```
Map Page
  ↓
Click "Add Checkpoint"
  ↓
Add Checkpoint Modal
  ↓
Fill form (Name, Contact, Address, Time Start/End, Officers, Status)
  ↓
Submit
  ↓
Checkpoint appears on map
  ↓
[Edit Flow]
  ↓
Click checkpoint pin → Popup
  ↓
Click "Edit"
  ↓
Edit Checkpoint Modal
  ↓
Modify fields
  ↓
Update → Changes reflected on map
  ↓
[Delete Flow]
  ↓
Click "Remove" in popup
  ↓
Confirmation modal
  ↓
Confirm → Checkpoint removed
```

### 4. Map Navigation Flow
```
Map Page
  ↓
Toggle filters (Active Cases, Checkpoints, Offices)
  ↓
[If Checkpoints active] Select filter (All/Active/Inactive)
  ↓
Map shows filtered pins
  ↓
Click pin → Detail popup
  ↓
[For Reports] View Full Details → Report Details Modal
  ↓
[For Checkpoints] Edit/Remove actions
  ↓
Click "Legend" → Map Legend Modal
  ↓
View pin color meanings
```

### 5. Analytics Flow
```
Analytics Page
  ↓
Select view (Top Locations / Resolved Cases)
  ↓
[Top Locations View]
  ↓
View statistics cards
  ↓
View top locations table
  ↓
[Resolved Cases View]
  ↓
Filter by date range
  ↓
Filter by category
  ↓
View resolved cases table
  ↓
Click "View Details" → Resolved Case Details Modal
  ↓
[Export]
  ↓
Click "Export" → Download data
```

### 6. Active Checkpoint Determination Flow
```
Checkpoint has timeStart and timeEnd
  ↓
Get current system time
  ↓
Check if current time is within timeStart and timeEnd
  ↓
Check if checkpoint status is 'active'
  ↓
Both true → Active (Blue pin)
  ↓
Otherwise → Inactive (Gray pin)
  ↓
Update every minute automatically
```

---

## Status System

### Report Statuses
- **Pending** (Yellow badge) - New report, not yet acknowledged
- **Acknowledged** (Blue badge) - Report received and confirmed
- **En Route** (Purple badge) - Police unit dispatched
- **Resolved** (Green badge) - Case closed successfully
- **Canceled** (Red badge) - Report canceled or false alarm

### Checkpoint Statuses
- **Active** (Blue pin) - Currently operational within operating hours
- **Inactive** (Gray pin) - Not operational or outside operating hours

---

## Color Coding System

### Report Pins (Map)
- 🔴 **Red** (#ef4444) - Crime Reports
- 🟠 **Orange** (#f97316) - Fire Reports
- 🟢 **Green** (#22c55e) - Medical Reports
- ⚫ **Gray** (#6b7280) - Other Reports

### Checkpoint Pins (Map)
- 🔵 **Blue** (#2563eb) - Active Checkpoints
- ⚫ **Gray** (#6b7280) - Inactive Checkpoints

### Filter Buttons
- 🔴 **Red** - Active Cases filter
- 🔵 **Blue** - Police Checkpoints filter
- 🟢 **Green** - Police Offices filter

---

## Time Format Standards

- **All time inputs**: Strict 24-hour (military) format (HH:MM)
- **Examples**: 08:00, 13:30, 23:59
- **No AM/PM indicators**
- **Validation**: Hours 00-23, Minutes 00-59
- **Display in detail box**: "Time: 06:00 - 22:00" or "Time: 24/7" (if 00:00-23:59)

---

## Real-time Updates

- **Dashboard**: Reports refresh every 5 seconds
- **Map**: Checkpoint status updates every 60 seconds
- **New Report Alerts**: Automatic notifications

---

## File Structure

```
crasb-police-side/
├── components/
│   ├── AddCheckpointModal.tsx
│   ├── DirectionsModal.tsx
│   ├── EditCheckpointModal.tsx
│   ├── MapLegendModal.tsx
│   ├── ReportDetailsModal.tsx
│   └── ResolvedCaseDetailsModal.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── map.tsx
│   └── analytics.tsx
├── styles/
│   └── globals.css
└── [config files]
```

---

## Key Features Summary

✅ **Authentication System** - Secure login with session management
✅ **Dashboard** - Real-time active reports overview
✅ **Live Map** - Interactive map with pins and checkpoints
✅ **Checkpoint Management** - Add, edit, delete checkpoints
✅ **Time-based Active Status** - Automatic active/inactive determination
✅ **Report Management** - View, update status, send messages
✅ **Analytics** - Data visualization and statistics
✅ **Navigation** - Google Maps integration
✅ **Legend System** - Pin color reference guide
✅ **Real-time Updates** - Automatic data refresh
✅ **24-Hour Time Format** - Military time enforcement

---

**Document Version**: 1.0
**Last Updated**: 2024
**Maintained By**: Development Team

