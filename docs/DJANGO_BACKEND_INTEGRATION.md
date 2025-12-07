# Django Backend Integration Guide

This guide will help you integrate your Django REST API backend with the Next.js frontend application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Django Backend Setup](#django-backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Environment Configuration](#environment-configuration)
5. [CORS Configuration](#cors-configuration)
6. [HTTP Client Setup](#http-client-setup)
7. [Authentication Integration](#authentication-integration)
8. [API Integration Steps](#api-integration-steps)
9. [Testing the Integration](#testing-the-integration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Backend Requirements
- Django 3.2+ or Django 4.x
- Django REST Framework (DRF)
- `django-cors-headers` package
- JWT authentication (or your preferred auth method)

### Frontend Requirements
- Node.js 18+
- Next.js 14
- Axios (we'll install this)

---

## Django Backend Setup

### Step 1: Install Required Packages

In your Django project, install the CORS headers package:

```bash
pip install django-cors-headers
```

Add to your `requirements.txt`:
```
django-cors-headers>=4.0.0
```

### Step 2: Configure Django Settings

In your Django `settings.py` file:

#### 2.1 Add CORS Headers to INSTALLED_APPS

```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
    # ... rest of apps
]
```

#### 2.2 Add CORS Middleware

**IMPORTANT**: The CORS middleware must be placed **before** CommonMiddleware:

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Add this line - MUST be before CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]
```

#### 2.3 Configure CORS Settings

Add these settings to your `settings.py`:

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
    # Add your production frontend URL when deploying:
    # "https://your-frontend-domain.com",
]

# Allow credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Allowed headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allowed methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# For development only - allows all origins (NOT for production!)
# CORS_ALLOW_ALL_ORIGINS = True  # Uncomment only for local development
```

#### 2.4 Configure REST Framework Settings (if using DRF)

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',  # If using token auth
        # Or JWT if you're using djangorestframework-simplejwt:
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
}
```

### Step 3: Update Your URLs

Make sure your Django `urls.py` includes the API routes. Based on your provided `urls.py`, your API should be accessible at:

```
http://localhost:8000/api/
```

Verify your main `urls.py` includes the API app:

```python
# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('your_api_app.urls')),  # Your API app
]
```

---

## Frontend Setup

### Step 1: Install Axios

In the frontend project directory:

```bash
cd crasb-police-side
npm install axios
```

### Step 2: Create API Client Utility

Create a new file `lib/apiClient.js`:

```javascript
import axios from 'axios'

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      // Redirect to login (only if we're in the browser)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     error.response.data?.detail ||
                     'An error occurred'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'))
    } else {
      // Something else happened
      return Promise.reject(error)
    }
  }
)

export default apiClient
```

### Step 3: Create API Service Functions

Create a new file `lib/apiServices.js`:

```javascript
import apiClient from './apiClient'

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authAPI = {
  /**
   * Login user
   * @param {string} username
   * @param {string} password
   * @returns {Promise} Response with token and user data
   */
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login/', {
      username,
      password,
    })
    return response.data
  },
}

// ============================================================================
// REPORTS API
// ============================================================================

