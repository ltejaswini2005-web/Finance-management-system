import React, { useState, useMemo } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Trash2,
  CheckSquare,
  Clock,
  Eye,
  EyeOff,
  Bell,
  Settings,
} from 'lucide-react'

function timeAgo(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  if (hrs > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'Just now'
}

function getNotificationIcon(iconName) {
  const icons = {
    'CheckCircle2': <CheckCircle2 size={18} />,
    'AlertCircle': <AlertCircle size={18} />,
    'AlertTriangle': <AlertTriangle size={18} />,
    'TrendingUp': <TrendingUp size={18} />,
  }
  return icons[iconName] || <CheckCircle2 size={18} />
}

function getNotificationColor(priority) {
  const colors = {
    'high': { bg: '#fee2e2', border: '#fca5a5', icon: '#b91c1c' },
    'medium': { bg: '#fef3c7', border: '#fcd34d', icon: '#b45309' },
    'low': { bg: '#f1f5f9', border: '#cbd5e1', icon: '#64748b' },
  }
  return colors[priority] || colors['low']
}

function NotificationItem({ notification, onMarkAsRead, onDelete, onNavigate }) {
  const colors = getNotificationColor(notification.priority)
  const isUnread = !notification.read

  return (
    <div
      className="notif-item"
      style={{
        background: isUnread ? colors.bg : '#ffffff',
        borderLeft: `4px solid ${colors.border}`,
      }}
    >
      <div className="notif-icon-wrap" style={{ color: colors.icon }}>
        {getNotificationIcon(notification.icon)}
      </div>

      <div className="notif-content">
        <div className="notif-header">
          <h3 className="notif-title">{notification.title}</h3>
          {isUnread && <span className="notif-unread-badge">New</span>}
        </div>
        <p className="notif-message">{notification.message}</p>
        <div className="notif-footer">
          <span className="notif-time">
            <Clock size={12} /> {timeAgo(notification.timestamp)}
          </span>
          {notification.actionLink && (
            <button
              type="button"
              className="notif-action-btn"
              onClick={() => {
                if (isUnread) onMarkAsRead(notification.id)
                onNavigate()
              }}
            >
              {notification.action || 'View'}
            </button>
          )}
        </div>
      </div>

      <div className="notif-actions">
        <button
          type="button"
          className="notif-action-icon"
          onClick={() => onMarkAsRead(notification.id)}
          title={isUnread ? 'Mark as read' : 'Mark as unread'}
        >
          {isUnread ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          type="button"
          className="notif-delete-btn"
          onClick={() => onDelete(notification.id)}
          title="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function NotificationsPage({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNavigate,
}) {
  const [filterTab, setFilterTab] = useState('all') // all, unread, read

  const filtered = useMemo(() => {
    if (filterTab === 'unread') return notifications.filter((n) => !n.read)
    if (filterTab === 'read') return notifications.filter((n) => n.read)
    return notifications
  }, [notifications, filterTab])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="notif-page-container">
      {/* Page Header */}
      <div className="notif-page-header">
        <div className="notif-header-text">
          <h1 className="page-main-title">Notifications</h1>
          <p className="page-sub-title">
            Stay updated on budget approvals, expense submissions, and project status changes.
          </p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="notif-layout">
        {/* Left Column: Notifications List */}
        <div className="notif-list-section">
          {/* Filter Tabs */}
          <div className="notif-filter-tabs">
            <button
              type="button"
              className={`notif-tab ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All
              <span className="notif-tab-count">{notifications.length}</span>
            </button>
            <button
              type="button"
              className={`notif-tab ${filterTab === 'unread' ? 'active' : ''}`}
              onClick={() => setFilterTab('unread')}
            >
              Unread
              {unreadCount > 0 && <span className="notif-tab-count">{unreadCount}</span>}
            </button>
            <button
              type="button"
              className={`notif-tab ${filterTab === 'read' ? 'active' : ''}`}
              onClick={() => setFilterTab('read')}
            >
              Read
              <span className="notif-tab-count">{notifications.filter((n) => n.read).length}</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="notif-list">
            {filtered.length === 0 ? (
              <div className="notif-empty-state">
                <CheckCircle2 size={40} />
                <p>
                  {filterTab === 'unread'
                    ? 'No unread notifications. You\'re all caught up!'
                    : filterTab === 'read'
                      ? 'No read notifications.'
                      : 'No notifications yet.'}
                </p>
              </div>
            ) : (
              filtered.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onNavigate={() => onNavigate?.(notif.actionLink)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions Sidebar */}
        <div className="notif-quick-actions">
          <div className="notif-quick-actions-card">
            {/* Illustration/Icon */}
            <div className="notif-quick-icon-container">
              <Bell size={64} strokeWidth={1} />
            </div>

            {/* Quick Actions Title */}
            <h3 className="notif-quick-title">Quick Actions</h3>

            {/* Buttons */}
            <div className="notif-quick-buttons">
              <button
                type="button"
                className="notif-quick-btn notif-quick-btn-primary"
                onClick={() => onNavigate?.('Notifications')}
              >
                View All Notifications
              </button>
              <button
                type="button"
                className="notif-quick-btn notif-quick-btn-secondary"
                onClick={() => onNavigate?.('Settings')}
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="notif-quick-stats">
              <div className="notif-stat">
                <span className="notif-stat-number">{unreadCount}</span>
                <span className="notif-stat-label">Unread</span>
              </div>
              <div className="notif-stat">
                <span className="notif-stat-number">{notifications.length}</span>
                <span className="notif-stat-label">Total</span>
              </div>
            </div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-quick-mark-all"
                onClick={onMarkAllAsRead}
              >
                <CheckSquare size={14} />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="portal-footer-line">
        <span className="copyright-text">
          <strong>TOYOTA Gurukul</strong> © 2028 Toyota Kirloskar Motor • Budget Management Portal.
        </span>
        <div className="footer-links-group">
          <span>Privacy Policy</span><span className="dot-divider">•</span>
          <span>Terms of Service</span><span className="dot-divider">•</span>
          <span>Internal Helpdesk (Ext: 4402)</span>
        </div>
      </footer>
    </div>
  )
}
