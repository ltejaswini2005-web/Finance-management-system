import React, { useState } from 'react'
import {
  Save,
  RotateCcw,
  Bell,
  Lock,
  User,
  Palette,
  Database,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

export default function SettingsPage({ onThemeChange }) {
  const [activeMenu, setActiveMenu] = useState('profile')
  const [settings, setSettings] = useState({
    // Account Settings
    displayName: 'Finance Manager',
    email: 'finance@toyota-gurukul.in',
    role: 'Finance Manager',
    department: 'Finance Department',

    // Notification Settings
    emailOnApproval: true,
    emailOnExpense: true,
    emailOnBudgetAlert: true,
    pushNotifications: true,
    dailyDigest: false,

    // Display Settings
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',

    // Privacy Settings
    shareActivityLog: false,
    allowDataExport: true,
  })

  const [savedMessage, setSavedMessage] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSavedMessage('')
    
    // Apply theme change immediately
    if (key === 'theme') {
      onThemeChange?.(value)
    }
  }

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!')
    setHasChanges(false)
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleReset = () => {
    setHasChanges(false)
    setSavedMessage('')
  }

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'data', label: 'Data & Export', icon: Database },
  ]

  return (
    <div className="settings-page-container">
      {/* Page Header */}
      <div className="settings-page-header">
        <div className="settings-header-text">
          <h1 className="page-main-title">Settings</h1>
          <p className="page-sub-title">
            Manage your account preferences, notifications, and application settings.
          </p>
        </div>
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="settings-alert settings-alert-success">
          <AlertCircle size={14} /> {savedMessage}
        </div>
      )}

      <div className="settings-main-layout">
        {/* Left Sidebar Menu */}
        <div className="settings-sidebar">
          <nav className="settings-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`settings-menu-item ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {activeMenu === item.id && <ChevronRight size={16} className="menu-indicator" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="settings-content-area">
          {/* Profile Section */}
          {activeMenu === 'profile' && (
            <div className="settings-profile-layout">
              {/* Left: Profile Information */}
              <div className="settings-section-view">
                <div className="settings-section-header">
                  <h2 className="settings-section-title">Profile Information</h2>
                </div>
                <div className="settings-section-content">
                  <div className="settings-avatar-box">
                    <div className="settings-avatar">FM</div>
                    <div className="settings-avatar-info">
                      <h3>{settings.displayName}</h3>
                      <p className="settings-avatar-email">{settings.email}</p>
                      <span className="settings-role-badge">{settings.role}</span>
                    </div>
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">Display Name</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={settings.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">Email Address</label>
                    <input
                      type="email"
                      className="settings-input"
                      value={settings.email}
                      disabled
                    />
                    <p className="settings-help-text">Email cannot be changed</p>
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">Department</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={settings.department}
                      disabled
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">Role</label>
                    <select className="settings-input" value={settings.role} disabled>
                      <option>Finance Manager</option>
                      <option>Department Manager</option>
                      <option>Admin</option>
                      <option>Viewer</option>
                    </select>
                    <p className="settings-help-text">Contact admin to change role</p>
                  </div>

                  <button type="button" className="settings-password-btn">
                    <Lock size={14} />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>

              {/* Right: Application Preferences */}
              <div className="settings-section-view">
                <div className="settings-section-header">
                  <h2 className="settings-section-title">Application Preferences</h2>
                </div>
                <div className="settings-section-content">
                  <div className="settings-toggle-field">
                    <div className="settings-toggle-label">
                      <span>Email Notifications</span>
                      <p className="settings-help-text">Receive email notifications for important updates</p>
                    </div>
                    <label className="settings-toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.emailOnApproval}
                        onChange={(e) => handleChange('emailOnApproval', e.target.checked)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-field">
                    <div className="settings-toggle-label">
                      <span>Push Notifications</span>
                      <p className="settings-help-text">Receive browser push notifications</p>
                    </div>
                    <label className="settings-toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-field">
                    <div className="settings-toggle-label">
                      <span>Daily Digest</span>
                      <p className="settings-help-text">Receive a daily summary of your approvals</p>
                    </div>
                    <label className="settings-toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.dailyDigest}
                        onChange={(e) => handleChange('dailyDigest', e.target.checked)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">Theme</label>
                    <select
                      className="settings-input"
                      value={settings.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">Language</label>
                    <select
                      className="settings-input"
                      value={settings.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="kannada">Kannada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeMenu === 'notifications' && (
            <div className="settings-section-view">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Notification Preferences</h2>
              </div>
              <div className="settings-section-content">
                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Email on Budget Approval</span>
                    <p className="settings-help-text">Get notified when budgets are approved</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailOnApproval}
                      onChange={(e) => handleChange('emailOnApproval', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Email on Expense Submission</span>
                    <p className="settings-help-text">Get notified when expenses are submitted</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailOnExpense}
                      onChange={(e) => handleChange('emailOnExpense', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Budget Alert Emails</span>
                    <p className="settings-help-text">Get notified when budgets exceed thresholds</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailOnBudgetAlert}
                      onChange={(e) => handleChange('emailOnBudgetAlert', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Push Notifications</span>
                    <p className="settings-help-text">Receive browser push notifications</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Daily Digest</span>
                    <p className="settings-help-text">Receive a daily summary of your approvals</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.dailyDigest}
                      onChange={(e) => handleChange('dailyDigest', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeMenu === 'security' && (
            <div className="settings-section-view">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Security Settings</h2>
              </div>
              <div className="settings-section-content">
                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Share Activity Log</span>
                    <p className="settings-help-text">Allow managers to view your activity history</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.shareActivityLog}
                      onChange={(e) => handleChange('shareActivityLog', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="settings-toggle-field">
                  <div className="settings-toggle-label">
                    <span>Allow Data Export</span>
                    <p className="settings-help-text">Allow exporting your data as CSV/PDF</p>
                  </div>
                  <label className="settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.allowDataExport}
                      onChange={(e) => handleChange('allowDataExport', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <button type="button" className="settings-password-btn">
                  <Lock size={14} />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          )}

          {/* Display Section */}
          {activeMenu === 'display' && (
            <div className="settings-section-view">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Display Settings</h2>
              </div>
              <div className="settings-section-content">
                <div className="settings-field">
                  <label className="settings-label">Theme</label>
                  <select
                    className="settings-input"
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label className="settings-label">Language</label>
                  <select
                    className="settings-input"
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="kannada">Kannada</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label className="settings-label">Date Format</label>
                  <select
                    className="settings-input"
                    value={settings.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label className="settings-label">Currency</label>
                  <select
                    className="settings-input"
                    value={settings.currency}
                    disabled
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                  </select>
                  <p className="settings-help-text">Cannot be changed</p>
                </div>
              </div>
            </div>
          )}

          {/* Data & Export Section */}
          {activeMenu === 'data' && (
            <div className="settings-section-view">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Data Management</h2>
              </div>
              <div className="settings-section-content">
                <p className="settings-info-text">
                  Manage your data, backups, and export options for TOYOTA Gurukul Budget Management System.
                </p>
                <div className="settings-button-group">
                  <button type="button" className="settings-secondary-btn">
                    <Database size={14} />
                    <span>View Activity Log</span>
                  </button>
                  <button type="button" className="settings-secondary-btn">
                    <Database size={14} />
                    <span>Export Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="settings-footer">
        <div className="settings-footer-buttons">
          <button
            type="button"
            className="settings-reset-btn"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            className="settings-save-btn"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={14} />
            <span>Save Settings</span>
          </button>
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
