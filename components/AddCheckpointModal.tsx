import { Clock, MapPin, Minus, Plus, Users, X } from 'lucide-react'
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

interface AddCheckpointModalProps {
  onClose: () => void
  onAdd: (checkpoint: Omit<Checkpoint, 'id'>) => void
}

const AddCheckpointModal = ({ onClose, onAdd }: AddCheckpointModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    assignedOfficers: [''],
    schedule: '',
    status: 'active' as 'active' | 'inactive'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const checkpoint: Omit<Checkpoint, 'id'> = {
        name: formData.name.trim(),
        location: {
          lat: parseFloat(formData.lat) || 14.5995,
          lng: parseFloat(formData.lng) || 120.9842,
          address: formData.address.trim()
        },
        assignedOfficers: formData.assignedOfficers
          .map(officer => officer.trim())
          .filter(officer => officer.length > 0),
        schedule: formData.schedule.trim() || '24/7',
        status: formData.status
      }
      
      onAdd(checkpoint)
      setLoading(false)
    }, 1000)
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
                      className="p-2 text-red-600 hover:bg-red-50/80 backdrop-blur-sm rounded-lg transition-all duration-200 border border-red-200/50 shadow-sm"
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
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300/60 rounded-lg text-gray-600 bg-white/50 backdrop-blur-sm hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Officer
              </button>
            </div>
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
