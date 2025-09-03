import React from 'react'
import { Camera, FileText, Upload, BarChart3, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function AppShell({ children, currentView, onViewChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Upload Photos', icon: Upload, id: 'upload' },
    { name: 'Photo Gallery', icon: Camera, id: 'photos' },
    { name: 'Generate Reports', icon: FileText, id: 'reports' },
    { name: 'Analytics', icon: BarChart3, id: 'analytics' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ]

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-card transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <Camera className="w-8 h-8 text-white" />
              <h1 className="text-xl font-bold text-white">ClaimSnap AI</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${currentView === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">JD</span>
              </div>
              <div>
                <p className="text-white font-medium">John Doe</p>
                <p className="text-white/70 text-sm">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white">
              {navigation.find(item => item.id === currentView)?.name || 'Dashboard'}
            </h2>
            <div className="text-white/70 text-sm">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}