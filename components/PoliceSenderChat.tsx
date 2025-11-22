import { useEffect, useState, useRef } from 'react'
import { MessageSquare } from 'lucide-react'

/**
 * Chat Message Interface
 */
interface ChatMessage {
  id?: string
  text: string
  timestamp: Date
  senderType: 'police' | 'sender'
}

interface PoliceSenderChatProps {
  className?: string
}

/**
 * Police-Sender Chat Component (Static Mock Version)
 * 
 * Displays static mock conversations between police and sender.
 * For UI representation only - no backend connectivity.
 */
const PoliceSenderChat = ({ className = '' }: PoliceSenderChatProps) => {
  // Component State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Mock Conversations for Static Display
  const MOCK_CONVERSATIONS: Record<string, ChatMessage[]> = {
    'general': [
      { id: 'p1', text: 'Hello, we have received your report. We are investigating.', timestamp: new Date('2025-11-20T08:00:00.000Z'), senderType: 'police' },
      { id: 's1', text: 'Thank you. Can you give me an update?', timestamp: new Date('2025-11-20T08:15:00.000Z'), senderType: 'sender' },
      { id: 'p2', text: 'Investigation is ongoing. We will contact you shortly.', timestamp: new Date('2025-11-20T09:30:00.000Z'), senderType: 'police' },
      { id: 's2', text: 'Okay, I will wait for your call.', timestamp: new Date('2025-11-20T09:45:00.000Z'), senderType: 'sender' },
      { id: 'p3', text: 'Thank you for your cooperation.', timestamp: new Date('2025-11-20T10:00:00.000Z'), senderType: 'police' },
    ]
  }

  // Format timestamp to relative time
  const formatTimestamp = (date: Date): string => {
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

  // Load mock conversations on component mount
  useEffect(() => {
    const convo = MOCK_CONVERSATIONS['general']
    if (convo && convo.length > 0) {
      const sorted = convo.slice().sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      setMessages(sorted)
    }
  }, [])

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-white shadow-md p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          📋 Mock Conversation Mode
        </h2>
        <p className="text-sm text-gray-600 mt-2">Displaying placeholder conversation data only</p>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
      >
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-lg">No messages to display</p>
          </div>
        )}

        {/* Messages List */}
        {messages.map((message) => (
          <div
            key={message.id || Math.random()}
            className={`flex ${
              message.senderType === 'police' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${
                message.senderType === 'police'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {/* Message Text */}
              <p className="text-sm font-medium mb-1 break-words">{message.text}</p>
              
              {/* Timestamp */}
              <p
                className={`text-xs mt-1 ${
                  message.senderType === 'police'
                    ? 'text-blue-100'
                    : 'text-gray-600'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PoliceSenderChat