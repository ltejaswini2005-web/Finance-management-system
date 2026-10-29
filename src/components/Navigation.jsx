import React from 'react'
import {
  LayoutDashboard,
  FileSpreadsheet,
  CircleDollarSign,
  BarChart3,
  Building2,
  FolderGit2,
  CheckCircle2,
  Bell,
  Settings,
  X,
} from 'lucide-react'

const navItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Budget Planning', label: 'Budget Planning', icon: FileSpreadsheet },
  { id: 'Expense Tracking', label: 'Expense Tracking', icon: CircleDollarSign },
  { id: 'Reports & Analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'Departments', label: 'Departments', icon: Building2 },
  { id: 'Projects', label: 'Projects', icon: FolderGit2 },
  { id: 'Approvals', label: 'Approvals', icon: CheckCircle2, showBadge: true },
  { id: 'Notifications', label: 'Notifications', icon: Bell },
  { id: 'Settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ activeTab, onSelectTab, isOpen, onClose, pendingApprovals }) {
  return (
    <nav className={`stitch-subnav ${isOpen ? 'mobile-open' : ''}`}>
      <div className="nav-items-container">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const badge = item.showBadge && pendingApprovals > 0 ? String(pendingApprovals) : null
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
              onClick={() => {
                onSelectTab(item.id)
                onClose?.()
              }}
            >
              <Icon size={14} className="nav-tab-icon" />
              <span className="nav-tab-label">{item.label}</span>
              {badge && <span className="nav-tab-badge">{badge}</span>}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="nav-mobile-close"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X size={18} />
      </button>
    </nav>
  )
}
