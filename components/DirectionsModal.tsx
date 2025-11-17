import { Copy, ExternalLink, MapPin, Navigation, QrCode, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

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

interface DirectionsModalProps {
  report: Report
  onClose: () => void
}

const DirectionsModal = ({ report, onClose }: DirectionsModalProps) => {
  const [showQRCode, setShowQRCode] = useState(false)

  // Mock police station location - in a real app, this would come from user settings or API
  const policeStationLocation = {
    lat: 14.5995,
    lng: 120.9842,
    address: 'Manila Police Station, Rizal Park, Manila'
  }

  const generateDirectionsURL = () => {
    const destination = `${report.location.lat},${report.location.lng}`
    const origin = `${policeStationLocation.lat},${policeStationLocation.lng}`
    return `https://www.google.com/maps/dir/${origin}/${destination}`
  }

  const handleCopyDirectionsURL = () => {
    const url = generateDirectionsURL()
    navigator.clipboard.writeText(url)
    toast.success('Directions URL copied to clipboard!')
  }

  const handleOpenInMaps = () => {
    const url = generateDirectionsURL()
    window.open(url, '_blank')
  }

  const generateQRCodeData = () => {
    return generateDirectionsURL()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <Navigation className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Directions to Incident
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Report #{report.id} - {report.location.address}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Maps Container */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  Route Map
                </h3>
                
                {/* Google Maps Embed Container */}
                <div className="bg-white/40 backdrop-blur-sm rounded-lg h-[500px] flex items-center justify-center border-2 border-dashed border-white/50 shadow-inner">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Google Maps Integration
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      This container will display Google Maps with the route from police station to incident location.
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>From:</strong> {policeStationLocation.address}</p>
                      <p><strong>To:</strong> {report.location.address}</p>
                      <p><strong>Distance:</strong> ~2.5 km (estimated)</p>
                      <p><strong>Duration:</strong> ~8 minutes (estimated)</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={handleOpenInMaps}
                    className="btn-primary flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </button>
                  <button
                    onClick={handleCopyDirectionsURL}
                    className="btn-secondary flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div>
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <QrCode className="h-5 w-5 text-indigo-600" />
                    </div>
                    QR Code
                  </h3>
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="text-sm text-primary-500 hover:text-primary-700"
                  >
                    {showQRCode ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showQRCode ? (
                  <div className="text-center">
                    {/* QR Code Placeholder */}
                    <div className="bg-white/40 backdrop-blur-sm rounded-lg p-8 mb-4 border border-white/50 shadow-inner">
                      <div className="w-40 h-40 bg-white/80 backdrop-blur-md rounded-lg mx-auto flex items-center justify-center border-2 border-white/60 shadow-md">
                        <QrCode className="h-20 w-20 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Scan with your phone for instant directions
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Click "Show" to generate QR code
                    </p>
                  </div>
                )}
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

export default DirectionsModal
