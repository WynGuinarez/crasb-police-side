import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import { initializeFirebaseGlobals } from '../lib/firebase-config'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Firebase global variables on client side
    initializeFirebaseGlobals()
  }, [])

  return (
    <AuthProvider>
      <div className={`${inter.className} animated-background`}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}
