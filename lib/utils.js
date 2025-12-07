import { AlertTriangle } from 'lucide-react'

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  return new Date(dateString).toLocaleString('en-US', defaultOptions)
}

/**
 * Format a timestamp to a relative time string
 * @param {Date|string} timestamp - Date object or ISO string
 * @returns {string} Relative time string (e.g., "2h ago", "just now")
 */
export const formatRelativeTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Get category icon component
 * @param {string} category - Report category
 * @returns {JSX.Element} Icon component
 */
export const getCategoryIcon = (category) => {
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

/**
 * Get category color class
 * @param {string} category - Report category
 * @returns {string} CSS class name
 */
export const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case 'crime':
      return 'text-red-600'
    case 'fire':
      return 'text-orange-600'
    case 'medical':
      return 'text-green-600'
    case 'traffic':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

/**
 * Get category color for map pins
 * @param {string} category - Report category
 * @returns {string} Hex color code
 */
export const getCategoryMapColor = (category) => {
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

/**
 * Get status badge configuration
 * @param {string} status - Report status
 * @returns {object} Status configuration with label and className
 */
export const getStatusConfig = (status) => {
  const statusMap = {
    pending: { label: 'Pending', className: 'status-pending' },
    acknowledged: { label: 'Acknowledged', className: 'status-acknowledged' },
    'en-route': { label: 'En Route', className: 'status-en-route' },
    resolved: { label: 'Resolved', className: 'status-resolved' },
    canceled: { label: 'Canceled', className: 'status-canceled' }
  }
  
  return statusMap[status] || { label: status, className: 'status-pending' }
}

/**
 * Get status color class
 * @param {string} status - Report status
 * @returns {string} CSS class name
 */
export const getStatusColor = (status) => {
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

