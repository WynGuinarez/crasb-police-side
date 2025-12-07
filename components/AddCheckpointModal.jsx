import { Clock, MapPin, Minus, Phone, Plus, Users, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

const AddCheckpointModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    assignedOfficers: [''],
    schedule: '',
    timeStart: '08:00',
    timeEnd: '20:00',
    status: 'active',
    contactNumber: ''
  })
  const [loading, setLoading] = useState(false)

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
   * AUTHENTICATION:
   * - Include JWT token in Authorization header: "Bearer {token}"
   * 
   * EXPECTED RESPONSE (201):
   * {
   *   "id": "uuid",  // Backend will assign this
   *   ... (full checkpoint object with assigned id)
   * }
   * 
   * INTEGRATION STEPS:
   * 1. Validate all required fields
   * 2. Get auth token from localStorage
   * 3. Make POST request to: ${process.env.NEXT_PUBLIC_API_URL}/checkpoints/
   * 4. Include Authorization header and Content-Type: application/json
   * 5. Send checkpoint data (without id) in request body
   * 6. On success, call onAdd callback with returned checkpoint (with id)
   * 7. Close modal
   * 8. Show success toast notification
   * 9. Handle errors (401 = unauthorized, 400 = validation error)
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/checkpoints/`,
   *   {
   *     method: 'POST',
   *     headers: {
   *       'Authorization': `Bearer ${token}`,
   *       'Content-Type': 'application/json'
   *     },
   *     body: JSON.stringify(checkpoint)
   *   }
   * )
   * if (response.ok) {
   *   const createdCheckpoint = await response.json()
   *   onAdd(createdCheckpoint)
   *   onClose()
   *   toast.success('Checkpoint created successfully')
   * } else {
   *   const error = await response.json()
   *   toast.error(error.message || 'Failed to create checkpoint')
   * }
   * ============================================================================
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.address.trim() || !formData.contactNumber.trim() || !formData.timeStart || !formData.timeEnd) {
      toast.error('Please fill in all required fields')
      return
    }

    // Basic phone number validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(formData.contactNumber.trim())) {
      toast.error('Please enter a valid phone number')
      return
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(formData.timeStart) || !timeRegex.test(formData.timeEnd)) {
      toast.error('Please enter valid time in 24-hour format (HH:MM)')
      return
    }

    setLoading(true)
    
    // Prepare checkpoint data for API submission
    const checkpoint = {
      name: formData.name.trim(),
      location: {
        lat: parseFloat(formData.lat) || 14.5995,
        lng: parseFloat(formData.lng) || 120.9842,
        address: formData.address.trim()
      },
      assignedOfficers: formData.assignedOfficers
        .map(officer => officer.trim())
        .filter(officer => officer.length > 0),
      schedule: formData.schedule.trim() || `${formData.timeStart} - ${formData.timeEnd}`,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      status: formData.status,
      contactNumber: formData.contactNumber.trim()
    }
    
    // TODO: Replace with API call: POST /api/checkpoints
    // const response = await fetch('/api/checkpoints', { method: 'POST', body: JSON.stringify(checkpoint) })
    // const createdCheckpoint = await response.json()
    // onAdd(createdCheckpoint)
    
    // Temporary: Call parent callback (to be replaced with API call)
    onAdd(checkpoint)
    setLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle time input with strict 24-hour format enforcement
  const handleTimeChange = (field, value) => {
    // Remove any non-digit characters except colon
    let cleaned = value.replace(/[^\d:]/g, '')
    
    // Limit to 5 characters (HH:MM)
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5)
    }
    
    // Auto-format as user types
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      cleaned = cleaned + ':'
    }
    
    // Validate hours (00-23) and minutes (00-59)
    if (cleaned.includes(':')) {
      const [hours, minutes] = cleaned.split(':')
      if (hours && parseInt(hours) > 23) {
        cleaned = '23' + (minutes ? ':' + minutes : '')
      }
      if (minutes && parseInt(minutes) > 59) {
        cleaned = (hours || '00') + ':59'
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: cleaned }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Add Checkpoint
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Checkpoint Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Checkpoint Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter checkpoint name"
              className="input-field"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Checkpoint Contact Number *
            </label>
            <div className="relative">
              <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                placeholder="e.g., +63 912 345 6789"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              className="input-field"
              required
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => handleInputChange('lat', e.target.value)}
                placeholder="14.5995"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => handleInputChange('lng', e.target.value)}
                placeholder="120.9842"
                className="input-field"
              />
            </div>
          </div>

          {/* Assigned Officers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assigned Officers
            </label>
            <div className="space-y-2">
              {formData.assignedOfficers.map((officer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Users className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={officer}
                      onChange={(e) => {
                        const newOfficers = [...formData.assignedOfficers]
                        newOfficers[index] = e.target.value
                        setFormData(prev => ({ ...prev, assignedOfficers: newOfficers }))
                      }}
                      placeholder={`Officer ${index + 1} name`}
                      className="input-field pl-10"
                    />
                  </div>
                  {formData.assignedOfficers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOfficers = formData.assignedOfficers.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, assignedOfficers: newOfficers }))
                      }}
                      className="p-2 text-red-600 hover:bg-red-50/80 backdrop-blur-sm rounded-2xl transition-all duration-200 border border-red-200/50 shadow-sm"
                      title="Remove officer"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, assignedOfficers: [...prev.assignedOfficers, ''] }))
                }}
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300/60 rounded-2xl text-gray-600 bg-white/50 backdrop-blur-sm hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Officer
              </button>
            </div>
          </div>

          {/* Time Start */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time Start (24-hour format) *
            </label>
            <div className="relative">
              <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.timeStart}
                onChange={(e) => handleTimeChange('timeStart', e.target.value)}
                onBlur={(e) => {
                  // Ensure format is HH:MM on blur
                  const value = e.target.value
                  if (value && !value.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
                    // Try to fix common issues
                    let fixed = value.replace(/[^\d:]/g, '')
                    if (fixed.length === 4 && !fixed.includes(':')) {
                      fixed = fixed.substring(0, 2) + ':' + fixed.substring(2)
                    }
                    if (fixed.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
                      setFormData(prev => ({ ...prev, timeStart: fixed }))
                    }
                  }
                }}
                placeholder="HH:MM (e.g., 08:00, 23:30)"
                className="input-field pl-10"
                required
                pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
                maxLength={5}
              />
            </div>
          </div>

          {/* Time End */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time End (24-hour format) *
            </label>
            <div className="relative">
              <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.timeEnd}
                onChange={(e) => handleTimeChange('timeEnd', e.target.value)}
                onBlur={(e) => {
                  // Ensure format is HH:MM on blur
                  const value = e.target.value
                  if (value && !value.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
                    // Try to fix common issues
                    let fixed = value.replace(/[^\d:]/g, '')
                    if (fixed.length === 4 && !fixed.includes(':')) {
                      fixed = fixed.substring(0, 2) + ':' + fixed.substring(2)
                    }
                    if (fixed.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
                      setFormData(prev => ({ ...prev, timeEnd: fixed }))
                    }
                  }
                }}
                placeholder="HH:MM (e.g., 08:00, 23:30)"
                className="input-field pl-10"
                required
                pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
                maxLength={5}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-field"
            >
              {TemporaryDatabase.checkpointStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : (
                'Add Checkpoint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCheckpointModal

