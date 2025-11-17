import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={`${inter.className} animated-background`}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}
