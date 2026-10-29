import React, { useState } from 'react'
import { Bell, Search, Menu, X } from 'lucide-react'

export default function Header({ search, setSearch, onToggleMenu, notifications, onNotificationClick }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  
  const unreadNotifications = notifications?.filter(n => !n.read) || []
  const recentNotifications = notifications?.slice(0, 5) || []

  return (
    <header className="stitch-top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={onToggleMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="toyota-brand">
          <div className="toyota-emblem">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
              <ellipse cx="12" cy="12" rx="10" ry="7.5" stroke="#e11d48" />
              <ellipse cx="12" cy="10" rx="4" ry="7" stroke="#e11d48" />
              <path d="M5.5 8c2.5 1.5 5 1.8 6.5 1.8s4-.3 6.5-1.8" stroke="#e11d48" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">
              <strong>TOYOTA</strong> <span className="gurukul-accent">Gurukul</span>
            </span>
            <span className="brand-subtitle">Budget Management System</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="header-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project, department, or activity..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-timestamp">
          <span className="date-time">Tue, 21 Apr 2026</span>
          <span className="time-tz">11:24 AM IST</span>
        </div>

        <div className="notification-dropdown-wrapper">
          <button 
            type="button" 
            className="notification-bell-btn" 
            aria-label="Notifications"
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
          >
            <Bell size={17} />
            {unreadNotifications.length > 0 && (
              <span className="notification-indicator" />
            )}
          </button>

          {showNotificationDropdown && (
            <div className="notification-dropdown-menu">
              <div className="notification-dropdown-header">
                <h3>Notifications</h3>
                <button
                  type="button"
                  className="notification-dropdown-close"
                  onClick={() => setShowNotificationDropdown(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="notification-dropdown-list">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <button
                      key={notif.id}
                      type="button"
                      className={`notification-dropdown-item ${notif.read ? '' : 'unread'}`}
                      onClick={() => {
                        setShowNotificationDropdown(false)
                        onNotificationClick?.()
                      }}
                    >
                      <div className="notification-dropdown-title">{notif.title}</div>
                      <div className="notification-dropdown-message">{notif.message}</div>
                    </button>
                  ))
                ) : (
                  <div className="notification-dropdown-empty">No notifications</div>
                )}
              </div>
              
              <div className="notification-dropdown-footer">
                <button
                  type="button"
                  className="notification-dropdown-view-all"
                  onClick={() => {
                    setShowNotificationDropdown(false)
                    onNotificationClick?.()
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-badge">
          <div className="user-avatar-circle">RS</div>
          <div className="user-details">
            <span className="user-name">Rohit Sharma</span>
            <span className="user-role-line">
              <span className="role-chip">Admin</span> • Finance Operations
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
