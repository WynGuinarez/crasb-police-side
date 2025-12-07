import { Info, MapPin, X } from 'lucide-react'

const MapLegendModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <Info className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Map Legend
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Cases Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Cases</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#ef4444' }}></div>
                <span className="text-sm text-gray-700">Crime Reports</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#f97316' }}></div>
                <span className="text-sm text-gray-700">Fire Reports</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#22c55e' }}></div>
                <span className="text-sm text-gray-700">Medical Reports</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#6b7280' }}></div>
                <span className="text-sm text-gray-700">Other Reports</span>
              </div>
            </div>
          </div>

          {/* Checkpoints Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Police Checkpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#2563eb' }}></div>
                <span className="text-sm text-gray-700">Active Checkpoints</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#6b7280' }}></div>
                <span className="text-sm text-gray-700">Inactive Checkpoints</span>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="pt-4 border-t border-gray-200/50">
            <p className="text-xs text-gray-500">
              Click on any pin on the map to view detailed information.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end p-6 border-t border-gray-200/50">
          <button
            onClick={onClose}
            className="btn-primary px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapLegendModal

