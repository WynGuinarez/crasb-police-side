import { Clock, MapPin, Trash2, Users, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

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
    status: checkpoint.status
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
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
        schedule: formData.schedule.trim() || '24/7',
        status: formData.status as 'active' | 'inactive'
      }
      
      onUpdate(updatedCheckpoint)
      setLoading(false)
    }, 1000)
  }

  const handleDelete = () => {
    onDelete(checkpoint.id)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

          {/* Schedule */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Schedule
            </label>
            <div className="relative">
              <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => handleInputChange('schedule', e.target.value)}
                placeholder="e.g., 6:00 AM - 10:00 PM or 24/7"
                className="input-field pl-10"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
