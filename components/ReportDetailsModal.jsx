import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Clock,
    Image as ImageIcon,
    Mail,
    MapPin,
    MessageSquare,
    Navigation,
    Phone,
    User,
    Video,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

const ReportDetailsModal = ({ report, onClose, onStatusChange, onDistanceEtaUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(report.status)
  const [message, setMessage] = useState('')
  const [showAttachments, setShowAttachments] = useState(false)

  // Update selectedStatus when report status changes
  useEffect(() => {
    setSelectedStatus(report.status)
  }, [report.status])

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Update Report Status
   * ============================================================================
   * 
   * BACKEND ENDPOINT: PATCH /api/reports/{report_id}/
   * 
   * NOTE: The backend uses PATCH on the report resource itself, not a separate
   * /status endpoint. Update the status field as part of the report object.
   * 
   * REQUEST BODY:
   * {
   *   "status": "pending" | "acknowledged" | "en-route" | "resolved" | "canceled"
   * }
   * 
   * AUTHENTICATION:
   * - Include JWT token in Authorization header: "Bearer {token}"
   * 
   * EXPECTED RESPONSE (200):
   * {
   *   "id": "uuid",
   *   "status": "updated_status",
   *   ... (full report object with updated status)
   * }
   * 
   * INTEGRATION STEPS:
   * 1. Get auth token from localStorage
   * 2. Make PATCH request to: ${process.env.NEXT_PUBLIC_API_URL}/reports/${report.id}/
   * 3. Include Authorization header and Content-Type: application/json
   * 4. Send { status: selectedStatus } in request body
   * 5. On success, call onStatusChange callback with updated report
   * 6. Show success toast notification
   * 7. Close modal
   * 8. Handle errors (401 = unauthorized, 400 = invalid status)
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/reports/${report.id}/`,
   *   {
   *     method: 'PATCH',
   *     headers: {
   *       'Authorization': `Bearer ${token}`,
   *       'Content-Type': 'application/json'
   *     },
   *     body: JSON.stringify({ status: selectedStatus })
   *   }
   * )
   * if (response.ok) {
   *   const updatedReport = await response.json()
   *   onStatusChange(report.id, selectedStatus) // Update parent component
   *   toast.success('Status updated successfully')
   *   onClose()
   * } else {
   *   toast.error('Failed to update status')
   * }
   * ============================================================================
   */
  const handleStatusChange = () => {
    if (selectedStatus !== report.status) {
      // TODO: REPLACE WITH BACKEND API CALL
      // BACKEND ENDPOINT: PATCH /api/reports/{report_id}/
      // See detailed comments above for integration guide
      
      // Temporary: Call parent callback (to be replaced with API call)
      onStatusChange(report.id, selectedStatus)
    }
    onClose()
  }

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Send Message to Reporter
   * ============================================================================
   * 
   * BACKEND ENDPOINT: POST /api/reports/{report_id}/messages/
   * 
   * NOTE: This is a nested endpoint under reports. Messages belong to a specific report.
   * 
   * REQUEST BODY:
   * {
   *   "text": "string",
   *   "senderType": "police"
   * }
   * 
   * AUTHENTICATION:
   * - Include JWT token in Authorization header: "Bearer {token}"
   * 
   * EXPECTED RESPONSE (201):
   * {
   *   "id": "uuid",
   *   "text": "string",
   *   "timestamp": "2024-01-01T12:00:00Z",
   *   "senderType": "police",
   *   "senderName": "string" (optional)
   * }
   * 
   * INTEGRATION STEPS:
   * 1. Validate message text is not empty
   * 2. Get auth token from localStorage
   * 3. Make POST request to: ${process.env.NEXT_PUBLIC_API_URL}/reports/${report.id}/messages/
   * 4. Include Authorization header and Content-Type: application/json
   * 5. Send { text: message.trim(), senderType: 'police' } in request body
   * 6. On success, show success toast notification
   * 7. Clear message input field
   * 8. Optionally refresh messages list to show new message
   * 9. Handle errors (401 = unauthorized, 400 = validation error)
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/reports/${report.id}/messages/`,
   *   {
   *     method: 'POST',
   *     headers: {
   *       'Authorization': `Bearer ${token}`,
   *       'Content-Type': 'application/json'
   *     },
   *     body: JSON.stringify({
   *       text: message.trim(),
   *       senderType: 'police'
   *     })
   *   }
   * )
   * if (response.ok) {
   *   toast.success('Message sent to reporter')
   *   setMessage('')
   *   // Optionally refresh messages if needed
   * } else {
   *   toast.error('Failed to send message')
   * }
   * ============================================================================
   */
  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: REPLACE WITH BACKEND API CALL
      // BACKEND ENDPOINT: POST /api/reports/{report_id}/messages/
      // See detailed comments above for integration guide
      
      toast.success('Message sent to reporter')
      setMessage('')
    }
  }

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Fetch available report status options (if statuses are dynamic).
   * METHOD: GET
   * ENDPOINT: /api/reports/status-options
   * 
   * If statuses are static, use TemporaryDatabase.reportStatuses.
   * If statuses are dynamic, replace with API call here.
   */
  const getStatusOptions = () => {
    // Using static status options from TemporaryDatabase
    // TODO: If statuses are dynamic, replace with API call: GET /api/reports/status-options
    return TemporaryDatabase.reportStatuses.map(status => ({
      value: status.value,
      label: status.label
    }))
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'crime':
        return <AlertTriangle className="h-5 w-5 text-danger-500" />
      case 'fire':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'medical':
        return <AlertTriangle className="h-5 w-5 text-success-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              {getCategoryIcon(report.category)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Report #{report.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Reporter Information */}
          <div className="glass-card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              Reporter Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <p className="text-sm font-medium text-gray-900">{report.reporterName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm font-medium text-gray-900">{report.reporterPhone}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm font-medium text-gray-900">{report.reporterEmail}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Emergency Contact
                </label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.emergencyContact.name}</p>
                    <p className="text-xs text-gray-600">{report.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Details */}
          <div className="glass-card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              Incident Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <p className="text-sm font-medium text-gray-900">{report.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Current Status
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'pending' ? 'status-pending' :
                    report.status === 'acknowledged' ? 'status-acknowledged' :
                    report.status === 'en-route' ? 'status-en-route' :
                    report.status === 'resolved' ? 'status-resolved' :
                    'status-canceled'
                  }`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <p className="text-sm text-gray-900 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/40 shadow-sm leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Location
                </label>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.location.address}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {report.city}, {report.barangay}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Coordinates: {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Information */}
              <div className="glass-card bg-blue-50/50 border-blue-200/50">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Navigation className="h-4 w-4 mr-2 text-blue-600" />
                  Response Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Distance (Police → Report)
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {report.distance || (
                        <span className="text-gray-400 italic">Not calculated</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      ETA (Estimated Time)
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {report.eta || (
                        <span className="text-gray-400 italic">Not calculated</span>
                      )}
                    </p>
                  </div>
                </div>
                {(!report.distance || !report.eta) && (
                  <p className="text-xs text-gray-500 mt-3">
                    Click "Directions" button to calculate distance and ETA
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Reported At
                </label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm font-medium text-gray-900">{formatTimestamp(report.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {report.attachments.length > 0 && (
            <div className="glass-card">
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  Attachments ({report.attachments.length})
                </h3>
                {showAttachments ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {showAttachments && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.attachments.map((attachment, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Open attachment in new tab/window
                        const url = attachment.startsWith('http') 
                          ? attachment 
                          : `${process.env.NEXT_PUBLIC_API_URL || ''}/attachments/${attachment}`
                        window.open(url, '_blank')
                      }}
                      className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/40 rounded-2xl p-4 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                      title="Click to view attachment"
                    >
                      {attachment.endsWith('.mp4') || attachment.endsWith('.mov') || attachment.endsWith('.avi') ? (
                        <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      )}
                      <p className="text-sm text-gray-600 truncate">{attachment}</p>
                      <p className="text-xs text-primary-600 mt-1">Click to view</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="glass-card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              Actions
            </h3>
            
            <div className="space-y-4">
              {/* Send Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Send Message to Reporter
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Change Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Change Status
                </label>
                <div className="flex space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="input-field flex-1"
                  >
                    {getStatusOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusChange}
                    className="btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportDetailsModal

