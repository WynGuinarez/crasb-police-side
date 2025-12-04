# API Integration Guide

This document provides a comprehensive guide for backend developers to integrate API endpoints into the police web application.

## Overview

All static/hard-coded data has been centralized into `lib/TemporaryDatabase.ts`. This file serves as a temporary local database that will be replaced with actual API calls.

## Data Centralization

### Temporary Database Location
- **File**: `lib/TemporaryDatabase.ts`
- **Purpose**: Contains all static data, mock data, and placeholder values
- **Usage**: All components reference this database instead of embedding data directly

### Data Collections in TemporaryDatabase

1. **activeReports**: Array of active report/case data
2. **checkpoints**: Array of police checkpoint data
3. **analytics**: Object containing:
   - `topLocations`: Top reporting locations
   - `resolvedCases`: Resolved case data
   - `categoryStats`: Statistics by category
   - `timeStats`: Statistics by time period
4. **chatConversations**: Chat message history keyed by reporter name
5. **policeStationLocation**: Default police station location
6. **reportStatuses**: Available report status options
7. **reportCategories**: Available report category options
8. **dateRangeOptions**: Date filter options
9. **checkpointStatuses**: Checkpoint status options
10. **checkpointFilters**: Checkpoint filter options
11. **analyticsViews**: Analytics view toggle options

## API Integration Points

All API integration points are marked with the following comment format:

```typescript
/*
 * TODO: API INTEGRATION POINT
 * ACTION: [Description of the action]
 * METHOD: [HTTP Method]
 * ENDPOINT: [API Endpoint path]
 */
```

## API Endpoints Required

### Reports API

#### 1. Get Active Reports
- **Location**: `pages/dashboard.tsx` (line ~62)
- **ACTION**: Fetch the list of all active cases
- **METHOD**: GET
- **ENDPOINT**: `/api/reports/active`
- **Response**: Array of Report objects matching the `Report` interface

#### 2. Update Report Status
- **Location**: `pages/dashboard.tsx` (line ~143), `pages/map.tsx` (line ~712), `components/ReportDetailsModal.tsx` (line ~62)
- **ACTION**: Update the status of a specific report
- **METHOD**: PATCH
- **ENDPOINT**: `/api/reports/:reportId/status`
- **Request Body**: `{ status: string }`
- **Response**: Updated Report object

#### 3. Update Report Distance/ETA
- **Location**: `pages/dashboard.tsx` (line ~151)
- **ACTION**: Update distance and ETA information for a specific report
- **METHOD**: PATCH
- **ENDPOINT**: `/api/reports/:reportId/distance-eta`
- **Request Body**: `{ distance: string, eta: string }`
- **Response**: Updated Report object

#### 4. Get Reports for Map
- **Location**: `pages/map.tsx` (line ~116)
- **ACTION**: Fetch all active reports for map display
- **METHOD**: GET
- **ENDPOINT**: `/api/reports/active`
- **Response**: Array of Report objects (filtered by status: pending, acknowledged, en-route)

#### 5. New Report Notifications
- **Location**: `pages/dashboard.tsx` (line ~78)
- **ACTION**: Listen for new report notifications/alerts
- **METHOD**: WebSocket or Server-Sent Events (SSE)
- **ENDPOINT**: `/api/reports/notifications` (WebSocket) or `/api/reports/stream` (SSE)
- **Note**: Replace polling mechanism with real-time connection

### Checkpoints API

#### 1. Get All Checkpoints
- **Location**: `pages/map.tsx` (line ~116)
- **ACTION**: Fetch all police checkpoints for map display
- **METHOD**: GET
- **ENDPOINT**: `/api/checkpoints`
- **Response**: Array of Checkpoint objects

#### 2. Create Checkpoint
- **Location**: `pages/map.tsx` (line ~248), `components/AddCheckpointModal.tsx` (line ~41)
- **ACTION**: Create a new police checkpoint
- **METHOD**: POST
- **ENDPOINT**: `/api/checkpoints`
- **Request Body**: Checkpoint object (without `id` field)
- **Response**: Created Checkpoint object with assigned `id`

#### 3. Update Checkpoint
- **Location**: `pages/map.tsx` (line ~258), `components/EditCheckpointModal.tsx` (line ~44)
- **ACTION**: Update an existing police checkpoint
- **METHOD**: PATCH
- **ENDPOINT**: `/api/checkpoints/:checkpointId`
- **Request Body**: Updated Checkpoint object
- **Response**: Updated Checkpoint object

#### 4. Delete Checkpoint
- **Location**: `pages/map.tsx` (line ~270), `components/EditCheckpointModal.tsx` (line ~92)
- **ACTION**: Delete a police checkpoint
- **METHOD**: DELETE
- **ENDPOINT**: `/api/checkpoints/:checkpointId`
- **Response**: Success confirmation

#### 5. Checkpoint Status Updates
- **Location**: `pages/map.tsx` (line ~154)
- **ACTION**: Poll for checkpoint status updates (active/inactive based on time)
- **METHOD**: GET (polling) or WebSocket/SSE (real-time)
- **ENDPOINT**: `/api/checkpoints/status-updates` (polling) or WebSocket connection
- **Note**: Consider replacing polling with WebSocket/SSE for real-time updates

