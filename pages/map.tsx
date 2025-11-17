import {
  AlertTriangle,
  BarChart3,
  Bell,
  Home,
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
import AddCheckpointModal from '../components/AddCheckpointModal'
import EditCheckpointModal from '../components/EditCheckpointModal'
import ReportDetailsModal from '../components/ReportDetailsModal'
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
  status: 'active' | 'inactive'
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
}

const LiveMap = () => {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('map')
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false)
  const [showEditCheckpoint, setShowEditCheckpoint] = useState(false)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReportForModal, setSelectedReportForModal] = useState<Report | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    activeCases: boolean
    policeCheckpoint: boolean
    policeOffices: boolean
  }>({
    activeCases: true,
    policeCheckpoint: true,
    policeOffices: true
  })
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
        status: 'active'
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
        schedule: '6:00 AM - 10:00 PM',
        status: 'active'
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
        schedule: '12:00 PM - 12:00 AM',
        status: 'active'
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

    // Simulate loading
    setTimeout(() => {
      setCheckpoints(mockCheckpoints)
      setReports(mockReports)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
        <div className="glass-card-strong h-[calc(100vh-200px)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Live Map Monitoring</h2>
            <div className="flex space-x-2">
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
          <div className="flex flex-wrap gap-2 mb-4">
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
              Police Checkpoint
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
          </div>
          
          {/* Google Maps Container */}
          <div className="bg-gray-100 rounded-lg h-[calc(100%-140px)] flex items-center justify-center border-2 border-dashed border-gray-300 relative">
            {/* Map Pins (Mock implementation - will be replaced with actual Google Maps) */}
            <div className="absolute inset-0 z-10">
              {/* Mock pins for demonstration */}
              {activeFilters.activeCases && reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedPin({ type: 'report', data: report })}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={{
                    left: `${((report.location.lng + 180) / 360) * 100}%`,
                    top: `${((90 - report.location.lat) / 180) * 100}%`
                  }}
                  title={`${report.category} - ${report.city}`}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                </button>
              ))}
              
              {activeFilters.policeCheckpoint && checkpoints.map((checkpoint) => (
                <button
                  key={checkpoint.id}
                  onClick={() => setSelectedPin({ type: 'checkpoint', data: checkpoint })}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={{
                    left: `${((checkpoint.location.lng + 180) / 360) * 100}%`,
                    top: `${((90 - checkpoint.location.lat) / 180) * 100}%`
                  }}
                  title={checkpoint.name}
                >
                  <div className="w-6 h-6 bg-primary-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                </button>
              ))}
            </div>
            
            {/* Map placeholder content */}
            <div className="text-center z-0">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Google Maps Integration
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                This container will display Google Maps with live pins for reports and checkpoints.
              </p>
              <div className="text-xs text-gray-600">
                Click on pins to view details
              </div>
            </div>
            
            {/* Pin Pop-up Window */}
            {selectedPin && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl border border-white/50 p-4 z-30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {selectedPin.type === 'report' && selectedPin.data && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {(selectedPin.data as Report).category} Report
                        </h3>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reporter:</span> {(selectedPin.data as Report).reporterName}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Location:</span> {(selectedPin.data as Report).city}, {(selectedPin.data as Report).barangay}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Status:</span>{' '}
                            <span className={`font-medium underline ${getStatusColor((selectedPin.data as Report).status)}`}>
                              {(selectedPin.data as Report).status.charAt(0).toUpperCase() + (selectedPin.data as Report).status.slice(1)}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                            {(selectedPin.data as Report).location.address}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReportForModal(selectedPin.data as Report)
                            setShowReportModal(true)
                            setSelectedPin(null)
                          }}
                          className="btn-primary text-sm py-2 px-4 w-full"
                        >
                          View Full Details
                        </button>
                      </>
                    )}
                    {selectedPin.type === 'checkpoint' && selectedPin.data && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {(selectedPin.data as Checkpoint).name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Officers: {(selectedPin.data as Checkpoint).assignedOfficers.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Schedule: {(selectedPin.data as Checkpoint).schedule}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          {(selectedPin.data as Checkpoint).location.address}
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => {
                              handleEditCheckpointClick(selectedPin.data as Checkpoint)
                              setSelectedPin(null)
                            }}
                            className="btn-secondary text-sm py-2 px-4 flex items-center"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${(selectedPin.data as Checkpoint).name}"?`)) {
                                handleDeleteCheckpoint((selectedPin.data as Checkpoint).id)
                                setSelectedPin(null)
                              }
                            }}
                            className="btn-danger text-sm py-2 px-4 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
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
    </div>
  )
}

export default LiveMap
