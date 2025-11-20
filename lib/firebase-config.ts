/**
 * Firebase Configuration
 * 
 * This file contains the Firebase configuration that will be used throughout the application.
 * Update these values with your actual Firebase project credentials.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

export const appId = process.env.NEXT_PUBLIC_APP_ID || "crash-police-app"

export const initialAuthToken = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TOKEN || ""

/**
 * Initialize global Firebase variables on the window object
 * This is required for components that expect these variables to be available globally
 */
export const initializeFirebaseGlobals = () => {
  if (typeof window !== 'undefined') {
    (window as any).__app_id = appId
    ;(window as any).__firebase_config = firebaseConfig
    ;(window as any).__initial_auth_token = initialAuthToken
  }
}

