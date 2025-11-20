import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  Unsubscribe 
} from '@angular/fire/firestore';
import { initializeApp, FirebaseApp } from '@angular/fire/app';
import { getAuth, signInWithCustomToken, Auth } from '@angular/fire/auth';

/**
 * Message Interface
 * Represents a chat message document structure in Firestore
 */
interface ChatMessage {
  id?: string;
  text: string;
  timestamp: Timestamp;
  senderType: 'police' | 'sender';
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
 * @standalone
 */
@Component({
  selector: 'app-police-sender-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white shadow-md p-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Police-Sender Chat</h1>
        
        <!-- Role Selection Toggle -->
        <div class="flex items-center justify-center space-x-4">
          <span class="text-sm font-medium text-gray-700">Current Role:</span>
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              [class.bg-blue-500]="currentRole === 'police'"
              [class.text-white]="currentRole === 'police'"
              [class.text-gray-700]="currentRole !== 'police'"
              [class.bg-white]="currentRole !== 'police'"
              class="px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              (click)="setRole('police')"
            >
              👮 Police
            </button>
            <button
              type="button"
              [class.bg-gray-500]="currentRole === 'sender'"
              [class.text-white]="currentRole === 'sender'"
              [class.text-gray-700]="currentRole !== 'sender'"
              [class.bg-white]="currentRole !== 'sender'"
              class="px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              (click)="setRole('sender')"
            >
              📱 Sender
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Messages Container -->
      <div 
        #chatContainer
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center items-center h-full">
          <div class="text-gray-500">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Loading messages...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p class="font-bold">Error:</p>
          <p>{{ error }}</p>
        </div>

        <!-- Messages List -->
        <div *ngIf="!loading && !error && messages.length === 0" class="flex justify-center items-center h-full">
          <p class="text-gray-400 text-lg">No messages yet. Start the conversation!</p>
        </div>

        <div *ngFor="let message of messages" class="flex" [ngClass]="{
          'justify-end': message.senderType === 'police',
          'justify-start': message.senderType === 'sender'
        }">
          <div 
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md"
            [ngClass]="{
              'bg-blue-500 text-white': message.senderType === 'police',
              'bg-gray-300 text-gray-800': message.senderType === 'sender'
            }"
          >
            <!-- Message Text -->
            <p class="text-sm font-medium mb-1 break-words">{{ message.text }}</p>
            
