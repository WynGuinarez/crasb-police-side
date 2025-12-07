import { Clock, Copy, ExternalLink, MapPin, Navigation, QrCode, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

// Haversine formula to calculate distance between two coordinates
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const DirectionsModal = ({ report, onClose, onDistanceEtaUpdate }) => {
  const [showQRCode, setShowQRCode] = useState(false)
  const [distance, setDistance] = useState(report.distance || '')
  const [eta, setEta] = useState(report.eta || '')
  const [loading, setLoading] = useState(false)

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Fetch the police station location (user's assigned station).
   * METHOD: GET
   * ENDPOINT: /api/police-station/location
   * 
   * Replace the call to TemporaryDatabase.policeStationLocation with the actual API call here.
   * This should return the location of the logged-in user's assigned police station.
   */
  // Load police station location from temporary database (to be replaced with API call)
  const policeStationLocation = TemporaryDatabase.policeStationLocation

  // Calculate distance and ETA using Google Maps Directions Service
  useEffect(() => {
    const calculateDistanceAndETA = async () => {
      // If distance and ETA already exist, don't recalculate
      if (report.distance && report.eta) {
        setDistance(report.distance)
        setEta(report.eta)
        return
      }

      setLoading(true)
      try {
        const origin = `${policeStationLocation.lat},${policeStationLocation.lng}`
        const destination = `${report.location.lat},${report.location.lng}`
        
        // Use Google Maps Directions API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDH2oAs9HoUj5BueJRfrAfeZiSkhmMWCok'}`
        )
        
        const data = await response.json()
        
        if (data.status === 'OK' && data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          const leg = route.legs[0]
          
          // Extract distance
          const distanceValue = leg.distance.value / 1000 // Convert meters to kilometers
          const distanceText = `${distanceValue.toFixed(1)} km`
          
          // Extract duration
          const durationValue = leg.duration.value // in seconds
          const durationMinutes = Math.round(durationValue / 60)
          const etaText = `${durationMinutes} mins`
          
          setDistance(distanceText)
          setEta(etaText)
          
          // Update parent component with calculated values
          if (onDistanceEtaUpdate) {
            onDistanceEtaUpdate(report.id, distanceText, etaText)
          }
        } else {
          // Fallback calculation using Haversine formula for straight-line distance
          const calculatedDistance = calculateHaversineDistance(
            policeStationLocation.lat,
            policeStationLocation.lng,
            report.location.lat,
            report.location.lng
          )
          const estimatedETA = Math.round(calculatedDistance * 2) // Rough estimate: 2 mins per km
          
          setDistance(`${calculatedDistance.toFixed(1)} km`)
          setEta(`${estimatedETA} mins`)
          
          if (onDistanceEtaUpdate) {
            onDistanceEtaUpdate(report.id, `${calculatedDistance.toFixed(1)} km`, `${estimatedETA} mins`)
          }
        }
      } catch (error) {
        // Fallback calculation using Haversine formula
        // Error logged silently - user will see fallback calculation
        const calculatedDistance = calculateHaversineDistance(
          policeStationLocation.lat,
          policeStationLocation.lng,
          report.location.lat,
          report.location.lng
        )
        const estimatedETA = Math.round(calculatedDistance * 2)
        
        setDistance(`${calculatedDistance.toFixed(1)} km`)
        setEta(`${estimatedETA} mins`)
        
        if (onDistanceEtaUpdate) {
          onDistanceEtaUpdate(report.id, `${calculatedDistance.toFixed(1)} km`, `${estimatedETA} mins`)
        }
      } finally {
        setLoading(false)
      }
    }

    calculateDistanceAndETA()
  }, [report.id, report.location.lat, report.location.lng, report.distance, report.eta, onDistanceEtaUpdate])

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
                    <p className="text-sm text-gray-600 mb-4">
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

                {/* Distance and ETA Display Cards */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="glass-card bg-blue-50/50 border-blue-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Distance</p>
                        {loading ? (
                          <p className="text-lg font-bold text-gray-900">Calculating...</p>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">{distance || 'N/A'}</p>
                        )}
                      </div>
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="glass-card bg-green-50/50 border-green-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Estimated Time</p>
                        {loading ? (
                          <p className="text-lg font-bold text-gray-900">Calculating...</p>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">{eta || 'N/A'}</p>
                        )}
                      </div>
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
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

export default DirectionsModal

