// components/CustomizeModal.js
'use client'
import { X } from 'lucide-react'

export default function CustomizeModal({ isOpen, onClose, preferences, onUpdate }) {
  if (!isOpen) return null

  const tabs = [
    { id: 'chat', label: 'Chat', icon: '✨' },
    { id: 'expenses', label: 'Expenses & Rent', icon: '💰' },
    { id: 'chores', label: 'Chores', icon: '🧹' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'messages', label: 'Landlord Comms', icon: '✉️' },
  ]

  const handleToggle = (tabId) => {
    onUpdate({
      ...preferences,
      [tabId]: !preferences[tabId]
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-1 rounded-lg max-w-md w-full border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-display font-semibold">Customize Navigation</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-3 hover:text-text-1 hover:bg-surface-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-text-2 mb-4">
            Choose which tabs to show in your navigation. Dashboard is always visible.
          </p>

          <div className="space-y-3">
            {tabs.map(tab => (
              <div key={tab.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-text-1 font-medium">{tab.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences[tab.id]}
                    onChange={() => handleToggle(tab.id)}
                  />
                  <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}