            <!-- Timestamp -->
            <p 
              class="text-xs mt-1"
              [ngClass]="{
                'text-blue-100': message.senderType === 'police',
                'text-gray-600': message.senderType === 'sender'
              }"
            >
              {{ formatTimestamp(message.timestamp) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Message Input Section -->
      <div class="bg-white border-t border-gray-200 p-4">
        <form (ngSubmit)="sendMessage()" class="flex space-x-2">
          <input
            type="text"
            [(ngModel)]="messageText"
            [disabled]="loading || !isInitialized"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            name="messageInput"
            maxlength="500"
          />
          <button
            type="submit"
            [disabled]="!messageText.trim() || loading || !isInitialized"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Send
          </button>
        </form>
        <p class="text-xs text-gray-500 mt-2 text-center">
          Sending as: <span class="font-semibold">{{ currentRole === 'police' ? '👮 Police' : '📱 Sender' }}</span>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class PoliceSenderChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  // Component State
  messages: ChatMessage[] = [];
  currentRole: 'police' | 'sender' = 'police';
  messageText: string = '';
  loading: boolean = true;
  error: string | null = null;
  isInitialized: boolean = false;
  private shouldScrollToBottom: boolean = false;

  // Firebase Services
  private firestore!: Firestore;
  private firebaseApp!: FirebaseApp;
  private auth!: Auth;
  private unsubscribeMessages?: Unsubscribe;
  private messagesCollectionPath: string = '';

  // Global Firebase Variables (expected to be provided)
  private readonly appId: string = (window as any).__app_id || '';
  private readonly firebaseConfig: any = (window as any).__firebase_config || null;
  private readonly initialAuthToken: string = (window as any).__initial_auth_token || '';

  constructor() {
    // Constructor is kept minimal - initialization happens in ngOnInit
  }

  /**
   * Component Initialization
   * Sets up Firebase connection and starts listening to messages
   */
  async ngOnInit(): Promise<void> {
    try {
      await this.initializeFirebase();
      this.setupMessagesListener();
      this.isInitialized = true;
      this.loading = false;
    } catch (err: any) {
      console.error('Initialization error:', err);
      this.error = `Failed to initialize: ${err.message || 'Unknown error'}`;
      this.loading = false;
    }
  }

  /**
   * Cleanup on Component Destruction
   * Unsubscribes from Firestore listeners to prevent memory leaks
   */
  ngOnDestroy(): void {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }
  }

  /**
   * Auto-scroll to bottom after view updates
   * Ensures new messages are visible
   */
  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * Initialize Firebase Application and Authentication
   * Uses global variables for configuration
   */
  private async initializeFirebase(): Promise<void> {
    if (!this.firebaseConfig) {
      throw new Error('Firebase configuration (__firebase_config) is not provided');
    }

    if (!this.appId) {
      throw new Error('App ID (__app_id) is not provided');
    }

    // Initialize Firebase App
    this.firebaseApp = initializeApp(this.firebaseConfig);
    
    // Initialize Auth
    this.auth = getAuth(this.firebaseApp);

    // Authenticate with custom token if provided
    if (this.initialAuthToken) {
      try {
        await signInWithCustomToken(this.auth, this.initialAuthToken);
        console.log('Firebase authentication successful');
      } catch (authError: any) {
        console.warn('Custom token authentication failed:', authError);
        // Continue without authentication if token is invalid
        // In production, you may want to handle this differently
      }
    }

    // Initialize Firestore
    this.firestore = new Firestore(this.firebaseApp);

    // Construct collection path
    this.messagesCollectionPath = `artifacts/${this.appId}/public/data/police_sender_chats`;
  }

  /**
   * Setup Real-time Message Listener
   * Uses onSnapshot to listen for changes in Firestore collection
   */
  private setupMessagesListener(): void {
    const messagesCollection = collection(this.firestore, this.messagesCollectionPath);
    
    // Query messages ordered by timestamp (ascending - oldest first)
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));

    // Set up real-time listener
    this.unsubscribeMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        this.messages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data['text'] || '',
            timestamp: data['timestamp'] as Timestamp,
            senderType: data['senderType'] as 'police' | 'sender'
          };
        });
        
        // Trigger scroll to bottom on new messages
        this.shouldScrollToBottom = true;
        this.loading = false;
        this.error = null;
      },
      (error) => {
        console.error('Firestore listener error:', error);
        this.error = `Failed to load messages: ${error.message}`;
        this.loading = false;
      }
    );
  }

  /**
   * Send a new message to Firestore
   * Validates input and creates a new document in the collection
   */
  async sendMessage(): Promise<void> {
    const text = this.messageText.trim();
    
    if (!text) {
      return;
    }

    if (!this.isInitialized || !this.firestore) {
      this.error = 'Firebase not initialized. Please refresh the page.';
      return;
    }

    try {
      const messagesCollection = collection(this.firestore, this.messagesCollectionPath);
      
      const newMessage: Omit<ChatMessage, 'id'> = {
        text: text,
        timestamp: Timestamp.now(),
        senderType: this.currentRole
      };

      await addDoc(messagesCollection, newMessage);
      
      // Clear input after successful send
      this.messageText = '';
    } catch (error: any) {
      console.error('Error sending message:', error);
      this.error = `Failed to send message: ${error.message || 'Unknown error'}`;
      
      // Clear error after 5 seconds
      setTimeout(() => {
        this.error = null;
      }, 5000);
    }
  }

  /**
   * Set the current user role
   * @param role - Either 'police' or 'sender'
   */
  setRole(role: 'police' | 'sender'): void {
    this.currentRole = role;
  }

  /**
   * Format timestamp for display
   * Converts Firestore Timestamp to readable date/time string
   * @param timestamp - Firestore Timestamp object
   * @returns Formatted date/time string
   */
  formatTimestamp(timestamp: Timestamp): string {
    if (!timestamp) {
      return '';
    }

    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Format based on time difference
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // Format as date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  }

  /**
   * Scroll chat container to bottom
   * Ensures latest messages are visible
   */
  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        const element = this.chatContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.warn('Failed to scroll to bottom:', err);
    }
  }
}

