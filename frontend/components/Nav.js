// components/Nav.js
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import CustomizeModal from './CustomizeModal'

const DEFAULT_PREFS = {
  chat: true,
  expenses: true,
  chores: true,
  maintenance: true,
  messages: true,
}

export default function Nav() {
  const pathname = usePathname()
  const [showCustomize, setShowCustomize] = useState(false)
  const [navPrefs, setNavPrefs] = useState(DEFAULT_PREFS)

  // Load nav preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('roomieai_nav_prefs')
    if (saved) {
      try {
        setNavPrefs({ ...DEFAULT_PREFS, ...JSON.parse(saved) })
      } catch (e) {
        console.error('Failed to load nav preferences:', e)
      }
    }
  }, [])

  const updateNavPrefs = (newPrefs) => {
    setNavPrefs(newPrefs)
    localStorage.setItem('roomieai_nav_prefs', JSON.stringify(newPrefs))
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: '🏠', always: true },
    { id: 'chat', label: 'Chat', href: '/chat', icon: '✨' },
    { id: 'expenses', label: 'Expenses & Rent', href: '/expenses', icon: '💰' },
    { id: 'chores', label: 'Chores', href: '/chores', icon: '🧹' },
    { id: 'maintenance', label: 'Maintenance', href: '/maintenance', icon: '🔧' },
    { id: 'messages', label: 'Landlord Comms', href: '/messages', icon: '✉️' },
  ]

  const visibleTabs = tabs.filter(tab => tab.always || navPrefs[tab.id])

  return (
    <>
      <nav className="bg-surface-1 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="font-display font-bold text-xl py-4">
                <span className="text-accent">RoomieAI</span>
              </div>

              <div className="hidden md:flex items-center space-x-1">
                {visibleTabs.map(tab => {
                  const isActive = pathname === tab.href
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`
                        flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-accent/10 text-accent border-b-2 border-accent'
                          : 'text-text-3 hover:text-text-1 hover:bg-surface-2'
                        }
                      `}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => setShowCustomize(true)}
              className="p-2 rounded-lg text-text-3 hover:text-text-1 hover:bg-surface-2 transition-colors duration-200"
              title="Customize Navigation"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-white/10">
          <div className="flex items-center overflow-x-auto px-4 py-2 space-x-1">
            {visibleTabs.map(tab => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200
                    ${isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-3 hover:text-text-1 hover:bg-surface-2'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <CustomizeModal
        isOpen={showCustomize}
        onClose={() => setShowCustomize(false)}
        preferences={navPrefs}
        onUpdate={updateNavPrefs}
      />
    </>
  )
}