### Analytics API

#### 1. Get Analytics Data
- **Location**: `pages/analytics.tsx` (line ~71)
- **ACTION**: Fetch analytics data including top locations, resolved cases, category stats, and time stats
- **METHOD**: GET
- **ENDPOINT**: `/api/analytics`
- **Query Parameters**:
  - `dateRange`: string (e.g., '7', '30', '90', '365')
  - `categoryFilter`: string (e.g., 'all', 'crime', 'fire', 'medical', 'traffic')
- **Response**: AnalyticsData object matching the `AnalyticsData` interface

#### 2. Export Analytics Data
- **Location**: `pages/analytics.tsx` (line ~222)
- **ACTION**: Export analytics data in a specified format (CSV, PDF, etc.)
- **METHOD**: GET
- **ENDPOINT**: `/api/analytics/export`
- **Query Parameters**:
  - `dateRange`: string
  - `categoryFilter`: string
  - `format`: string (e.g., 'csv', 'pdf', 'xlsx')
- **Response**: File download or URL to download the file

### Chat/Messages API

#### 1. Get Chat Messages
- **Location**: `components/ReportChatModal.tsx` (line ~77)
- **ACTION**: Fetch chat messages for a specific report
- **METHOD**: GET
- **ENDPOINT**: `/api/reports/:reportId/messages`
- **Response**: Array of ChatMessage objects

#### 2. Send Chat Message
- **Location**: `components/ReportChatModal.tsx` (line ~135), `components/ReportDetailsModal.tsx` (line ~69)
- **ACTION**: Send a new chat message for a specific report
- **METHOD**: POST
- **ENDPOINT**: `/api/reports/:reportId/messages`
- **Request Body**: `{ text: string, senderType: 'police' | 'sender' }`
- **Response**: Created ChatMessage object with assigned `id` and `timestamp`

### Police Station API

#### 1. Get Police Station Location
- **Location**: `components/DirectionsModal.tsx` (line ~55)
- **ACTION**: Fetch the police station location (user's assigned station)
- **METHOD**: GET
- **ENDPOINT**: `/api/police-station/location`
- **Response**: Object with `lat`, `lng`, and `address` properties

### Static Data API (Optional)

If any of the following data should be dynamic (fetched from backend), create corresponding endpoints:

#### 1. Report Status Options
- **Location**: `components/ReportDetailsModal.tsx` (line ~76)
- **Current**: Uses `TemporaryDatabase.reportStatuses`
- **If Dynamic**: GET `/api/reports/status-options`
- **Response**: Array of `{ value: string, label: string }`

#### 2. Report Categories
- **Location**: `pages/analytics.tsx` (line ~300)
- **Current**: Uses `TemporaryDatabase.reportCategories`
- **If Dynamic**: GET `/api/reports/categories`
- **Response**: Array of category strings

## TypeScript Interfaces

All data structures are defined in `lib/TemporaryDatabase.ts`. Key interfaces:

- `Report`: Report/case data structure
- `Checkpoint`: Police checkpoint data structure
- `ResolvedCase`: Resolved case data structure
- `ChatMessage`: Chat message data structure
- `TopLocation`: Top location statistics
- `CategoryStat`: Category statistics
- `TimeStat`: Time period statistics
- `AnalyticsData`: Complete analytics data structure

## Code Structure

### Component Pattern

All components follow this pattern:

```typescript
// 1. Import TemporaryDatabase
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

// 2. Use data from TemporaryDatabase
const data = TemporaryDatabase.collectionName

// 3. API integration comment marks where to replace
/*
 * TODO: API INTEGRATION POINT
 * ACTION: [Description]
 * METHOD: [HTTP Method]
 * ENDPOINT: [Endpoint]
 */
// TODO: Replace with API call
```

### Example Integration

**Before (using TemporaryDatabase):**
```typescript
const reports = TemporaryDatabase.activeReports
```

**After (with API):**
```typescript
const response = await fetch('/api/reports/active')
const reports = await response.json()
```

## Error Handling

When implementing API calls, ensure proper error handling:

```typescript
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  // Handle data
} catch (error) {
  console.error('API Error:', error)
  // Show user-friendly error message
  toast.error('Failed to load data. Please try again.')
}
```

## Authentication

All API calls should include authentication headers. The application uses `AuthContext` for user authentication. Include the auth token in API requests:

```typescript
const token = getAuthToken() // Get from AuthContext
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## Real-time Updates

Consider implementing WebSocket or Server-Sent Events for:
- New report notifications (Dashboard)
- Checkpoint status updates (Map)
- Real-time chat messages (ReportChatModal)

## Testing

When integrating APIs:
1. Replace `TemporaryDatabase` references with API calls
2. Test error handling (network failures, invalid responses)
3. Test loading states
4. Test authentication/authorization
5. Verify data format matches TypeScript interfaces

## Notes

- All API integration points are clearly marked with `TODO: API INTEGRATION POINT` comments
- The exact format of request/response should match the TypeScript interfaces
- Consider implementing request caching for frequently accessed data
- Implement proper loading states and error boundaries
- All static dropdown options are now in `TemporaryDatabase` for easy replacement