export const reportsAPI = {
  /**
   * Get all active reports
   * @param {object} params - Query parameters (status, etc.)
   * @returns {Promise} Array of reports
   */
  getActiveReports: async (params = {}) => {
    const response = await apiClient.get('/reports/', { params })
    return response.data
  },

  /**
   * Get single report by ID
   * @param {string} reportId - Report UUID
   * @returns {Promise} Report object
   */
  getReport: async (reportId) => {
    const response = await apiClient.get(`/reports/${reportId}/`)
    return response.data
  },

  /**
   * Update report status
   * @param {string} reportId - Report UUID
   * @param {string} status - New status
   * @returns {Promise} Updated report object
   */
  updateReportStatus: async (reportId, status) => {
    const response = await apiClient.patch(`/reports/${reportId}/`, {
      status,
    })
    return response.data
  },

  /**
   * Get resolved cases
   * @param {object} params - Query parameters (days, scope, office_id, city, barangay, category)
   * @returns {Promise} Array of resolved cases
   */
  getResolvedCases: async (params = {}) => {
    const response = await apiClient.get('/reports/resolved/', { params })
    return response.data
  },

  /**
   * Export single report as PDF
   * @param {string} reportId - Report UUID
   * @returns {Promise} Blob of PDF file
   */
  exportReport: async (reportId) => {
    const response = await apiClient.get(`/reports/${reportId}/export/`, {
      responseType: 'blob', // Important for binary files
    })
    return response.data
  },

  /**
   * Export resolved cases as PDF
   * @param {object} params - Query parameters
   * @returns {Promise} Blob of PDF file
   */
  exportResolvedCases: async (params = {}) => {
    const response = await apiClient.get('/reports/resolved/export/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },
}

// ============================================================================
// MESSAGES API
// ============================================================================

export const messagesAPI = {
  /**
   * Get messages for a report
   * @param {string} reportId - Report UUID
   * @returns {Promise} Array of messages
   */
  getMessages: async (reportId) => {
    const response = await apiClient.get(`/reports/${reportId}/messages/`)
    return response.data
  },

  /**
   * Send a message to reporter
   * @param {string} reportId - Report UUID
   * @param {string} text - Message text
   * @returns {Promise} Created message object
   */
  sendMessage: async (reportId, text) => {
    const response = await apiClient.post(`/reports/${reportId}/messages/`, {
      text,
      senderType: 'police',
    })
    return response.data
  },
}

// ============================================================================
// CHECKPOINTS API
// ============================================================================

export const checkpointsAPI = {
  /**
   * Get all checkpoints
   * @param {object} params - Query parameters (status, etc.)
   * @returns {Promise} Array of checkpoints
   */
  getCheckpoints: async (params = {}) => {
    const response = await apiClient.get('/checkpoints/', { params })
    return response.data
  },

  /**
   * Create new checkpoint
   * @param {object} checkpointData - Checkpoint data
   * @returns {Promise} Created checkpoint object
   */
  createCheckpoint: async (checkpointData) => {
    const response = await apiClient.post('/checkpoints/', checkpointData)
    return response.data
  },

  /**
   * Update checkpoint
   * @param {string} checkpointId - Checkpoint UUID
   * @param {object} checkpointData - Updated checkpoint data
   * @returns {Promise} Updated checkpoint object
   */
  updateCheckpoint: async (checkpointId, checkpointData) => {
    const response = await apiClient.patch(`/checkpoints/${checkpointId}/`, checkpointData)
    return response.data
  },

  /**
   * Delete checkpoint
   * @param {string} checkpointId - Checkpoint UUID
   * @returns {Promise} Empty response
   */
  deleteCheckpoint: async (checkpointId) => {
    const response = await apiClient.delete(`/checkpoints/${checkpointId}/`)
    return response.data
  },
}

// ============================================================================
// ANALYTICS API
// ============================================================================

export const analyticsAPI = {
  /**
   * Get analytics overview summary
   * @param {object} params - Query parameters (days, scope, office_id, city, barangay, category)
   * @returns {Promise} Overview summary object
   */
  getOverview: async (params = {}) => {
    const response = await apiClient.get('/analytics/summary/overview/', { params })
    return response.data
  },

  /**
   * Get location hotspots
   * @param {object} params - Query parameters
   * @returns {Promise} Array of location hotspots
   */
  getLocationHotspots: async (params = {}) => {
    const response = await apiClient.get('/analytics/hotspots/locations/', { params })
    return response.data
  },

  /**
   * Get category concentration
   * @param {object} params - Query parameters
   * @returns {Promise} Array of category statistics
   */
  getCategoryConcentration: async (params = {}) => {
    const response = await apiClient.get('/analytics/hotspots/categories/', { params })
    return response.data
  },

  /**
   * Export analytics as PDF
   * @param {object} params - Query parameters
   * @returns {Promise} Blob of PDF file
   */
  exportAnalytics: async (params = {}) => {
    const response = await apiClient.get('/analytics/export/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },
}

// ============================================================================
// MAP DATA API
// ============================================================================

export const mapAPI = {
  /**
   * Get all map data (reports, checkpoints, offices)
   * @returns {Promise} Object with reports, checkpoints, and offices arrays
   */
  getMapData: async () => {
    const response = await apiClient.get('/admin/map/data/')
    return response.data
  },
}
```

---

## Environment Configuration

### Frontend Environment Variables

Update your `.env.local` file in the frontend:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Google Maps (if using)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# App Configuration
NEXT_PUBLIC_APP_ID=crash-police-app
```

**Important**: 
- `NEXT_PUBLIC_` prefix is required for Next.js to expose variables to the browser
- Restart your Next.js dev server after changing environment variables

### Django Environment Variables (Optional)

If you need to configure CORS origins dynamically, you can use environment variables in Django:

```python
# settings.py
import os

CORS_ALLOWED_ORIGINS = [
    os.getenv('FRONTEND_URL', 'http://localhost:3000'),
]
```

---

## CORS Configuration

### Development Setup

For local development, you can temporarily allow all origins (NOT for production):

```python
# settings.py - DEVELOPMENT ONLY
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
```

### Production Setup

For production, specify exact origins:

```python
# settings.py - PRODUCTION
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    "https://www.your-frontend-domain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

### Testing CORS

Test CORS configuration:

```bash
# In your terminal
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization" \
     -X OPTIONS \
     http://localhost:8000/api/reports/
```

You should see CORS headers in the response.

---

## HTTP Client Setup

We're using **Axios** for HTTP requests. Axios provides:

- ✅ Automatic JSON parsing
- ✅ Request/response interceptors
- ✅ Better error handling
- ✅ Request cancellation
- ✅ Automatic request/response transformation

### Why Axios over Fetch?

- **Interceptors**: Automatically add auth tokens to all requests
- **Error Handling**: Better error handling with interceptors
- **Request/Response Transformation**: Automatic JSON parsing
- **Timeout Support**: Built-in timeout configuration
- **Request Cancellation**: Can cancel requests if needed

---

## Authentication Integration

### Step 1: Update AuthContext

Update `contexts/AuthContext.jsx` to use the API:

```javascript
import { authAPI } from '../lib/apiServices'

// In the login function:
const login = async (username, password) => {
  try {
    setLoading(true)
    
    // Call backend API
    const data = await authAPI.login(username, password)
    
    // Store token and user data
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user_data', JSON.stringify(data.user))
    setUser(data.user)
    
    return true
  } catch (error) {
    console.error('Login failed:', error)
    return false
  } finally {
    setLoading(false)
  }
}
```

### Step 2: Backend Login Endpoint Response Format

Your Django `LoginAPIView` should return:

```python
# views.py
from rest_framework.response import Response
from rest_framework import status

class LoginAPIView(APIView):
    def post(self, request):
        # Your authentication logic here
        # ...
        
        # Return response in this format:
        return Response({
            'token': 'jwt_token_string',  # or your token format
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'firstName': user.first_name,  # or your field name
                'lastName': user.last_name,    # or your field name
                'role': user.role,              # or your role field
                'office_id': str(user.office.id) if hasattr(user, 'office') else None,
            }
        }, status=status.HTTP_200_OK)
```

---

## API Integration Steps

### Step 1: Replace TemporaryDatabase Calls

Find all instances of `TemporaryDatabase` in your code and replace with API calls.

**Example - Dashboard (pages/dashboard.jsx):**

```javascript
// OLD CODE:
import { TemporaryDatabase } from '../lib/TemporaryDatabase'
const activeReports = TemporaryDatabase.activeReports

// NEW CODE:
import { reportsAPI } from '../lib/apiServices'

useEffect(() => {
  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await reportsAPI.getActiveReports({
        status__in: 'pending,acknowledged,en-route'
      })
      setReports(data)
    } catch (error) {
      toast.error('Failed to load reports')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchReports()
}, [])
```

### Step 2: Handle PDF Exports

For PDF export endpoints, handle blob responses:

```javascript
import { reportsAPI } from '../lib/apiServices'

const handleExportCase = async (caseId) => {
  try {
    const blob = await reportsAPI.exportReport(caseId)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `case-${caseId}.pdf`
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success('Case report exported successfully')
  } catch (error) {
    toast.error('Failed to export case report')
    console.error(error)
  }
}
```

### Step 3: Update All Integration Points

Follow the comments in each file marked with `BACKEND INTEGRATION` to replace mock data with API calls. See `BACKEND_INTEGRATION_GUIDE.md` for detailed endpoint mappings.

---

## Testing the Integration

### Step 1: Start Both Servers

**Terminal 1 - Django Backend:**
```bash
cd your-django-project
python manage.py runserver
# Server runs on http://localhost:8000
```

**Terminal 2 - Next.js Frontend:**
```bash
cd crasb-police-side
npm run dev
# Server runs on http://localhost:3000
```

### Step 2: Test Authentication

1. Open http://localhost:3000/login
2. Enter credentials
3. Check browser Network tab (F12) for API call to `/api/auth/login/`
4. Verify token is stored in localStorage

### Step 3: Test API Calls

1. After login, check Network tab for API calls
2. Verify requests include `Authorization: Bearer <token>` header
3. Check responses match expected format

### Step 4: Test CORS

If you see CORS errors in browser console:

1. Check Django CORS settings
2. Verify `CorsMiddleware` is before `CommonMiddleware`
3. Check `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`
4. Restart Django server after changing settings

---

## Troubleshooting

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
1. Verify `django-cors-headers` is installed: `pip list | grep cors`
2. Check `CorsMiddleware` is in `MIDDLEWARE` before `CommonMiddleware`
3. Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
4. Check `CORS_ALLOW_CREDENTIALS = True` if using cookies
5. Restart Django server after changes

### 401 Unauthorized Errors

**Error**: `401 Unauthorized` on API calls

**Solutions**:
1. Check token is being sent: Look for `Authorization` header in Network tab
2. Verify token format matches backend expectations (Bearer token)
3. Check token hasn't expired
4. Verify backend authentication is working: Test with Postman/curl

### Network Errors

**Error**: `Network Error` or `Failed to fetch`

**Solutions**:
1. Verify Django server is running on correct port
2. Check `NEXT_PUBLIC_API_URL` in `.env.local` matches Django URL
3. Verify no firewall blocking requests
4. Check Django `ALLOWED_HOSTS` includes `localhost`

### 404 Not Found Errors

**Error**: `404 Not Found` on API endpoints

**Solutions**:
1. Verify API URL structure matches your Django `urls.py`
2. Check endpoint paths in `apiServices.js` match backend routes
3. Verify Django URL routing is correct
4. Test endpoints directly with Postman/curl

### Response Format Mismatches

**Error**: Data structure doesn't match frontend expectations

**Solutions**:
1. Check backend response format matches frontend expectations
2. Use browser Network tab to inspect actual API responses
3. Update frontend code to match backend response structure
4. Or update backend serializers to match frontend expectations

---

## Quick Reference

### Django CORS Settings Checklist

- [ ] `django-cors-headers` installed
- [ ] `corsheaders` in `INSTALLED_APPS`
- [ ] `CorsMiddleware` in `MIDDLEWARE` (before CommonMiddleware)
- [ ] `CORS_ALLOWED_ORIGINS` includes frontend URL
- [ ] `CORS_ALLOW_CREDENTIALS = True`
- [ ] `CORS_ALLOW_HEADERS` includes 'authorization'
- [ ] Django server restarted after changes

### Frontend Setup Checklist

- [ ] Axios installed: `npm install axios`
- [ ] `lib/apiClient.js` created
- [ ] `lib/apiServices.js` created
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL`
- [ ] AuthContext updated to use API
- [ ] All `TemporaryDatabase` calls replaced with API calls
- [ ] Next.js dev server restarted after changes

### Testing Checklist

- [ ] Django server running on port 8000
- [ ] Next.js server running on port 3000
- [ ] Can login successfully
- [ ] Token stored in localStorage
- [ ] API calls include Authorization header
- [ ] No CORS errors in console
- [ ] Data loads correctly from backend
- [ ] CRUD operations work (Create, Read, Update, Delete)

---

## Next Steps

1. **Start with Authentication**: Get login working first
2. **Test Data Fetching**: Verify GET requests work
3. **Test Data Updates**: Verify PATCH/PUT requests work
4. **Test Data Creation**: Verify POST requests work
5. **Test Data Deletion**: Verify DELETE requests work
6. **Handle Errors**: Add proper error handling and user feedback
7. **Add Loading States**: Show loading indicators during API calls
8. **Optimize**: Add request caching, pagination, etc.

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Django server logs
3. Use browser Network tab to inspect API requests/responses
4. Test endpoints directly with Postman or curl
5. Verify all configuration steps were completed

For detailed endpoint mappings, see [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)

