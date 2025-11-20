import {
  AlertTriangle,
  BarChart3,
  Bell,
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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import AddCheckpointModal from '../components/AddCheckpointModal'
import EditCheckpointModal from '../components/EditCheckpointModal'
import ReportDetailsModal from '../components/ReportDetailsModal'
import MapLegendModal from '../components/MapLegendModal'
import { useAuth } from '../contexts/AuthContext'

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
  timeStart: string
  timeEnd: string
  status: 'active' | 'inactive'
  contactNumber: string
}

interface Report {
  id: string
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  city: string
  barangay: string
  category: string
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
  distance?: string // Distance from police station to report location (e.g., "5.4 km")
  eta?: string // Estimated time of arrival (e.g., "12 mins")
}

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
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false)
  const [showEditCheckpoint, setShowEditCheckpoint] = useState(false)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReportForModal, setSelectedReportForModal] = useState<Report | null>(null)
  const [showLegendModal, setShowLegendModal] = useState(false)
  const [activeFilters, setActiveFilters] = useState<{
    activeCases: boolean
    policeCheckpoint: boolean
    policeOffices: boolean
  }>({
    activeCases: true,
    policeCheckpoint: true,
    policeOffices: true
  })
  const [checkpointFilter, setCheckpointFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedPin, setSelectedPin] = useState<{ type: 'report' | 'checkpoint' | 'office', data: Report | Checkpoint | null } | null>(null)

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockCheckpoints: Checkpoint[] = [
      {
        id: '1',
        name: 'Main Police Station',
        location: {
          lat: 14.5995,
          lng: 120.9842,
          address: 'Rizal Park, Malate, Manila'
        },
        assignedOfficers: ['Officer John', 'Officer Maria'],
        schedule: '24/7',
        timeStart: '00:00',
        timeEnd: '23:59',
        status: 'active',
        contactNumber: '+63 2 8523 4567'
      },
      {
        id: '2',
        name: 'Traffic Checkpoint Alpha',
        location: {
          lat: 14.6042,
          lng: 120.9822,
          address: 'EDSA Corner Ayala Avenue, Makati'
        },
        assignedOfficers: ['Officer Pedro', 'Officer Ana'],
        schedule: '06:00 - 22:00',
        timeStart: '06:00',
        timeEnd: '22:00',
        status: 'active',
        contactNumber: '+63 2 8845 1234'
      },
      {
        id: '3',
        name: 'Emergency Response Unit',
        location: {
          lat: 14.5905,
          lng: 120.9789,
          address: 'Quezon City Hall, Diliman'
        },
        assignedOfficers: ['Officer Carlos', 'Officer Sofia'],
        schedule: '12:00 - 00:00',
        timeStart: '12:00',
        timeEnd: '00:00',
        status: 'active',
        contactNumber: '+63 2 8927 8901'
      }
    ]

    const mockReports: Report[] = [
      {
        id: '1',
        reporterName: 'John Denzel Bolito',
        reporterPhone: '+63 912 345 6789',
        reporterEmail: 'John.denzel.bolito@email.com',
        city: 'Manila',
        barangay: 'Malate',
        category: 'Crime',
        status: 'pending',
        description: 'Suspicious activity near the park. Two individuals acting suspiciously around parked vehicles.',
        location: {
          lat: 14.6015,
          lng: 120.9862,
          address: 'Rizal Park, Malate, Manila'
        },
        attachments: ['image1.jpg', 'video1.mp4'],
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+63 912 345 6790'
        },
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        reporterName: 'Rodel Lingcopines',
        reporterPhone: '+63 917 123 4567',
        reporterEmail: 'Lingcopines@email.com',
        city: 'Quezon City',
        barangay: 'Diliman',
        category: 'Fire',
        status: 'acknowledged',
        description: 'Fire alarm triggered in residential building. Smoke visible from 3rd floor.',
        location: {
          lat: 14.6539,
          lng: 121.0689,
          address: '123 University Ave, Diliman, Quezon City'
        },
        attachments: ['fire_image.jpg'],
        emergencyContact: {
          name: 'Pedro Santos',
          phone: '+63 917 123 4568'
        },
        timestamp: '2024-01-15T09:15:00Z'
      }
    ]

    // Load data immediately (no artificial delay)
    setCheckpoints(mockCheckpoints)
    setReports(mockReports)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Refresh checkpoint status every minute to update active/inactive status
  useEffect(() => {
    const interval = setInterval(() => {
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'dashboard') {
      router.push('/dashboard')
    } else if (tab === 'analytics') {
      router.push('/analytics')
    }
  }

  const handleAddCheckpoint = (checkpoint: Omit<Checkpoint, 'id'>) => {
    const newCheckpoint: Checkpoint = {
      ...checkpoint,
      id: Date.now().toString()
    }
    setCheckpoints(prev => [...prev, newCheckpoint])
    toast.success('Checkpoint added successfully')
    setShowAddCheckpoint(false)
  }

  const handleEditCheckpoint = (updatedCheckpoint: Checkpoint) => {
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

  const handleDeleteCheckpoint = (checkpointId: string) => {
    setCheckpoints(prev => prev.filter(checkpoint => checkpoint.id !== checkpointId))
    toast.success('Checkpoint deleted successfully')
  }

  const handleEditCheckpointClick = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint)
    setShowEditCheckpoint(true)
  }

  const getCategoryIcon = (category: string) => {
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

  const getStatusColor = (status: Report['status']) => {
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
  const isCheckpointCurrentlyActive = (checkpoint: Checkpoint): boolean => {
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
  const getFilteredCheckpoints = (): Checkpoint[] => {
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
      <header className="bg-gradient-primary/95 backdrop-blur-md shadow-lg border-b border-white/30 sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center mr-3 shadow-xl ring-2 ring-white/50">
                <span className="text-primary-600 text-sm font-bold">C</span>
              </div>
              <h1 className="text-lg font-bold text-white drop-shadow-md">CRASH Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="p-1 text-white/80 hover:text-white relative">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-white/80">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-white/80 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        {/* Navigation Tabs */}
        <div className="mb-4">
          <nav className="flex space-x-6">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => handleTabChange('map')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Map className="h-4 w-4 inline mr-2" />
              Live Map
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
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
                  onChange={(e) => setCheckpointFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-primary-600 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <option value="all">All Checkpoints</option>
                  <option value="active">Active Checkpoints</option>
                  <option value="inactive">Inactive Checkpoints</option>
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
                  const getCategoryColor = (category: string) => {
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
                      {(selectedPin.data as Report).category} Report
                    </h3>
                  )}
                  {selectedPin.type === 'checkpoint' && selectedPin.data && (
                    <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2 truncate">
                      {(selectedPin.data as Checkpoint).name}
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
                        <span className="font-medium">Reporter:</span> {(selectedPin.data as Report).reporterName}
                      </p>
                      <p className="text-xs text-gray-700 truncate">
                        <span className="font-medium">Location:</span> {(selectedPin.data as Report).city}, {(selectedPin.data as Report).barangay}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`font-medium underline ${getStatusColor((selectedPin.data as Report).status)}`}>
                          {(selectedPin.data as Report).status.charAt(0).toUpperCase() + (selectedPin.data as Report).status.slice(1)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 pt-1.5 border-t border-gray-200 line-clamp-2">
                        {(selectedPin.data as Report).location.address}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReportForModal(selectedPin.data as Report)
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
                  const checkpoint = selectedPin.data as Checkpoint
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
                          handleEditCheckpointClick(selectedPin.data as Checkpoint)
                          setSelectedPin(null)
                        }}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center justify-center w-full"
                      >
                        <Pencil className="h-3 w-3 mr-1.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${(selectedPin.data as Checkpoint).name}"?`)) {
                            handleDeleteCheckpoint((selectedPin.data as Checkpoint).id)
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
