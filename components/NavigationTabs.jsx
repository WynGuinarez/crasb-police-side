import { BarChart3, CheckCircle, Home, Map } from 'lucide-react'
import Link from 'next/link'

const NavigationTabs = ({ activeTab }) => {
  return (
    <div className="mb-4">
      <nav className="flex space-x-6">
        <Link
          href="/dashboard"
          prefetch={true}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'dashboard' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Home className="h-4 w-4 inline mr-2" />
          Dashboard
        </Link>
        <Link
          href="/map"
          prefetch={true}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'map' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Map className="h-4 w-4 inline mr-2" />
          Live Map
        </Link>
        <Link
          href="/analytics"
          prefetch={true}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Analytics
        </Link>
        <Link
          href="/resolved-cases"
          prefetch={true}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'resolved-cases' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <CheckCircle className="h-4 w-4 inline mr-2" />
          Resolved Cases
        </Link>
      </nav>
    </div>
  )
}

export default NavigationTabs

