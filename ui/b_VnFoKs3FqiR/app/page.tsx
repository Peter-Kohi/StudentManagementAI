'use client'

import { useState } from 'react'
import { Sidebar, Screen } from '@/components/sidebar'
import { Dashboard } from '@/components/dashboard'
import { StudentList } from '@/components/student-list'
import { AddStudentForm } from '@/components/add-student-form'
import { AIAnalysis } from '@/components/ai-analysis'
import { Toaster } from 'sonner'

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />
      case 'students':
        return <StudentList onAddClick={() => setCurrentScreen('add')} />
      case 'add':
        return <AddStudentForm />
      case 'ai':
        return <AIAnalysis />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 pt-16 lg:pt-4 lg:p-8">
          {renderScreen()}
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  )
}
