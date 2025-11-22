import { useEffect, useState, useRef } from 'react'
import { MessageSquare, X } from 'lucide-react'

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

  /**
   * Mock conversations keyed by reporter identifier (reporterName)
   * Each entry is a full conversation (both reporter and police messages).
   */
  const MOCK_CONVERSATIONS: Record<string, ChatMessage[]> = {
    'rodellingcopines': [
      { id: 'r1', text: 'saklulu pakibilis', timestamp: new Date('2025-11-22T11:41:00.000Z'), senderType: 'sender' },
      { id: 'p1', text: 'wait lang en route na', timestamp: new Date('2025-11-22T12:01:00.000Z'), senderType: 'police' },
      { id: 'r2', text: 'asan na kayo tukmol', timestamp: new Date('2025-11-22T14:11:00.000Z'), senderType: 'sender' },
      { id: 'p2', text: 'saglit traffic', timestamp: new Date('2025-11-22T15:20:00.000Z'), senderType: 'police' }
    ],
    'wynguinarez': [
      { id: 'r1', text: 'asan na kayo tukmol', timestamp: new Date('2025-11-22T14:11:00.000Z'), senderType: 'sender' },
      { id: 'p1', text: 'wait lang en route na', timestamp: new Date('2025-11-22T12:01:00.000Z'), senderType: 'police' },
      { id: 'p2', text: 'pwede bang ilapit ang sasakyan sa gilid?', timestamp: new Date('2025-11-22T14:16:00.000Z'), senderType: 'police' },
      { id: 'p3', text: 'copy, magpapadala ng backup', timestamp: new Date('2025-11-22T14:19:10.000Z'), senderType: 'police' },
      { id: 'p4', text: 'saglit traffic', timestamp: new Date('2025-11-22T15:20:00.000Z'), senderType: 'police' }
    ],
    'abramlukemora': [
      { id: 'r1', text: 'may nahulog na tao sa kalsada', timestamp: new Date('2025-11-22T16:05:00.000Z'), senderType: 'sender' },
      { id: 'p1', text: 'papunta ang medical team', timestamp: new Date('2025-11-22T16:07:30.000Z'), senderType: 'police' }
    ],
    'johnkrystiannedavid': [
      { id: 'r1', text: 'may sunog sa 123 University Ave', timestamp: new Date('2025-11-23T07:05:10.000Z'), senderType: 'sender' },
      { id: 'p1', text: 'papunta agad ang rescue team', timestamp: new Date('2025-11-23T07:08:00.000Z'), senderType: 'police' }
    ],
    'johndenzelbolito': [
      { id: 'r1', text: 'accident lang, walang buhay na nasalba', timestamp: new Date('2025-11-24T09:30:00.000Z'), senderType: 'sender' },
      { id: 'p1', text: 'tawagin na namin ang tow truck', timestamp: new Date('2025-11-24T09:33:30.000Z'), senderType: 'police' }
    ],
    'jmarkgeralddagode': [
      { id: 'r1', text: 'may natangay na pet sa baha', timestamp: new Date('2025-11-25T17:05:00.000Z'), senderType: 'sender' },
      { id: 'p1', text: 'ito na kami magche-check', timestamp: new Date('2025-11-25T17:12:00.000Z'), senderType: 'police' }
    ]
  }

  // Load mock conversation on mount
  useEffect(() => {
    const keyByName = (report.reporterName || '').toString().replace(/\s+/g, '').toLowerCase()
    const convo = MOCK_CONVERSATIONS[keyByName]
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
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                    message.senderType === 'police'
                      ? 'bg-blue-500 text-white'
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
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
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

