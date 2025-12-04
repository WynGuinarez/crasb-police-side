import { useEffect, useState, useRef } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

/**
 * Chat Message Interface
 */
interface ChatMessage {
  id?: string
  text: string
  timestamp: Date
  senderType: 'police' | 'sender'
}

interface ReportChatModalProps {
  report: {
    id: string
    reporterName: string
    category: string
    location: {
      address: string
    }
  }
  onClose: () => void
}

/**
 * Report Chat Modal Component (Static Mock Version)
 * 
 * Displays static mock conversations between police and reporters.
 * No backend connectivity - for UI representation only.
 * 
 * @component
 */
const ReportChatModal = ({ report, onClose }: ReportChatModalProps) => {
  // Component State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageText, setMessageText] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Fetch chat messages for a specific report.
   * METHOD: GET
   * ENDPOINT: /api/reports/:reportId/messages
   * 
   * Replace the call to TemporaryDatabase.chatConversations with the actual API call here.
   * Expected response format should match the ChatMessage[] interface.
   */
  // Load conversation on mount
  useEffect(() => {
    // TODO: Replace with API call: GET /api/reports/${report.id}/messages
    const keyByName = (report.reporterName || '').toString().replace(/\s+/g, '').toLowerCase()
    const convo = TemporaryDatabase.chatConversations[keyByName]
    if (convo && convo.length > 0) {
      // Sort chronologically (oldest -> newest)
      const sorted = convo.slice().sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      setMessages(sorted)
      // Scroll to bottom after render
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [report.reporterName])

  /**
   * Scroll chat container to bottom
   */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    // Format based on time difference
    if (diffMins < 1) {
      return 'Just now'
    } else if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle sending a new message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = messageText.trim()
    if (!text) return
    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      text,
      timestamp: new Date(),
      senderType: 'police', // Always police for modal
    }
    setMessages((prev) => [...prev, newMessage])
    setMessageText('')
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Chat - Report #{report.id}
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                {report.category} - {report.location.address}
              </p>
              <p className="text-sm mt-2">
                <span className="text-gray-600">Reporter: </span>
                <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {report.reporterName}
                </span>
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

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 glass-card p-4 mb-4">

            {/* Empty State */}
            {messages.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400 text-lg">No mock messages available for this reporter.</p>
              </div>
            )}

            {/* Messages List */}
            {messages.map((message) => (
              <div
                key={message.id || Math.random()}
                className={`flex ${
                  message.senderType === 'police' ? 'justify-end' : 'justify-start'
                }`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                    message.senderType === 'police'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-gray-300 text-gray-800'
                  }`}>
                  {/* Message Text */}
                  <p className="text-sm font-medium mb-1 break-words">{message.text}</p>
                  {/* Timestamp */}
                  <p
                    className={`text-xs mt-1 ${
                      message.senderType === 'police'
                        ? 'text-blue-100'
                        : 'text-gray-600'
                    }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="mt-4 bg-white border-t border-gray-200 p-3 rounded-b-lg flex items-center gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="px-6 py-2 bg-gradient-primary text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportChatModal

