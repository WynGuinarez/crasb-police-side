import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle,
  Home,
  Info,
  LogOut,
  Map,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import AddCheckpointModal from '../components/AddCheckpointModal'
import EditCheckpointModal from '../components/EditCheckpointModal'
import ReportDetailsModal from '../components/ReportDetailsModal'
import MapLegendModal from '../components/MapLegendModal'
import { useAuth } from '../contexts/AuthContext'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDH2oAs9HoUj5BueJRfrAfeZiSkhmMWCok'

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

// Metro Manila center coordinates
const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842
}

// Default zoom level for Metro Manila
const defaultZoom = 12

const LiveMap = () => {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('map')
  const [checkpoints, setCheckpoints] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false)
  const [showEditCheckpoint, setShowEditCheckpoint] = useState(false)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReportForModal, setSelectedReportForModal] = useState(null)
  const [showLegendModal, setShowLegendModal] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    activeCases: true,
    policeCheckpoint: true,
    policeOffices: true
  })
  const [checkpointFilter, setCheckpointFilter] = useState('all')
  const [selectedPin, setSelectedPin] = useState(null)

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Fetch Map Data (Reports + Checkpoints + Offices)
   * ============================================================================
   * 
   * RECOMMENDED APPROACH: Use the combined map data endpoint for efficiency
   * 
   * BACKEND ENDPOINT: GET /api/admin/map/data/
   * 
   * This endpoint returns all data needed for the map in a single request:
   * - Active reports (pending, acknowledged, en-route)
   * - All checkpoints
   * - Police offices
   * 
   * AUTHENTICATION:
   * - Include JWT token in Authorization header: "Bearer {token}"
   * 
   * EXPECTED RESPONSE (200):
   * {
   *   "reports": [
   *     {
   *       "id": "uuid",
   *       "status": "pending" | "acknowledged" | "en-route",
   *       "location": { "lat": number, "lng": number, "address": "string" },
   *       ... (full report object)
   *     }
   *   ],
   *   "checkpoints": [
   *     {
   *       "id": "uuid",
   *       "name": "string",
   *       "location": { "lat": number, "lng": number, "address": "string" },
   *       "status": "active" | "inactive",
   *       ... (full checkpoint object)
   *     }
   *   ],
   *   "offices": [
   *     {
   *       "id": "uuid",
   *       "name": "string",
   *       "location": { "lat": number, "lng": number, "address": "string" },
   *       ... (full office object)
   *     }
   *   ]
   * }
   * 
   * ALTERNATIVE APPROACH (if combined endpoint not available):
   * Make two separate requests:
   * 1. GET /api/reports/?status__in=pending,acknowledged,en-route
   * 2. GET /api/checkpoints/
   * 
   * INTEGRATION STEPS:
   * 1. Get auth token from localStorage
   * 2. Make GET request to: ${process.env.NEXT_PUBLIC_API_URL}/admin/map/data/
   * 3. Include Authorization header
   * 4. Parse response and set reports, checkpoints, and offices states
   * 5. Handle errors (401 = unauthorized)
   * 6. Set loading to false after request completes
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/admin/map/data/`,
   *   {
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   }
   * )
   * if (response.ok) {
   *   const data = await response.json()
   *   setReports(data.reports || [])
   *   setCheckpoints(data.checkpoints || [])
   *   // Optionally handle offices: setOffices(data.offices || [])
   * } else if (response.status === 401) {
   *   router.push('/login')
   * }
   * setLoading(false)
   * ============================================================================
   */
  useEffect(() => {
    // TODO: REPLACE WITH BACKEND API CALL
    // BACKEND ENDPOINT: GET /api/admin/map/data/ (RECOMMENDED)
    // OR use separate endpoints: GET /api/reports/ and GET /api/checkpoints/
    // See detailed comments above for integration guide
    
    // Load data from temporary database (to be replaced with API calls)
    const checkpoints = TemporaryDatabase.checkpoints
    const reports = TemporaryDatabase.activeReports.filter(r => 
      r.status === 'pending' || r.status === 'acknowledged' || r.status === 'en-route'
    )
    
    setCheckpoints(checkpoints)
    setReports(reports)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Poll for checkpoint status updates (active/inactive based on time).
   * METHOD: GET (polling) or WebSocket/SSE (real-time)
   * ENDPOINT: /api/checkpoints/status-updates (polling) or WebSocket connection
   * 
   * This polling can be replaced with WebSocket or Server-Sent Events for real-time updates.
   * Alternatively, the backend can calculate active/inactive status on-the-fly when fetching checkpoints.
   */
  // Refresh checkpoint status every minute to update active/inactive status
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Replace with API call or WebSocket: GET /api/checkpoints/status-updates
      // Force re-render by updating state (checkpoints array reference stays same, but component will re-render)
      setCheckpoints(prev => [...prev])
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Navigation handled by Link components for faster transitions
  }

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Create New Checkpoint
   * ============================================================================
   * 
   * BACKEND ENDPOINT: POST /api/checkpoints/
   * 
   * REQUEST BODY:
   * {
   *   "name": "string",
   *   "location": {
   *     "lat": number,
   *     "lng": number,
   *     "address": "string"
   *   },
   *   "assignedOfficers": ["string"],
   *   "schedule": "string",
   *   "timeStart": "08:00",
   *   "timeEnd": "20:00",
   *   "status": "active",
   *   "contactNumber": "string"
   * }
   * 
   * EXPECTED RESPONSE (201):
   * {
   *   "id": "uuid",  // Backend will assign this
   *   ... (full checkpoint object with assigned id)
   * }
   * 
   * INTEGRATION STEPS:
   * 1. Get auth token from localStorage
   * 2. Make POST request to: ${process.env.NEXT_PUBLIC_API_URL}/checkpoints/
   * 3. Include Authorization header and Content-Type: application/json
   * 4. Send checkpoint data (without id) in request body
   * 5. On success, add returned checkpoint (with id) to local state
   * 6. Show success toast notification
   * 7. Handle errors (401 = unauthorized, 400 = validation error)
   * ============================================================================
   */
  const handleAddCheckpoint = (checkpoint) => {
    // TODO: REPLACE WITH BACKEND API CALL
    // BACKEND ENDPOINT: POST /api/checkpoints/
    // See detailed comments above for integration guide
    
    // Temporary: Add to local state (to be replaced with API call)
    const newCheckpoint = {
      ...checkpoint,
      id: Date.now().toString()
    }
    setCheckpoints(prev => [...prev, newCheckpoint])
    toast.success('Checkpoint added successfully')
    setShowAddCheckpoint(false)
  }

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Update an existing police checkpoint.
   * METHOD: PATCH
   * ENDPOINT: /api/checkpoints/:checkpointId
   * 
   * Replace the local state update with an API call here.
   * The API should accept the updated checkpoint data in the request body.
   */
  /*
   * ============================================================================
   * BACKEND INTEGRATION: Update Existing Checkpoint
   * ============================================================================
   * 
   * BACKEND ENDPOINT: PATCH /api/checkpoints/{checkpoint_id}/
   * 
   * REQUEST BODY (only include fields to update):
   * {
   *   "name": "string" (optional),
   *   "location": { "lat": number, "lng": number, "address": "string" } (optional),
   *   "assignedOfficers": ["string"] (optional),
   *   "schedule": "string" (optional),
   *   "timeStart": "08:00" (optional),
   *   "timeEnd": "20:00" (optional),
   *   "status": "active" | "inactive" (optional),
   *   "contactNumber": "string" (optional)
   * }
   * 
   * EXPECTED RESPONSE (200):
   * {
   *   ... (full updated checkpoint object)
   * }
   * 
   * INTEGRATION STEPS:
   * 1. Get auth token from localStorage
   * 2. Make PATCH request to: ${process.env.NEXT_PUBLIC_API_URL}/checkpoints/${checkpoint.id}/
   * 3. Include Authorization header and Content-Type: application/json
   * 4. Send updated fields in request body
   * 5. On success, update local state with response data
   * 6. Show success toast notification
   * 7. Handle errors (401 = unauthorized, 400 = validation error, 404 = not found)
   * ============================================================================
   */
  const handleEditCheckpoint = (updatedCheckpoint) => {
    // TODO: REPLACE WITH BACKEND API CALL
    // BACKEND ENDPOINT: PATCH /api/checkpoints/{checkpoint_id}/
    // See detailed comments above for integration guide
    
    // Temporary: Update local state (to be replaced with API call)
    // TODO: Replace with API call: PATCH /api/checkpoints/${updatedCheckpoint.id}
    setCheckpoints(prev => prev.map(checkpoint => 
      checkpoint.id === updatedCheckpoint.id ? updatedCheckpoint : checkpoint
    ))
    // Reset filter to 'all' when updating a checkpoint so it remains visible
    // This ensures inactive checkpoints don't disappear when updated
    setCheckpointFilter('all')
    toast.success('Checkpoint updated successfully')
    setShowEditCheckpoint(false)
    setSelectedCheckpoint(null)
  }

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Delete a police checkpoint.
   * METHOD: DELETE
   * ENDPOINT: /api/checkpoints/:checkpointId
   * 
   * Replace the local state update with an API call here.
   */
  /*
   * ============================================================================
   * BACKEND INTEGRATION: Delete Checkpoint
   * ============================================================================
   * 
   * BACKEND ENDPOINT: DELETE /api/checkpoints/{checkpoint_id}/
   * 
   * EXPECTED RESPONSE (204): No content
   * 
   * INTEGRATION STEPS:
   * 1. Get auth token from localStorage
   * 2. Make DELETE request to: ${process.env.NEXT_PUBLIC_API_URL}/checkpoints/${checkpointId}/
   * 3. Include Authorization header
   * 4. On success (204), remove checkpoint from local state
   * 5. Show success toast notification
   * 6. Handle errors (401 = unauthorized, 404 = not found)
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/checkpoints/${checkpointId}/`,
   *   {
   *     method: 'DELETE',
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   }
   * )
   * if (response.ok || response.status === 204) {
   *   setCheckpoints(prev => prev.filter(cp => cp.id !== checkpointId))
   *   toast.success('Checkpoint deleted successfully')
   * } else {
   *   toast.error('Failed to delete checkpoint')
   * }
   * ============================================================================
   */
  const handleDeleteCheckpoint = (checkpointId) => {
    // TODO: REPLACE WITH BACKEND API CALL
    // BACKEND ENDPOINT: DELETE /api/checkpoints/{checkpoint_id}/
    // See detailed comments above for integration guide
    
    // Temporary: Remove from local state (to be replaced with API call)
    // TODO: Replace with API call: DELETE /api/checkpoints/${checkpointId}
    setCheckpoints(prev => prev.filter(checkpoint => checkpoint.id !== checkpointId))
    toast.success('Checkpoint deleted successfully')
  }

  const handleEditCheckpointClick = (checkpoint) => {
    setSelectedCheckpoint(checkpoint)
    setShowEditCheckpoint(true)
  }

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'crime':
        return <AlertTriangle className="h-4 w-4 text-danger-500" />
      case 'fire':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medical':
        return <AlertTriangle className="h-4 w-4 text-success-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-status-pending-700'
      case 'acknowledged':
        return 'text-status-acknowledged-700'
      case 'en-route':
        return 'text-status-enroute-700'
      case 'resolved':
        return 'text-status-resolved-700'
      case 'canceled':
        return 'text-status-canceled-700'
      default:
        return 'text-gray-500'
    }
  }

  // Function to determine if a checkpoint is currently active based on status and time
  const isCheckpointCurrentlyActive = (checkpoint) => {
    // First check if the checkpoint status is 'inactive' - if so, it's always inactive
    if (checkpoint.status === 'inactive') {
      return false
    }

    // If status is 'active', check if current time is within the operating window
    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTime = currentHours * 60 + currentMinutes // Convert to minutes since midnight

    const [startHours, startMinutes] = checkpoint.timeStart.split(':').map(Number)
    const [endHours, endMinutes] = checkpoint.timeEnd.split(':').map(Number)
    const startTime = startHours * 60 + startMinutes
    const endTime = endHours * 60 + endMinutes

    // Handle case where end time is next day (e.g., 12:00 to 00:00)
    if (endTime < startTime) {
      // Time window spans midnight
      return currentTime >= startTime || currentTime <= endTime
    } else {
      // Normal time window within same day
      return currentTime >= startTime && currentTime <= endTime
    }
  }

  // Filter checkpoints based on selected filter
  const getFilteredCheckpoints = () => {
    if (checkpointFilter === 'all') {
      return checkpoints
    } else if (checkpointFilter === 'active') {
      return checkpoints.filter(checkpoint => isCheckpointCurrentlyActive(checkpoint))
    } else {
      // 'inactive'
      return checkpoints.filter(checkpoint => !isCheckpointCurrentlyActive(checkpoint))
    }
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading Google Maps</p>
          <p className="text-gray-600 text-sm">{loadError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-primary/95 backdrop-blur-md shadow-lg border-b border-white/30 fixed top-0 left-0 right-0 z-50 w-full">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-xl ring-2 ring-white/50 hover:scale-105 transition-transform">
                <span className="text-primary-600 text-lg font-bold">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-md">CRASH Dashboard</h1>
                <p className="text-xs text-white/70">Police Emergency Response System</p>
              </div>
            </div>
            
            {/* Center Section - Empty for Balance */}
            
            {/* Right Section - Actions & User Menu */}
            <div className="flex items-center gap-6">
              {/* Status Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white/90">System Active</span>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all relative group">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Notifications</span>
                </button>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-3 pl-6 border-l border-white/20">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-white/70">{user?.role}</p>
                </div>
                <div className="h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all cursor-pointer">
                  <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/80 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-6 py-4 pt-20">
        {/* Navigation Tabs */}
        <div className="mb-4">
          <nav className="flex space-x-6">
            <Link
              href="/dashboard"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Dashboard
            </Link>
            <Link
              href="/map"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Map className="h-4 w-4 inline mr-2" />
              Live Map
            </Link>
            <Link
              href="/analytics"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </Link>
            <Link
              href="/resolved-cases"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resolved-cases' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Resolved Cases
            </Link>
          </nav>
        </div>

        {/* Map Container - Full Width */}
        <div className="glass-card-strong h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Live Map Monitoring</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowLegendModal(true)}
                className="btn-secondary flex items-center"
              >
                <Info className="h-4 w-4 mr-2" />
                Legend
              </button>
              <button
                onClick={() => setShowAddCheckpoint(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Checkpoint
              </button>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <button
              onClick={() => setActiveFilters(prev => ({ ...prev, activeCases: !prev.activeCases }))}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors flex items-center ${
                activeFilters.activeCases
                  ? 'bg-red-100 text-red-700 border-2 border-red-500'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${activeFilters.activeCases ? 'bg-red-500' : 'bg-gray-400'}`}></div>
              Active Cases
            </button>
            <button
              onClick={() => setActiveFilters(prev => ({ ...prev, policeCheckpoint: !prev.policeCheckpoint }))}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors flex items-center ${
                activeFilters.policeCheckpoint
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${activeFilters.policeCheckpoint ? 'bg-primary-600' : 'bg-gray-400'}`}></div>
              Police Checkpoints
            </button>
            <button
              onClick={() => setActiveFilters(prev => ({ ...prev, policeOffices: !prev.policeOffices }))}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors flex items-center ${
                activeFilters.policeOffices
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${activeFilters.policeOffices ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              Police Offices/Station
            </button>
            
            {/* Conditional Checkpoint Filter Dropdown - Only shows when Police Checkpoints is selected */}
            {activeFilters.policeCheckpoint && (
              <div className="ml-2">
                <select
                  value={checkpointFilter}
                  onChange={(e) => setCheckpointFilter(e.target.value)}
                  className="px-4 py-2 rounded-2xl text-sm font-medium border-2 border-primary-600 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {TemporaryDatabase.checkpointFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Google Maps Container */}
          <div className="bg-gray-100 rounded-lg h-[calc(100%-120px)] relative overflow-hidden">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={defaultZoom}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                  }
                ]
              }}
            >
                {/* Case Pins (Reports) */}
                {activeFilters.activeCases && reports.map((report) => {
                  const getCategoryColor = (category) => {
                    switch (category.toLowerCase()) {
                      case 'crime':
                        return '#ef4444' // red-500
                      case 'fire':
                        return '#f97316' // orange-500
                      case 'medical':
                        return '#22c55e' // green-500
                      default:
                        return '#6b7280' // gray-500
                    }
                  }

                  return (
                    <Marker
                      key={`report-${report.id}`}
                      position={{
                        lat: report.location.lat,
                        lng: report.location.lng
                      }}
                      icon={{
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: getCategoryColor(report.category),
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 1.2,
                        anchor: { x: 12, y: 24 }
                      }}
                  onClick={() => setSelectedPin({ type: 'report', data: report })}
                  title={`${report.category} - ${report.city}`}
                    />
                  )
                })}

                {/* Checkpoint Pins */}
              {activeFilters.policeCheckpoint && getFilteredCheckpoints().map((checkpoint) => {
                  const isActive = isCheckpointCurrentlyActive(checkpoint)
                  const pinColor = isActive ? '#2563eb' : '#6b7280' // Blue for active, Gray for inactive
                  
                  return (
                    <Marker
                      key={`checkpoint-${checkpoint.id}`}
                      position={{
                        lat: checkpoint.location.lat,
                        lng: checkpoint.location.lng
                      }}
                      icon={{
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: pinColor,
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 1.2,
                        anchor: { x: 12, y: 24 }
                      }}
                      onClick={() => setSelectedPin({ type: 'checkpoint', data: checkpoint })}
                      title={checkpoint.name}
                    />
                  )
                })}
            </GoogleMap>
            
            {/* Pin Pop-up Window - Compact */}
            {selectedPin && (
              <div className="absolute bottom-4 right-4 max-w-xs bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/50 p-3 z-30">
                <div className="flex items-start justify-between mb-2">
                  {selectedPin.type === 'report' && selectedPin.data && (
                    <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2 truncate">
                      {selectedPin.data.category} Report
                    </h3>
                  )}
                  {selectedPin.type === 'checkpoint' && selectedPin.data && (
                    <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2 truncate">
                      {selectedPin.data.name}
                    </h3>
                  )}
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                
                {selectedPin.type === 'report' && selectedPin.data && (
                  <>
                    <div className="space-y-1.5 mb-3">
                      <p className="text-xs text-gray-700 truncate">
                        <span className="font-medium">Reporter:</span> {selectedPin.data.reporterName}
                      </p>
                      <p className="text-xs text-gray-700 truncate">
                        <span className="font-medium">Location:</span> {selectedPin.data.city}, {selectedPin.data.barangay}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`font-medium underline ${getStatusColor(selectedPin.data.status)}`}>
                          {selectedPin.data.status.charAt(0).toUpperCase() + selectedPin.data.status.slice(1)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 pt-1.5 border-t border-gray-200 line-clamp-2">
                        {selectedPin.data.location.address}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReportForModal(selectedPin.data)
                        setShowReportModal(true)
                        setSelectedPin(null)
                      }}
                      className="btn-primary text-xs py-1.5 px-3 w-full"
                    >
                      View Full Details
                    </button>
                  </>
                )}
                
                {selectedPin.type === 'checkpoint' && selectedPin.data && (() => {
                  const checkpoint = selectedPin.data
                  // Format operating hours: show "24/7" if timeStart is 00:00 and timeEnd is 23:59 (or 00:00)
                  const formatOperatingHours = () => {
                    // Check for 24/7 cases: 00:00 to 23:59 or 00:00 to 00:00 (full day)
                    if ((checkpoint.timeStart === '00:00' && checkpoint.timeEnd === '23:59') ||
                        (checkpoint.timeStart === '00:00' && checkpoint.timeEnd === '00:00')) {
                      return '24/7'
                    }
                    // Otherwise show the time range in 24-hour format
                    return `${checkpoint.timeStart} - ${checkpoint.timeEnd}`
                  }
                  
                  return (
                    <>
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs text-gray-600 truncate">
                          <span className="font-medium">Officers:</span> {checkpoint.assignedOfficers.join(', ')}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Time:</span> {formatOperatingHours()}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Contact:</span> {checkpoint.contactNumber}
                        </p>
                        <p className="text-xs text-gray-500 pt-1.5 border-t border-gray-200 line-clamp-2">
                          {checkpoint.location.address}
                        </p>
                      </div>
                    <div className="flex flex-col space-y-1.5">
                      <button
                        onClick={() => {
                          handleEditCheckpointClick(selectedPin.data)
                          setSelectedPin(null)
                        }}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center justify-center w-full"
                      >
                        <Pencil className="h-3 w-3 mr-1.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${selectedPin.data.name}"?`)) {
                            handleDeleteCheckpoint(selectedPin.data.id)
                            setSelectedPin(null)
                          }
                        }}
                        className="btn-danger text-xs py-1.5 px-3 flex items-center justify-center w-full"
                      >
                        <Trash2 className="h-3 w-3 mr-1.5" />
                        Remove
                      </button>
                    </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddCheckpoint && (
        <AddCheckpointModal
          onClose={() => setShowAddCheckpoint(false)}
          onAdd={handleAddCheckpoint}
        />
      )}

      {showEditCheckpoint && selectedCheckpoint && (
        <EditCheckpointModal
          checkpoint={selectedCheckpoint}
          onClose={() => {
            setShowEditCheckpoint(false)
            setSelectedCheckpoint(null)
          }}
          onUpdate={handleEditCheckpoint}
          onDelete={handleDeleteCheckpoint}
        />
      )}

      {showReportModal && selectedReportForModal && (
        <ReportDetailsModal
          report={selectedReportForModal}
          onClose={() => {
            setShowReportModal(false)
            setSelectedReportForModal(null)
          }}
          onStatusChange={(reportId, newStatus) => {
            /*
             * TODO: API INTEGRATION POINT
             * ACTION: Update the status of a specific report.
             * METHOD: PATCH
             * ENDPOINT: /api/reports/:reportId/status
             * 
             * Replace the local state update with an API call here.
             * The API should accept: { status: string } in the request body.
             */
            // TODO: Replace with API call: PATCH /api/reports/${reportId}/status
            setReports(prev => prev.map(report => 
              report.id === reportId ? { ...report, status: newStatus } : report
            ))
            toast.success('Status updated successfully')
          }}
        />
      )}

      {showLegendModal && (
        <MapLegendModal
          onClose={() => setShowLegendModal(false)}
        />
      )}
    </div>
  )
}

export default LiveMap

