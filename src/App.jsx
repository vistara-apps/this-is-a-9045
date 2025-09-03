import React, { useState } from 'react'
import { AppShell } from './components/AppShell'
import { FileUploadComponent } from './components/FileUploadComponent'
import { ImageList } from './components/ImageList'
import { ReportGenerator } from './components/ReportGenerator'
import { ClaimProvider } from './contexts/ClaimContext'

function App() {
  const [currentView, setCurrentView] = useState('upload')

  return (
    <ClaimProvider>
      <div className="min-h-screen gradient-bg">
        <AppShell currentView={currentView} onViewChange={setCurrentView}>
          {currentView === 'upload' && <FileUploadComponent />}
          {currentView === 'photos' && <ImageList />}
          {currentView === 'reports' && <ReportGenerator />}
        </AppShell>
      </div>
    </ClaimProvider>
  )
}

export default App