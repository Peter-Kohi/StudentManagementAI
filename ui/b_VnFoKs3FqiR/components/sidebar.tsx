'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Brain,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type Screen = 'dashboard' | 'students' | 'add' | 'ai'

interface SidebarProps {
  currentScreen: Screen
  onScreenChange: (screen: Screen) => void
  isOpen: boolean
  onToggle: () => void
}

const menuItems: { id: Screen; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'students', label: 'Danh sách SV', icon: Users },
  { id: 'add', label: 'Thêm sinh viên', icon: UserPlus },
  { id: 'ai', label: 'Phân tích AI', icon: Brain },
]

export function Sidebar({
  currentScreen,
  onScreenChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="bg-sidebar-primary p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Quản Lý SV</h1>
            <p className="text-xs text-sidebar-foreground/70">Hệ thống AI</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onScreenChange(item.id)
                  if (window.innerWidth < 1024) onToggle()
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
