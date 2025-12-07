# Backend Integration Guide

This document provides a comprehensive mapping of backend API endpoints to frontend integration points. Use this guide to integrate the Django REST API backend with the Next.js frontend.

## Table of Contents

1. [Authentication](#authentication)
2. [Reports](#reports)
3. [Checkpoints](#checkpoints)
4. [Messages](#messages)
5. [Analytics](#analytics)
6. [Resolved Cases](#resolved-cases)
7. [Map Data](#map-data)
8. [Media/Attachments](#mediaattachments)

---

## Authentication

### Login

**Frontend File**: `contexts/AuthContext.jsx` (line ~41)

**Backend Endpoint**: `POST /api/auth/login/`

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200)**:
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "admin" | "police",
    "office_id": "uuid" (optional)
  }
}
```

**Error (401)**:
```json
{
  "error": "Invalid credentials"
}
```

**Integration Notes**:
- Store token in `localStorage` as `'auth_token'`
- Store user object in `localStorage` as `'user_data'`
- Include token in Authorization header for all subsequent requests: `Bearer {token}`

---

## Reports

### Get Active Reports (Dashboard)

**Frontend File**: `pages/dashboard.jsx` (line ~38)

**Backend Endpoint**: `GET /api/reports/`

**Query Parameters**:
- `status__in`: Comma-separated list (e.g., `pending,acknowledged,en-route`)
- Example: `/api/reports/?status__in=pending,acknowledged,en-route`

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "reporterName": "string",
    "reporterPhone": "string",
    "category": "string",
    "status": "pending" | "acknowledged" | "en-route" | "resolved" | "canceled",
    "location": {
      "lat": 14.5995,
      "lng": 120.9842,
      "address": "string",
      "city": "string",
      "barangay": "string"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "description": "string",
    "attachments": ["url1", "url2"],
    "distance": "string" (optional),
    "eta": "string" (optional)
  }
]
```

### Update Report Status

**Frontend File**: `pages/dashboard.jsx` (line ~191), `components/ReportDetailsModal.jsx` (line ~39)

**Backend Endpoint**: `PATCH /api/reports/{report_id}/`

**Request Body**:
```json
{
  "status": "pending" | "acknowledged" | "en-route" | "resolved" | "canceled"
}
```

**Response (200)**: Full updated report object

### Get Single Report

**Frontend File**: `components/ReportDetailsModal.jsx`

**Backend Endpoint**: `GET /api/reports/{report_id}/`

**Response (200)**: Full report object

---

## Checkpoints

### Get All Checkpoints

**Frontend File**: `pages/map.jsx` (line ~72)

**Backend Endpoint**: `GET /api/checkpoints/`

**Query Parameters** (Optional):
- `status`: Filter by status (e.g., `active`, `inactive`)
- Example: `/api/checkpoints/?status=active`

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "location": {
      "lat": 14.5995,
      "lng": 120.9842,
      "address": "string"
    },
    "assignedOfficers": ["string"],
    "schedule": "string",
    "timeStart": "08:00",
    "timeEnd": "20:00",
    "status": "active" | "inactive",
    "contactNumber": "string"
  }
]
```

### Create Checkpoint

**Frontend File**: `components/AddCheckpointModal.jsx` (line ~31)

**Backend Endpoint**: `POST /api/checkpoints/`

**Request Body**:
```json
{
  "name": "string",
  "location": {
    "lat": 14.5995,
    "lng": 120.9842,
    "address": "string"
  },
  "assignedOfficers": ["string"],
  "schedule": "string",
  "timeStart": "08:00",
  "timeEnd": "20:00",
  "status": "active",
  "contactNumber": "string"
}
```

**Response (201)**: Created checkpoint object with assigned `id`

### Update Checkpoint

**Frontend File**: `components/EditCheckpointModal.jsx` (line ~31)

**Backend Endpoint**: `PATCH /api/checkpoints/{checkpoint_id}/`

**Request Body**: Same as create, but only include fields to update

**Response (200)**: Updated checkpoint object

### Delete Checkpoint

**Frontend File**: `components/EditCheckpointModal.jsx` (line ~93)

**Backend Endpoint**: `DELETE /api/checkpoints/{checkpoint_id}/`

**Response (204)**: No content

---

## Messages

### Get Messages for Report

**Frontend File**: `components/ReportChatModal.jsx` (line ~28)

**Backend Endpoint**: `GET /api/reports/{report_id}/messages/`

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "text": "string",
    "timestamp": "2024-01-01T12:00:00Z",
    "senderType": "police" | "reporter",
    "senderName": "string" (optional)
  }
]
```

### Send Message

**Frontend File**: `components/ReportChatModal.jsx` (line ~88), `components/ReportDetailsModal.jsx` (line ~59)

**Backend Endpoint**: `POST /api/reports/{report_id}/messages/`

**Request Body**:
```json
{
  "text": "string",
  "senderType": "police"
}
```

**Response (201)**: Created message object

---

## Analytics

### Get Analytics Overview Summary

**Frontend File**: `pages/analytics.jsx` (line ~32)

**Backend Endpoint**: `GET /api/analytics/summary/overview/`

**Query Parameters**:
- `days`: Number of days (default: 30)
- `scope`: `our_office` | `all`
- `office_id`: UUID (required if scope=our_office)
- `city`: City name (optional)
- `barangay`: Barangay name (optional, requires city)
- `category`: Category name (optional)

**Example**: `/api/analytics/summary/overview/?days=30&scope=our_office&office_id=abc123`

**Response (200)**:
```json
{
  "totalReports": 150,
  "resolvedReports": 120,
  "averageResolutionTime": "2.5 hours",
  "pendingReports": 30
}
```

### Get Location Hotspots

**Frontend File**: `pages/analytics.jsx`

**Backend Endpoint**: `GET /api/analytics/hotspots/locations/`

**Query Parameters**: Same as overview summary

**Response (200)**:
```json
[
  {
    "location": "string",
    "city": "string",
    "barangay": "string",
    "reportCount": 25,
    "lat": 14.5995,
    "lng": 120.9842
  }
]
```

### Get Category Concentration

**Frontend File**: `pages/analytics.jsx`

**Backend Endpoint**: `GET /api/analytics/hotspots/categories/`

**Query Parameters**: Same as overview summary

**Response (200)**:
```json
[
  {
    "category": "string",
    "count": 45,
    "percentage": 30.0
  }
]
```

### Export Analytics

**Frontend File**: `pages/analytics.jsx`

**Backend Endpoint**: `GET /api/analytics/export/`

**Query Parameters**: Same as overview summary

**Response (200)**: PDF file (binary)

**Integration Notes**:
- Set response type to `'blob'`
- Create download link from blob
- Trigger download programmatically

---

## Resolved Cases

### Get Resolved Cases

**Frontend File**: `pages/resolved-cases.jsx` (line ~32)

**Backend Endpoint**: `GET /api/reports/resolved/`

**Query Parameters**:
- `days`: Number of days (default: 30)
- `scope`: `our_office` | `all`
- `office_id`: UUID (required if scope=our_office)
- `city`: City name (optional)
- `barangay`: Barangay name (optional, requires city)
- `category`: Category name (optional)

**Example**: `/api/reports/resolved/?days=30&scope=our_office&office_id=abc123&category=Robbery`

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "reporterName": "string",
    "category": "string",
    "status": "resolved",
    "location": {
      "city": "string",
      "barangay": "string",
      "address": "string"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "resolvedAt": "2024-01-01T14:30:00Z",
    "resolutionTime": "2.5 hours"
  }
]
```

### Export Resolved Cases

**Frontend File**: `pages/resolved-cases.jsx`

**Backend Endpoint**: `GET /api/reports/resolved/export/`

**Query Parameters**: Same as get resolved cases

**Response (200)**: PDF file (binary)

### Export Single Report

**Frontend File**: `pages/resolved-cases.jsx`, `components/ResolvedCaseDetailsModal.jsx`

**Backend Endpoint**: `GET /api/reports/{report_id}/export/`

**Response (200)**: PDF file (binary)

---

## Map Data

### Get Map Data (Reports + Checkpoints + Offices)

**Frontend File**: `pages/map.jsx`

**Backend Endpoint**: `GET /api/admin/map/data/`

**Response (200)**:
```json
{
  "reports": [...],  // Active reports array
  "checkpoints": [...],  // All checkpoints array
  "offices": [...]  // Police offices array
}
```

**Integration Notes**:
- This endpoint provides all data needed for the map in a single request
- More efficient than making separate requests for reports and checkpoints
- Use this instead of separate GET /reports/ and GET /checkpoints/ calls

---

## Media/Attachments

### Get Media File

**Frontend File**: `components/ReportDetailsModal.jsx`

**Backend Endpoint**: `GET /api/media/{media_id}/`

**Response (200)**: File binary or redirect to file URL

**Integration Notes**:
- Media URLs in report objects should point to this endpoint
- Format: `${process.env.NEXT_PUBLIC_API_URL}/media/{media_id}/`
- Handle image, video, and document file types

---

## Common Integration Patterns

### Authentication Header

All authenticated requests must include:
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json'
}
```

### Error Handling

```javascript
if (response.status === 401) {
  // Token expired - redirect to login
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  router.push('/login')
} else if (response.status >= 400) {
  // Show error message
  const error = await response.json()
  toast.error(error.message || 'An error occurred')
}
```

### Environment Variables

Use `process.env.NEXT_PUBLIC_API_URL` for the base API URL:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

### Query Parameter Building

```javascript
const params = new URLSearchParams()
if (days) params.append('days', days)
if (scope) params.append('scope', scope)
if (office_id) params.append('office_id', office_id)
if (city) params.append('city', city)
if (barangay) params.append('barangay', barangay)
if (category) params.append('category', category)

const url = `${API_URL}/analytics/summary/overview/?${params.toString()}`
```

---

## Integration Checklist

- [ ] Replace all `TemporaryDatabase` calls with API calls
- [ ] Add authentication headers to all requests
- [ ] Implement error handling for 401 (unauthorized)
- [ ] Update environment variable `NEXT_PUBLIC_API_URL`
- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Implement file download for PDF exports
- [ ] Add loading states for all API calls
- [ ] Handle network errors gracefully
- [ ] Update state management after successful API calls
- [ ] Remove all mock data references

---

## Next Steps

1. Start with authentication integration
2. Then integrate reports (read operations first)
3. Add checkpoint management
4. Integrate messages
5. Add analytics endpoints
6. Finally, add export functionality

For detailed code examples, see the comments in each frontend file marked with `BACKEND INTEGRATION` sections.

