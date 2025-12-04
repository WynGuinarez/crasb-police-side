/**
 * Temporary Local Database Collection
 *
 * This object holds all static and hard-coded data
 * that will eventually be fetched from a real backend API.
 * The application should reference data here, not directly embed it.
 *
 * IMPORTANT: All data in this file should be replaced with actual API calls
 * when the backend is ready. See individual component files for API integration points.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Report {
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
  distance?: string
  eta?: string
}

export interface Checkpoint {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    address: string
  }
  assignedOfficers: string[]
  schedule: string
  timeStart: string
  timeEnd: string
  status: 'active' | 'inactive'
  contactNumber: string
}

export interface ResolvedCase {
  id: string
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  category: string
  city: string
  barangay: string
  location: {
    address: string
    lat: number
    lng: number
  }
  description: string
  dateReported: string
  dateResolved: string
  resolutionTime: string
  finalStatus: string
  resolutionNotes?: string
}

export interface ChatMessage {
  id?: string
  text: string
  timestamp: Date
  senderType: 'police' | 'sender'
}

export interface TopLocation {
  city: string
  barangay: string
  count: number
  percentage: number
}

export interface CategoryStat {
  category: string
  count: number
  percentage: number
}

export interface TimeStat {
  period: string
  count: number
}

// ============================================================================
// TEMPORARY DATABASE COLLECTION
// ============================================================================

export const TemporaryDatabase = {
  // ==========================================================================
  // ACTIVE REPORTS DATA
  // ==========================================================================
  activeReports: [
    {
      id: '1',
      reporterName: 'Rodel Lingcopines',
      reporterPhone: '+63 912 345 6789',
      reporterEmail: 'Lingcopines@email.com',
      city: 'Manila',
      barangay: 'Malate',
      category: 'Crime',
      status: 'pending' as const,
      description: 'Suspicious activity near the park. Two individuals acting suspiciously around parked vehicles.',
      location: {
        lat: 14.5995,
        lng: 120.9842,
        address: 'Rizal Park, Malate, Manila'
      },
      attachments: ['image1.jpg', 'video1.mp4'],
      emergencyContact: {
        name: 'Rodel Lingcopines',
        phone: '+63 912 345 6790'
      },
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      reporterName: 'Wyn Guinarez',
      reporterPhone: '+63 917 123 4567',
      reporterEmail: 'wynguinarez@email.com',
      city: 'Quezon City',
      barangay: 'Diliman',
      category: 'Fire',
      status: 'acknowledged' as const,
      description: 'Fire alarm triggered in residential building. Smoke visible from 3rd floor.',
      location: {
        lat: 14.6539,
        lng: 121.0689,
        address: '123 University Ave, Diliman, Quezon City'
      },
      attachments: ['fire_image.jpg'],
      emergencyContact: {
        name: 'Wyn Guinarez',
        phone: '+63 917 123 4568'
      },
      timestamp: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      reporterName: 'Abram Luke Mora',
      reporterPhone: '+63 918 765 4321',
      reporterEmail: 'ambram.mora@email.com',
      city: 'Makati',
      barangay: 'Ayala',
      category: 'Medical',
      status: 'en-route' as const,
      description: 'Medical emergency at office building. Person collapsed and needs immediate medical attention.',
      location: {
        lat: 14.5547,
        lng: 121.0244,
        address: 'Ayala Avenue, Makati City'
      },
      attachments: [],
      emergencyContact: {
        name: 'Abram Luke Mora',
        phone: '+63 918 765 4322'
      },
      timestamp: '2024-01-15T08:45:00Z'
    },
    {
      id: '4',
      reporterName: 'John Denzel Bolito',
      reporterPhone: '+63 912 345 6789',
      reporterEmail: 'John.denzel.bolito@email.com',
      city: 'Manila',
      barangay: 'Malate',
      category: 'Crime',
      status: 'pending' as const,
      description: 'Suspicious activity near the park. Two individuals acting suspiciously around parked vehicles.',
      location: {
        lat: 14.6015,
        lng: 120.9862,
        address: 'Rizal Park, Malate, Manila'
      },
      attachments: ['image1.jpg', 'video1.mp4'],
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+63 912 345 6790'
      },
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '5',
      reporterName: 'Rodel Lingcopines',
      reporterPhone: '+63 917 123 4567',
      reporterEmail: 'Lingcopines@email.com',
      city: 'Quezon City',
      barangay: 'Diliman',
      category: 'Fire',
      status: 'acknowledged' as const,
      description: 'Fire alarm triggered in residential building. Smoke visible from 3rd floor.',
      location: {
        lat: 14.6539,
        lng: 121.0689,
        address: '123 University Ave, Diliman, Quezon City'
      },
      attachments: ['fire_image.jpg'],
      emergencyContact: {
        name: 'Pedro Santos',
        phone: '+63 917 123 4568'
      },
      timestamp: '2024-01-15T09:15:00Z'
    }
  ] as Report[],

  // ==========================================================================
  // POLICE CHECKPOINTS DATA
  // ==========================================================================
  checkpoints: [
    {
      id: '1',
      name: 'Main Police Station',
      location: {
        lat: 14.5995,
        lng: 120.9842,
        address: 'Rizal Park, Malate, Manila'
      },
      assignedOfficers: ['Officer John', 'Officer Maria'],
      schedule: '24/7',
      timeStart: '00:00',
      timeEnd: '23:59',
      status: 'active' as const,
      contactNumber: '+63 2 8523 4567'
    },
    {
      id: '2',
      name: 'Traffic Checkpoint Alpha',
      location: {
        lat: 14.6042,
        lng: 120.9822,
        address: 'EDSA Corner Ayala Avenue, Makati'
      },
      assignedOfficers: ['Officer Pedro', 'Officer Ana'],
      schedule: '06:00 - 22:00',
      timeStart: '06:00',
      timeEnd: '22:00',
      status: 'active' as const,
      contactNumber: '+63 2 8845 1234'
    },
    {
      id: '3',
      name: 'Emergency Response Unit',
      location: {
        lat: 14.5905,
        lng: 120.9789,
        address: 'Quezon City Hall, Diliman'
      },
      assignedOfficers: ['Officer Carlos', 'Officer Sofia'],
      schedule: '12:00 - 00:00',
      timeStart: '12:00',
      timeEnd: '00:00',
      status: 'active' as const,
      contactNumber: '+63 2 8927 8901'
    }
  ] as Checkpoint[],

  // ==========================================================================
  // ANALYTICS DATA
  // ==========================================================================
  analytics: {
    topLocations: [
      { city: 'Manila', barangay: 'Malate', count: 45, percentage: 25.5 },
      { city: 'Quezon City', barangay: 'Diliman', count: 38, percentage: 21.6 },
      { city: 'Makati', barangay: 'Ayala', count: 32, percentage: 18.2 },
      { city: 'Manila', barangay: 'Ermita', count: 28, percentage: 15.9 },
      { city: 'Quezon City', barangay: 'Cubao', count: 22, percentage: 12.5 },
      { city: 'Makati', barangay: 'Salcedo', count: 11, percentage: 6.3 }
    ] as TopLocation[],
    resolvedCases: [
      {
        id: '1',
        reporterName: 'Wyn Guinarez',
        reporterPhone: '+63 912 345 6789',
        reporterEmail: 'wyne@email.com',
        category: 'Crime',
        city: 'Manila',
        barangay: 'Malate',
        location: {
          address: 'Rizal Park, Malate, Manila',
          lat: 14.5995,
          lng: 120.9842
        },
        description: 'Suspicious activity near the park. Two individuals acting suspiciously around parked vehicles.',
        dateReported: '2024-01-15T12:15:00Z',
        dateResolved: '2024-01-15T14:30:00Z',
        resolutionTime: '2h 15m',
        finalStatus: 'Resolved',
        resolutionNotes: 'Suspects were questioned and released. Increased patrols in the area.'
      },
      {
        id: '2',
        reporterName: 'Rodel Lingcopines',
        reporterPhone: '+63 917 123 4567',
        reporterEmail: 'Lingcopines@email.com',
        category: 'Fire',
        city: 'Quezon City',
        barangay: 'Diliman',
        location: {
          address: '123 University Ave, Diliman, Quezon City',
          lat: 14.6539,
          lng: 121.0689
        },
        description: 'Fire alarm triggered in residential building. Smoke visible from 3rd floor.',
        dateReported: '2024-01-15T10:15:00Z',
        dateResolved: '2024-01-15T11:45:00Z',
        resolutionTime: '1h 30m',
        finalStatus: 'Resolved',
        resolutionNotes: 'False alarm caused by cooking smoke. Building cleared and residents notified.'
      },
      {
        id: '3',
        reporterName: 'Abram Luke Mora',
        reporterPhone: '+63 918 765 4321',
        reporterEmail: 'ambram.mora@email.com',
        category: 'Medical',
        city: 'Makati',
        barangay: 'Ayala',
        location: {
          address: 'Ayala Avenue, Makati City',
          lat: 14.5547,
          lng: 121.0244
        },
        description: 'Medical emergency at office building. Person collapsed and needs immediate medical attention.',
        dateReported: '2024-01-15T08:45:00Z',
        dateResolved: '2024-01-15T09:20:00Z',
        resolutionTime: '35m',
        finalStatus: 'Resolved',
        resolutionNotes: 'Patient was transported to hospital. Condition stable. Family notified.'
      },
      {
        id: '4',
        reporterName: 'John Krystianne David',
        reporterPhone: '+63 919 888 7777',
        reporterEmail: 'Jk.David@email.com',
        category: 'Crime',
        city: 'Manila',
        barangay: 'Ermita',
        location: {
          address: 'Ermita District, Manila',
          lat: 14.5842,
          lng: 120.9822
        },
        description: 'Vehicle break-in reported. Items stolen from parked car.',
        dateReported: '2024-01-14T12:30:00Z',
        dateResolved: '2024-01-14T16:15:00Z',
        resolutionTime: '3h 45m',
        finalStatus: 'Resolved',
        resolutionNotes: 'Investigation completed. Security footage reviewed. Report filed.'
      },
      {
        id: '5',
        reporterName: 'John Denzel Bolito',
        reporterPhone: '+63 917 999 6666',
        reporterEmail: 'john.denzel.bolito@email.com',
        category: 'Fire',
        city: 'Quezon City',
        barangay: 'Cubao',
        location: {
          address: 'Cubao Commercial District, Quezon City',
          lat: 14.6193,
          lng: 121.0568
        },
        description: 'Smoke detected in shopping mall. Fire department dispatched.',
        dateReported: '2024-01-14T11:20:00Z',
        dateResolved: '2024-01-14T13:30:00Z',
        resolutionTime: '2h 10m',
        finalStatus: 'Resolved',
        resolutionNotes: 'Electrical short circuit in store. Fire extinguished. Building inspected and cleared.'
      }
    ] as ResolvedCase[],
    categoryStats: [
      { category: 'Crime', count: 78, percentage: 44.3 },
      { category: 'Fire', count: 45, percentage: 25.6 },
      { category: 'Medical', count: 32, percentage: 18.2 },
      { category: 'Traffic', count: 21, percentage: 11.9 }
    ] as CategoryStat[],
    timeStats: [
      { period: '00:00-06:00', count: 12 },
      { period: '06:00-12:00', count: 45 },
      { period: '12:00-18:00', count: 67 },
      { period: '18:00-24:00', count: 52 }
    ] as TimeStat[]
  },

  // ==========================================================================
  // CHAT CONVERSATIONS DATA
  // ==========================================================================
  chatConversations: {
    'rodellingcopines': [
      { id: 'r1', text: 'saklulu pakibilis', timestamp: new Date('2025-11-22T11:41:00.000Z'), senderType: 'sender' as const },
      { id: 'p1', text: 'wait lang en route na', timestamp: new Date('2025-11-22T12:01:00.000Z'), senderType: 'police' as const },
      { id: 'r2', text: 'asan na kayo tukmol', timestamp: new Date('2025-11-22T14:11:00.000Z'), senderType: 'sender' as const },
      { id: 'p2', text: 'saglit traffic', timestamp: new Date('2025-11-22T15:20:00.000Z'), senderType: 'police' as const }
    ],
    'wynguinarez': [
      { id: 'r1', text: 'asan na kayo tukmol', timestamp: new Date('2025-11-22T14:11:00.000Z'), senderType: 'sender' as const },
      { id: 'p1', text: 'wait lang en route na', timestamp: new Date('2025-11-22T12:01:00.000Z'), senderType: 'police' as const },
      { id: 'p2', text: 'pwede bang ilapit ang sasakyan sa gilid?', timestamp: new Date('2025-11-22T14:16:00.000Z'), senderType: 'police' as const },
      { id: 'p3', text: 'copy, magpapadala ng backup', timestamp: new Date('2025-11-22T14:19:10.000Z'), senderType: 'police' as const },
      { id: 'p4', text: 'saglit traffic', timestamp: new Date('2025-11-22T15:20:00.000Z'), senderType: 'police' as const }
    ],
    'abramlukemora': [
      { id: 'r1', text: 'may nahulog na tao sa kalsada', timestamp: new Date('2025-11-22T16:05:00.000Z'), senderType: 'sender' as const },
      { id: 'p1', text: 'papunta ang medical team', timestamp: new Date('2025-11-22T16:07:30.000Z'), senderType: 'police' as const }
    ],
    'johnkrystiannedavid': [
      { id: 'r1', text: 'may sunog sa 123 University Ave', timestamp: new Date('2025-11-23T07:05:10.000Z'), senderType: 'sender' as const },
      { id: 'p1', text: 'papunta agad ang rescue team', timestamp: new Date('2025-11-23T07:08:00.000Z'), senderType: 'police' as const }
    ],
    'johndenzelbolito': [
      { id: 'r1', text: 'accident lang, walang buhay na nasalba', timestamp: new Date('2025-11-24T09:30:00.000Z'), senderType: 'sender' as const },
      { id: 'p1', text: 'tawagin na namin ang tow truck', timestamp: new Date('2025-11-24T09:33:30.000Z'), senderType: 'police' as const }
    ],
    'jmarkgeralddagode': [
      { id: 'r1', text: 'may natangay na pet sa baha', timestamp: new Date('2025-11-25T17:05:00.000Z'), senderType: 'sender' as const },
      { id: 'p1', text: 'ito na kami magche-check', timestamp: new Date('2025-11-25T17:12:00.000Z'), senderType: 'police' as const }
    ]
  } as Record<string, ChatMessage[]>,

  // ==========================================================================
  // STATIC CONFIGURATION DATA
  // ==========================================================================
  policeStationLocation: {
    lat: 14.5995,
    lng: 120.9842,
    address: 'Manila Police Station, Rizal Park, Manila'
  },

  // Report status options
  reportStatuses: [
    { value: 'pending', label: 'Pending' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'en-route', label: 'En Route' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'canceled', label: 'Canceled' }
  ],

  // Report category options
  reportCategories: ['Crime', 'Fire', 'Medical', 'Traffic', 'Other'],

  // Date range filter options
  dateRangeOptions: [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' }
  ],

  // Checkpoint status options
  checkpointStatuses: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ],

  // Checkpoint filter options
  checkpointFilters: [
    { value: 'all', label: 'All Checkpoints' },
    { value: 'active', label: 'Active Checkpoints' },
    { value: 'inactive', label: 'Inactive Checkpoints' }
  ],

  // Analytics view options
  analyticsViews: [
    { value: 'locations', label: 'Top Locations' },
    { value: 'resolved', label: 'Resolved Cases' }
  ],

  // Cities collection for location filtering
  cities: [
    { id: 1, name: 'Manila' },
    { id: 2, name: 'Quezon City' },
    { id: 3, name: 'Makati' }
  ],

  // Barangays collection for location filtering (linked to cities by cityId)
  barangays: [
    // Manila barangays
    { id: 101, name: 'Malate', cityId: 1 },
    { id: 102, name: 'Ermita', cityId: 1 },
    // Quezon City barangays
    { id: 201, name: 'Diliman', cityId: 2 },
    { id: 202, name: 'Cubao', cityId: 2 },
    // Makati barangays
    { id: 301, name: 'Ayala', cityId: 3 },
    { id: 302, name: 'Salcedo', cityId: 3 }
  ]
}

