import { useEffect, useState, useRef } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { initializeApp } from 'firebase/app'
import { getFirestore, Firestore, collection, query, orderBy, onSnapshot, addDoc, Timestamp, Unsubscribe } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

/**
 * Chat Message Interface
 * Represents a chat message document structure in Firestore
 */
interface ChatMessage {
  id?: string
  text: string
  timestamp: any // Firestore Timestamp
  senderType: 'police' | 'sender'
}

interface PoliceSenderChatProps {
  reportId?: string // Optional: link chat to a specific report
  className?: string
}

/**
 * Police-Sender Chat Component
 * 
 * A real-time, two-party chat system component that:
 * - Connects to Firebase Firestore for persistent storage
 * - Provides real-time message updates using onSnapshot
 * - Allows role switching between 'Police' and 'Sender'
 * - Displays messages in a responsive, styled chat interface
 * 
 * @component
 */
const PoliceSenderChat = ({ reportId, className = '' }: PoliceSenderChatProps) => {
  // Component State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentRole, setCurrentRole] = useState<'police' | 'sender'>('police')
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<Unsubscribe | null>(null)
  const firestoreRef = useRef<Firestore | null>(null)

  /**
   * Initialize Firebase and set up message listener
   */
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    let mounted = true

    const initializeChat = async () => {
      try {
        // Get global Firebase variables
        const appId = (window as any).__app_id || ''
        const firebaseConfig = (window as any).__firebase_config || null
        const initialAuthToken = (window as any).__initial_auth_token || ''

        // Check if Firebase is available
        if (!firebaseConfig) {
          throw new Error('Firebase configuration (__firebase_config) is not provided')
        }

        if (!appId) {
          throw new Error('App ID (__app_id) is not provided')
        }

        // Initialize Firebase App
        const firebaseApp = initializeApp(firebaseConfig)
        
        // Initialize Auth
        const auth = getAuth(firebaseApp)

        // Authenticate with custom token if provided
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(auth, initialAuthToken)
            console.log('Firebase authentication successful')
          } catch (authError: any) {
            console.warn('Custom token authentication failed:', authError)
            // Continue without authentication if token is invalid
          }
        }

        // Initialize Firestore
        const firestore = getFirestore(firebaseApp)
        firestoreRef.current = firestore

        // Construct collection path
        const messagesCollectionPath = `artifacts/${appId}/public/data/police_sender_chats`
        const messagesCollection = collection(firestore, messagesCollectionPath)
        
        // Query messages ordered by timestamp (ascending - oldest first)
        const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'))

        // Set up real-time listener
        const unsubscribe = onSnapshot(
          messagesQuery,
          (snapshot) => {
            if (!mounted) return

            const newMessages = snapshot.docs.map(doc => {
              const data = doc.data()
              return {
                id: doc.id,
                text: data.text || '',
                timestamp: data.timestamp,
                senderType: data.senderType as 'police' | 'sender'
              }
            })
            
            setMessages(newMessages)
            setLoading(false)
            setError(null)
            
            // Scroll to bottom on new messages
            setTimeout(() => scrollToBottom(), 100)
          },
          (error) => {
            if (!mounted) return
            console.error('Firestore listener error:', error)
            setError(`Failed to load messages: ${error.message}`)
            setLoading(false)
          }
        )

        unsubscribeRef.current = unsubscribe
        setIsInitialized(true)
        setLoading(false)
      } catch (err: any) {
        console.error('Initialization error:', err)
        setError(`Failed to initialize: ${err.message || 'Unknown error'}`)
        setLoading(false)
      }
    }

    initializeChat()

    return () => {
      mounted = false
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  /**
   * Scroll chat container to bottom
   */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  /**
   * Send a new message to Firestore
   */
  const sendMessage = async () => {
    const text = messageText.trim()
    
    if (!text) {
      return
    }

    if (!isInitialized || !firestoreRef.current) {
      setError('Firebase not initialized. Please refresh the page.')
      return
    }

    // Get appId from window
    const appId = typeof window !== 'undefined' ? (window as any).__app_id || '' : ''
    if (!appId) {
      setError('App ID not found. Please refresh the page.')
      return
    }

    try {
      const firestore = firestoreRef.current
      const messagesCollectionPath = `artifacts/${appId}/public/data/police_sender_chats`
      const messagesCollection = collection(firestore, messagesCollectionPath)
      
      const newMessage = {
        text: text,
        timestamp: Timestamp.now(),
        senderType: currentRole
      }

      await addDoc(messagesCollection, newMessage)
      
      // Clear input after successful send
      setMessageText('')
      toast.success('Message sent!')
    } catch (error: any) {
      console.error('Error sending message:', error)
      const errorMessage = `Failed to send message: ${error.message || 'Unknown error'}`
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) {
      return ''
    }

    // Handle Firestore Timestamp
    let date: Date
    if (timestamp.toDate) {
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000)
    } else {
      date = new Date(timestamp)
    }

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
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
      // Format as date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  }

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-white shadow-md p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Police-Sender Chat
        </h2>
        
        {/* Role Selection Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Current Role:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setCurrentRole('police')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                currentRole === 'police'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              👮 Police
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole('sender')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                currentRole === 'sender'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📱 Sender
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
      >
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-lg">No messages yet. Start the conversation!</p>
          </div>
        )}

        {/* Messages List */}
        {!loading && messages.map((message) => (
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

      {/* Message Input Section */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || !isInitialized}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || loading || !isInitialized}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Sending as: <span className="font-semibold">
            {currentRole === 'police' ? '👮 Police' : '📱 Sender'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default PoliceSenderChat

