import { useEffect, useState, useRef } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { initializeApp } from 'firebase/app'
import { getFirestore, Firestore, collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, Unsubscribe } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

/**
 * Chat Message Interface
 */
interface ChatMessage {
  id?: string
  text: string
  timestamp: any // Firestore Timestamp
  userId?: string
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
  userId: string // Current user ID for unique chat path
  onClose: () => void
}

/**
 * Report Chat Modal Component
 * 
 * A per-user chat interface for a specific report.
 * Chat messages are stored in: /artifacts/{__app_id}/public/data/active_reports/{reportId}/chats/{userId}
 * 
 * @component
 */
const ReportChatModal = ({ report, userId, onClose }: ReportChatModalProps) => {
  // Component State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<Unsubscribe | null>(null)
  const firestoreRef = useRef<Firestore | null>(null)
  
  // Always use 'police' as the sender type since the user is always the police
  const currentRole: 'police' = 'police'
  /**
   * Mock conversations keyed by reporter identifier (reporterName or report.id)
   * Each entry is a full conversation (both reporter and police messages).
   * These messages are local-only mock data and do not write to Firestore.
   */
  const MOCK_CONVERSATIONS: Record<string, ChatMessage[]> = {
    // keyed by reporter name (lowercase)
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

  // Automatically populate messages from mock conversation for the current reporter
  // Use reporterName (lowercased, spaces removed) as the key when available; fall back to report.id
  useEffect(() => {
    try {
      const keyById = (report.id || '').toString().toLowerCase()
      const keyByName = (report.reporterName || '').toString().replace(/\s+/g, '').toLowerCase()
      const convo = MOCK_CONVERSATIONS[keyById] || MOCK_CONVERSATIONS[keyByName]
      if (convo && convo.length > 0) {
        // ensure chronological order (oldest -> newest)
        const merged = convo.slice().sort((a, b) => {
          const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : (a.timestamp && (a.timestamp.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime()))
          const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : (b.timestamp && (b.timestamp.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime()))
          return ta - tb
        })
        setMessages(merged)
        setLoading(false)
        setError(null)
        setTimeout(() => scrollToBottom(), 100)
      }
    } catch (err) {
      // ignore mock population errors
    }
    // run once on mount or when report changes
  }, [report.id, report.reporterName])

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
          throw new Error(
            'Firebase configuration is missing. Please set NEXT_PUBLIC_FIREBASE_API_KEY and other Firebase environment variables. ' +
            'See lib/firebase-config.ts for configuration details.'
          )
        }

        if (!appId) {
          throw new Error(
            'App ID is missing. Please set NEXT_PUBLIC_APP_ID environment variable. ' +
            'See lib/firebase-config.ts for configuration details.'
          )
        }

        if (!report.id || !userId) {
          throw new Error('Report ID or User ID is missing')
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

  // Construct chat collection path for the report
  // Path: /artifacts/{appId}/public/data/active_reports/{reportId}/chats
  // Messages are stored in this collection; we filter by userId so each police user
  // only sees messages relevant to their session.
  const chatCollectionPath = `artifacts/${appId}/public/data/active_reports/${report.id}/chats`
  const chatCollection = collection(firestore, chatCollectionPath)

  // Query messages ordered by timestamp (ascending - oldest first) and filtered by userId
  const chatQuery = query(chatCollection, where('userId', '==', userId), orderBy('timestamp', 'asc'))

        // Set up real-time listener
        const unsubscribe = onSnapshot(
          chatQuery,
          (snapshot) => {
            if (!mounted) return
            // If there are no live messages, try to use the per-reporter mock conversation
            if (snapshot.empty) {
              try {
                const key = (report.reporterName || report.id || '').toString().replace(/\s+/g, '').toLowerCase()
                const mock = MOCK_CONVERSATIONS[key]
                if (mock && mock.length > 0) {
                  // Ensure mock is sorted chronologically
                  const merged = mock.slice().sort((a, b) => {
                    const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : (a.timestamp && (a.timestamp.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime()))
                    const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : (b.timestamp && (b.timestamp.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime()))
                    return ta - tb
                  })
                  setMessages(merged)
                } else {
                  setMessages([])
                }
              } catch (err) {
                setMessages([])
              }
            } else {
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
            }

            setLoading(false)
            setError(null)

            // Scroll to bottom on new messages
            setTimeout(() => scrollToBottom(), 100)
          },
          (error) => {
            if (!mounted) return
            console.error('Chat listener error:', error)
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
  }, [report.id, userId])

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
      setError('Chat not initialized. Please close and reopen the chat.')
      return
    }

    // Get appId from window
    const appId = typeof window !== 'undefined' ? (window as any).__app_id || '' : ''
    if (!appId) {
      setError('App ID not found. Please refresh the page.')
      return
    }

    // Optimistically clear the input so the user can type the next message immediately.
    // Preserve the message text in a local variable for sending and potential restore on error.
    const messageToSend = text
    setMessageText('')

    try {
      const firestore = firestoreRef.current
      // Use the report-level chats collection and include userId on each message
      const chatCollectionPath = `artifacts/${appId}/public/data/active_reports/${report.id}/chats`
      const chatCollection = collection(firestore, chatCollectionPath)

      const newMessage = {
        text: messageToSend,
        timestamp: Timestamp.now(),
        senderType: currentRole,
        userId: userId
      }

      await addDoc(chatCollection, newMessage)

      toast.success('Message sent!')
    } catch (error: any) {
      console.error('Error sending message:', error)
      const errorMessage = `Failed to send message: ${error.message || 'Unknown error'}`
      setError(errorMessage)
      toast.error(errorMessage)

      // Restore the message text so the user doesn't lose what they typed
      setMessageText(messageToSend)

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl max-h-[90vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}>
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
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p>Loading messages...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
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
          <div className="glass-card">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || !isInitialized}
                  placeholder="Type your message..."
                  className="input-field flex-1"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || loading || !isInitialized}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                <span className="font-semibold text-primary-600">👮 Sending as Police</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportChatModal

