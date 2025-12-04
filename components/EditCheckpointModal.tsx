import { Clock, MapPin, Phone, Trash2, Users, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

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

interface EditCheckpointModalProps {
  checkpoint: Checkpoint
  onClose: () => void
  onUpdate: (checkpoint: Checkpoint) => void
  onDelete: (checkpointId: string) => void
}

const EditCheckpointModal = ({ checkpoint, onClose, onUpdate, onDelete }: EditCheckpointModalProps) => {
  const [formData, setFormData] = useState({
    name: checkpoint.name,
    address: checkpoint.location.address,
    lat: checkpoint.location.lat.toString(),
    lng: checkpoint.location.lng.toString(),
    assignedOfficers: checkpoint.assignedOfficers.join(', '),
    schedule: checkpoint.schedule,
    timeStart: checkpoint.timeStart || '08:00',
    timeEnd: checkpoint.timeEnd || '20:00',
    status: checkpoint.status,
    contactNumber: checkpoint.contactNumber || ''
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Update an existing police checkpoint.
   * METHOD: PATCH
   * ENDPOINT: /api/checkpoints/:checkpointId
   * 
   * Replace the onUpdate callback with an API call here.
   * The API should accept the updated checkpoint data in the request body.
   */
  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Prepare updated checkpoint data for API submission
    const updatedCheckpoint: Checkpoint = {
      ...checkpoint,
      name: formData.name.trim(),
      location: {
        lat: parseFloat(formData.lat) || checkpoint.location.lat,
        lng: parseFloat(formData.lng) || checkpoint.location.lng,
        address: formData.address.trim()
      },
      assignedOfficers: formData.assignedOfficers
        .split(',')
        .map(officer => officer.trim())
        .filter(officer => officer.length > 0),
      schedule: formData.schedule.trim() || `${formData.timeStart} - ${formData.timeEnd}`,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      status: formData.status as 'active' | 'inactive',
      contactNumber: formData.contactNumber.trim()
    }
    
    // TODO: Replace with API call: PATCH /api/checkpoints/${checkpoint.id}
    // const response = await fetch(`/api/checkpoints/${checkpoint.id}`, { method: 'PATCH', body: JSON.stringify(updatedCheckpoint) })
    // const savedCheckpoint = await response.json()
    // onUpdate(savedCheckpoint)
    
    // Temporary: Call parent callback (to be replaced with API call)
    onUpdate(updatedCheckpoint)
    setLoading(false)
  }

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Delete a police checkpoint.
   * METHOD: DELETE
   * ENDPOINT: /api/checkpoints/:checkpointId
   * 
   * Replace the onDelete callback with an API call here.
   */
  const handleDelete = () => {
    // TODO: Replace with API call: DELETE /api/checkpoints/${checkpoint.id}
    // await fetch(`/api/checkpoints/${checkpoint.id}`, { method: 'DELETE' })
    
    // Temporary: Call parent callback (to be replaced with API call)
    onDelete(checkpoint.id)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle time input with strict 24-hour format enforcement
  const handleTimeChange = (field: 'timeStart' | 'timeEnd', value: string) => {
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
              Edit Checkpoint
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
            <div className="relative">
              <Users className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.assignedOfficers}
                onChange={(e) => handleInputChange('assignedOfficers', e.target.value)}
                placeholder="Officer 1, Officer 2, Officer 3"
                className="input-field pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple officers with commas
            </p>
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
          <div className="space-y-3 pt-6 border-t border-gray-200/50">
            <div className="flex space-x-3">
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
                    Updating...
                  </div>
                ) : (
                  'Update Checkpoint'
                )}
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger w-full flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Checkpoint
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content max-w-sm bg-white/95 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-danger-50 rounded-full flex items-center justify-center mr-4">
                    <Trash2 className="h-6 w-6 text-danger-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Checkpoint
                    </h3>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete "{checkpoint.name}"? This will permanently remove the checkpoint from the system.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn-danger flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditCheckpointModal
