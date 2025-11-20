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
 * Report Interface
 * Represents an active report document structure in Firestore
 */
interface Report {
  id?: string;
  reportId: string;
  category: string;
  location: string;
  status: string;
  time: Timestamp;
}

/**
 * Chat Message Interface
 * Represents a chat message in a report's chat subcollection
 */
interface ChatMessage {
  id?: string;
  text: string;
  timestamp: Timestamp;
  senderType: 'police' | 'sender';
}

/**
 * Active Reports Dashboard Component
 * 
 * A complete dashboard application that:
 * - Displays active reports in real-time from Firestore
 * - Provides per-report chat functionality
 * - Uses Firebase Firestore for persistent storage
 * - Implements real-time updates using onSnapshot
 * - FIXED: Correctly uses collection references (not document references)
 * 
 * @component
 * @standalone
 */
@Component({
  selector: 'app-active-reports-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <!-- Header -->
      <header class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-lg font-bold">C</span>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Active Reports Dashboard</h1>
            </div>
            <div class="text-sm text-gray-600">
              Real-Time Monitoring
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center items-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading reports...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p class="font-bold">Error:</p>
          <p>{{ error }}</p>
        </div>

        <!-- Reports Table -->
        <div *ngIf="!loading && !error" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Active Reports</h2>
              <span class="text-sm text-gray-600">{{ reports.length }} total reports</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let report of reports" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="getCategoryClass(report.category)">
                        {{ report.category }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ report.location }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="getStatusClass(report.status)">
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatTimestamp(report.time) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="openChat(report)"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      Open Chat
                    </button>
                  </td>
                </tr>
                <tr *ngIf="reports.length === 0">
                  <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                    No active reports found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Chat Modal -->
      <div *ngIf="showChatModal && selectedReport" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
           (click)="closeChat()">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
             (click)="$event.stopPropagation()">
          <!-- Chat Header -->
          <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Chat - Report #{{ selectedReport.reportId }}</h3>
              <p class="text-sm text-blue-100">{{ selectedReport.category }} - {{ selectedReport.location }}</p>
            </div>
            <button
              (click)="closeChat()"
              class="text-white hover:text-gray-200 transition-colors">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Chat Content -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Role Selection -->
            <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div class="flex items-center justify-center space-x-4">
                <span class="text-sm font-medium text-gray-700">Current Role:</span>
                <div class="flex bg-white rounded-lg p-1 shadow-sm">
                  <button
                    type="button"
                    [class.bg-blue-500]="currentChatRole === 'police'"
                    [class.text-white]="currentChatRole === 'police'"
                    [class.text-gray-700]="currentChatRole !== 'police'"
                    [class.bg-white]="currentChatRole !== 'police'"
                    class="px-6 py-2 rounded-md font-medium transition-all duration-200"
                    (click)="setChatRole('police')">
                    👮 Police
                  </button>
                  <button
                    type="button"
                    [class.bg-gray-500]="currentChatRole === 'sender'"
                    [class.text-white]="currentChatRole === 'sender'"
                    [class.text-gray-700]="currentChatRole !== 'sender'"
                    [class.bg-white]="currentChatRole !== 'sender'"
                    class="px-6 py-2 rounded-md font-medium transition-all duration-200"
                    (click)="setChatRole('sender')">
                    📱 Sender
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Container -->
            <div 
              #chatMessagesContainer
              class="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              <!-- Loading State -->
              <div *ngIf="chatLoading" class="flex justify-center items-center h-full">
                <div class="text-gray-500">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p>Loading messages...</p>
                </div>
              </div>

              <!-- Error State -->
              <div *ngIf="chatError && !chatLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p class="font-bold">Error:</p>
                <p>{{ chatError }}</p>
              </div>

              <!-- Empty State -->
              <div *ngIf="!chatLoading && !chatError && chatMessages.length === 0" class="flex justify-center items-center h-full">
                <p class="text-gray-400 text-lg">No messages yet. Start the conversation!</p>
              </div>

              <!-- Messages List -->
              <div *ngFor="let message of chatMessages" 
                   class="flex" 
                   [ngClass]="{
                     'justify-end': message.senderType === 'police',
                     'justify-start': message.senderType === 'sender'
                   }">
                <div 
                  class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md"
                  [ngClass]="{
                    'bg-blue-500 text-white': message.senderType === 'police',
                    'bg-gray-300 text-gray-800': message.senderType === 'sender'
                  }">
                  <!-- Message Text -->
                  <p class="text-sm font-medium mb-1 break-words">{{ message.text }}</p>
                  
                  <!-- Timestamp -->
                  <p 
                    class="text-xs mt-1"
                    [ngClass]="{
                      'text-blue-100': message.senderType === 'police',
                      'text-gray-600': message.senderType === 'sender'
                    }">
                    {{ formatChatTimestamp(message.timestamp) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="bg-white border-t border-gray-200 p-4">
              <form (ngSubmit)="sendChatMessage()" class="flex space-x-2">
                <input
                  type="text"
                  [(ngModel)]="chatMessageText"
                  [disabled]="chatLoading || !chatInitialized"
                  placeholder="Type your message..."
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  name="chatInput"
                  maxlength="500">
                <button
                  type="submit"
                  [disabled]="!chatMessageText.trim() || chatLoading || !chatInitialized"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                  Send
                </button>
              </form>
              <p class="text-xs text-gray-500 mt-2 text-center">
                Sending as: <span class="font-semibold">{{ currentChatRole === 'police' ? '👮 Police' : '📱 Sender' }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class ActiveReportsDashboardComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;

  // Dashboard State
  reports: Report[] = [];
  loading: boolean = true;
  error: string | null = null;
  private unsubscribeReports?: Unsubscribe;

  // Chat State
  showChatModal: boolean = false;
  selectedReport: Report | null = null;
  chatMessages: ChatMessage[] = [];
  currentChatRole: 'police' | 'sender' = 'police';
  chatMessageText: string = '';
  chatLoading: boolean = false;
  chatError: string | null = null;
  chatInitialized: boolean = false;
  private unsubscribeChat?: Unsubscribe;
  private shouldScrollChat: boolean = false;

  // Firebase Services
  private firestore!: Firestore;
  private firebaseApp!: FirebaseApp;
  private auth!: Auth;
  private reportsCollectionPath: string = '';

  // Global Firebase Variables (expected to be provided)
  private readonly appId: string = (window as any).__app_id || '';
  private readonly firebaseConfig: any = (window as any).__firebase_config || null;
  private readonly initialAuthToken: string = (window as any).__initial_auth_token || '';

  constructor() {
    // Constructor is kept minimal - initialization happens in ngOnInit
  }

  /**
   * Component Initialization
   * Sets up Firebase connection and starts listening to reports
   */
  async ngOnInit(): Promise<void> {
    try {
      await this.initializeFirebase();
      this.setupReportsListener();
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
    if (this.unsubscribeReports) {
      this.unsubscribeReports();
    }
    if (this.unsubscribeChat) {
      this.unsubscribeChat();
    }
  }

  /**
   * Auto-scroll chat to bottom after view updates
   */
  ngAfterViewChecked(): void {
    if (this.shouldScrollChat) {
      this.scrollChatToBottom();
      this.shouldScrollChat = false;
    }
  }

  /**
   * Initialize Firebase Application and Authentication
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
      }
    }

    // Initialize Firestore
    this.firestore = new Firestore(this.firebaseApp);

    // Construct reports collection path
    this.reportsCollectionPath = `artifacts/${this.appId}/public/data/active_reports`;
  }

  /**
   * Setup Real-time Reports Listener
   * Uses onSnapshot to listen for changes in Firestore collection
   */
  private setupReportsListener(): void {
    const reportsCollection = collection(this.firestore, this.reportsCollectionPath);
    
    // Query reports ordered by time (descending - newest first)
    const reportsQuery = query(reportsCollection, orderBy('time', 'desc'));

    // Set up real-time listener
    this.unsubscribeReports = onSnapshot(
      reportsQuery,
      (snapshot) => {
        this.reports = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            reportId: data['reportId'] || doc.id, // Use doc.id as fallback for reportId
            category: data['category'] || '',
            location: data['location'] || '',
            status: data['status'] || '',
            time: data['time'] as Timestamp
          };
        });
        
        this.loading = false;
        this.error = null;
      },
      (error) => {
        console.error('Firestore listener error:', error);
        this.error = `Failed to load reports: ${error.message}`;
        this.loading = false;
      }
    );
  }

  /**
   * Open Chat Modal for a specific report
   */
  openChat(report: Report): void {
    this.selectedReport = report;
    this.showChatModal = true;
    this.chatMessages = [];
    this.chatMessageText = '';
    this.chatError = null;
    this.chatLoading = true;
    this.chatInitialized = false;
    this.currentChatRole = 'police';
    
    // Setup chat listener
    this.setupChatListener(report.reportId || report.id || '');
  }

  /**
   * Close Chat Modal
   */
  closeChat(): void {
    this.showChatModal = false;
    this.selectedReport = null;
    
    // Unsubscribe from chat listener
    if (this.unsubscribeChat) {
      this.unsubscribeChat();
      this.unsubscribeChat = undefined;
    }
  }

  /**
   * Setup Real-time Chat Listener for a specific report
   * CRITICAL FIX: Uses correct collection path (odd number of segments)
   * Path: /artifacts/{appId}/public/data/active_reports/{reportId}/chats
   * This is a COLLECTION reference, not a document reference
   */
  private setupChatListener(reportId: string): void {
    if (!this.firestore || !reportId) {
      this.chatError = 'Firestore not initialized or report ID missing';
      this.chatLoading = false;
      return;
    }

    try {
      // CRITICAL FIX: Construct the correct collection path
      // The path must have an ODD number of segments to be a collection
      // Path structure: artifacts/{appId}/public/data/active_reports/{reportId}/chats
      // Segments: 1. artifacts, 2. {appId}, 3. public, 4. data, 5. active_reports, 6. {reportId}, 7. chats
      // Total: 7 segments (ODD) = COLLECTION ✓
      
      const chatCollectionPath = `${this.reportsCollectionPath}/${reportId}/chats`;
      
      // Create collection reference (not document reference)
      const chatCollection = collection(this.firestore, chatCollectionPath);
      
      // Verify it's a collection by checking the path
      console.log('Chat collection path:', chatCollectionPath);
      console.log('Path segments count:', chatCollectionPath.split('/').length);
      
      // Query messages ordered by timestamp (ascending - oldest first)
      const chatQuery = query(chatCollection, orderBy('timestamp', 'asc'));

      // Set up real-time listener
      this.unsubscribeChat = onSnapshot(
        chatQuery,
        (snapshot) => {
          this.chatMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data['text'] || '',
              timestamp: data['timestamp'] as Timestamp,
              senderType: data['senderType'] as 'police' | 'sender'
            };
          });
          
          // Trigger scroll to bottom on new messages
          this.shouldScrollChat = true;
          this.chatLoading = false;
          this.chatError = null;
          this.chatInitialized = true;
        },
        (error) => {
          console.error('Chat listener error:', error);
          this.chatError = `Failed to load messages: ${error.message}`;
          this.chatLoading = false;
        }
      );
    } catch (err: any) {
      console.error('Error setting up chat listener:', err);
      this.chatError = `Failed to setup chat: ${err.message || 'Unknown error'}`;
      this.chatLoading = false;
    }
  }

  /**
   * Send a chat message to Firestore
   * CRITICAL FIX: Uses the same correct collection path
   */
  async sendChatMessage(): Promise<void> {
    const text = this.chatMessageText.trim();
    
    if (!text || !this.selectedReport) {
      return;
    }

    if (!this.chatInitialized || !this.firestore) {
      this.chatError = 'Chat not initialized. Please close and reopen the chat.';
      return;
    }

    try {
      const reportId = this.selectedReport.reportId || this.selectedReport.id || '';
      if (!reportId) {
        throw new Error('Report ID is missing');
      }

      // CRITICAL FIX: Use the same collection path structure
      const chatCollectionPath = `${this.reportsCollectionPath}/${reportId}/chats`;
      const chatCollection = collection(this.firestore, chatCollectionPath);
      
      const newMessage = {
        text: text,
        timestamp: Timestamp.now(),
        senderType: this.currentChatRole
      };

      await addDoc(chatCollection, newMessage);
      
      // Clear input after successful send
      this.chatMessageText = '';
    } catch (error: any) {
      console.error('Error sending message:', error);
      this.chatError = `Failed to send message: ${error.message || 'Unknown error'}`;
      
      // Clear error after 5 seconds
      setTimeout(() => {
        this.chatError = null;
      }, 5000);
    }
  }

  /**
   * Set the current chat role
   */
  setChatRole(role: 'police' | 'sender'): void {
    this.currentChatRole = role;
  }

  /**
   * Get CSS class for category badge
   */
  getCategoryClass(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Crime': 'bg-red-100 text-red-800',
      'Fire': 'bg-orange-100 text-orange-800',
      'Medical': 'bg-green-100 text-green-800',
      'Traffic': 'bg-yellow-100 text-yellow-800'
    };
    return categoryMap[category] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get CSS class for status badge
   */
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Acknowledged': 'bg-blue-100 text-blue-800',
      'En Route': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Canceled': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Format timestamp for report display
   */
  formatTimestamp(timestamp: Timestamp): string {
    if (!timestamp) {
      return '';
    }

    const date = timestamp.toDate();
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format timestamp for chat message display
   */
  formatChatTimestamp(timestamp: Timestamp): string {
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
   */
  private scrollChatToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        const element = this.chatMessagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.warn('Failed to scroll chat to bottom:', err);
    }
  }
}

