import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import DashboardPage from './components/DashboardPage'
import BudgetPlanningPage from './components/BudgetPlanningPage'
import CreateBudgetModal from './components/CreateBudgetModal'
import CreateBudgetPlanPage from './components/CreateBudgetPlanPage'
import ExpenseTrackingPage from './components/ExpenseTrackingPage'
import DepartmentsPage from './components/DepartmentsPage'
import ProjectsPage from './components/ProjectsPage'
import ApprovalsPage from './components/ApprovalsPage'
import NotificationsPage from './components/NotificationsPage'
import SettingsPage from './components/SettingsPage'
import ReportsAnalyticsPage from './components/ReportsAnalyticsPage'
import {
  listBudgets,
  listDepartments,
  saveBudget,
  deleteBudget,
  updateBudgetStatus,
  bulkApproveBudgets,
  listExpenses,
  saveExpense,
  deleteExpense,
  updateExpenseStatus,
  saveDepartment,
  deleteDepartment,
  listProjects,
  saveProject,
  deleteProject,
  updateProjectStatus,
  listApprovalItems,
  batchApproveItems,
  getApprovalSummary,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from './data/localData'
import './budget-stitch.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('app-theme') || 'light'
  })

  // View state: 'list' (Screen 2) or 'create-plan' (Screen 3)
  const [viewMode, setViewMode] = useState('list')
  // Modal state: true (Screen 1) or false
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [budgets, setBudgets] = useState([])
  const [departments, setDepartments] = useState([])
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [approvalItems, setApprovalItems] = useState([])
  const [approvalSummary, setApprovalSummary] = useState({
    pendingTotal: 0, pendingBudgets: 0, pendingExpenses: 0, pendingAmount: 0, highPriority: 0, approvedTotal: 0,
  })
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')

  const reloadBudgets = useCallback(async () => {
    setError('')
    try {
      const [plans, depts] = await Promise.all([listBudgets(2026), listDepartments()])
      setBudgets(plans)
      setDepartments(depts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load budget data.')
    }
  }, [])

  const reloadExpenses = useCallback(async () => {
    try {
      const all = await listExpenses()
      setExpenses(all)
    } catch (err) {
      console.error('Failed to reload expenses', err)
    }
  }, [])

  const reloadDepartments = useCallback(async () => {
    try {
      const depts = await listDepartments(true)
      setDepartments(depts)
    } catch (err) {
      console.error('Failed to reload departments', err)
    }
  }, [])

  const reloadProjects = useCallback(async () => {
    try {
      const prjs = await listProjects()
      setProjects(prjs)
    } catch (err) {
      console.error('Failed to reload projects', err)
    }
  }, [])

  const reloadApprovals = useCallback(() => {
    setApprovalItems(listApprovalItems('all'))
    setApprovalSummary(getApprovalSummary())
  }, [])

  const reloadNotifications = useCallback(() => {
    setNotifications(getNotifications())
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    localStorage.setItem('app-theme', theme)
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.colorScheme = 'dark'
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    } else {
      root.style.colorScheme = 'light'
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    }
  }, [theme])

  useEffect(() => {
    let ignore = false
    Promise.all([
      listBudgets(2026),
      listDepartments(true),
      listExpenses(),
      listProjects(),
    ]).then(([plans, depts, exps, prjs]) => {
      if (!ignore) {
        setBudgets(plans)
        setDepartments(depts)
        setExpenses(exps)
        setProjects(prjs)
        // Approval items are derived synchronously
        setApprovalItems(listApprovalItems('all'))
        setApprovalSummary(getApprovalSummary())
        // Load notifications
        setNotifications(getNotifications())
      }
    })
    return () => { ignore = true }
  }, [])

  // --- Budget handlers ---
  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity budget plan?')) return
    try {
      await deleteBudget(id)
      await reloadBudgets()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete budget plan.')
    }
  }

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await updateBudgetStatus(id, newStatus)
      await reloadBudgets()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status.')
    }
  }

  const handleBulkApprove = async () => {
    try {
      await bulkApproveBudgets()
      await reloadBudgets()
      alert('All eligible departmental budget activity plans have been marked Approved.')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Bulk approval failed.')
    }
  }

  const handleModalSaveSuccess = async (planData) => {
    await saveBudget(planData)
    await reloadBudgets()
  }

  const handleFullPageSaveSuccess = async (planData) => {
    await saveBudget(planData)
    await reloadBudgets()
    setViewMode('list')
  }

  // --- Expense handlers ---
  const handleAddExpense = async (formData, editId) => {
    await saveExpense(formData, editId)
    await reloadExpenses()
  }

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id)
    await reloadExpenses()
  }

  const handleUpdateExpenseStatus = async (id, status) => {
    await updateExpenseStatus(id, status)
    await reloadExpenses()
    reloadApprovals()
  }

  // --- Approval handlers ---
  const handleBatchApprove = async (ids, action, approverName) => {
    await batchApproveItems(ids, action, approverName)
    // Reload all data that may have changed
    await Promise.all([reloadBudgets(), reloadExpenses()])
    reloadApprovals()
  }

  const handleSingleApprove = async (id) => {
    await batchApproveItems([id], 'Approved', 'Finance Manager')
    await Promise.all([reloadBudgets(), reloadExpenses()])
    reloadApprovals()
  }

  const handleSingleReject = async (id) => {
    await batchApproveItems([id], 'Rejected', 'Finance Manager')
    await Promise.all([reloadBudgets(), reloadExpenses()])
    reloadApprovals()
  }

  // --- Department handlers ---
  const handleSaveDepartment = async (formData, id) => {
    await saveDepartment(formData, id)
    await reloadDepartments()
  }

  const handleDeleteDepartment = async (id) => {
    await deleteDepartment(id)
    await reloadDepartments()
  }

  // --- Project handlers ---
  const handleSaveProject = async (formData, id) => {
    await saveProject(formData, id)
    await reloadProjects()
  }

  const handleDeleteProject = async (id) => {
    await deleteProject(id)
    await reloadProjects()
  }

  const handleUpdateProjectStatus = async (id, status) => {
    await updateProjectStatus(id, status)
    await reloadProjects()
  }

  // --- Notification handlers ---
  const handleMarkNotificationAsRead = async (id) => {
    await markNotificationAsRead(id)
    reloadNotifications()
  }

  const handleMarkAllNotificationsAsRead = async () => {
    await markAllNotificationsAsRead()
    reloadNotifications()
  }

  const handleDeleteNotification = async (id) => {
    await deleteNotification(id)
    reloadNotifications()
  }

  // --- Tab Navigation ---
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'Budget Planning') {
      setViewMode('list')
    }
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        search={search}
        setSearch={setSearch}
        onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        notifications={notifications}
        onNotificationClick={() => setActiveTab('Notifications')}
      />

      {/* Sub Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main View Area */}
      <main className="app-main-content">
        {error && <div className="page-error-banner">{error}</div>}

        {/* Dashboard */}
        {activeTab === 'Dashboard' && (
          <DashboardPage
            budgets={budgets}
            departments={departments}
            onCreateBudget={() => { setActiveTab('Budget Planning'); setIsModalOpen(true) }}
            onCreateBudgetPlan={() => { setActiveTab('Budget Planning'); setViewMode('create-plan') }}
            onNavigate={handleSelectTab}
          />
        )}

        {/* Budget Planning */}
        {activeTab === 'Budget Planning' && (
          viewMode === 'create-plan' ? (
            /* Screen 3: Full Page Create Budget Plan */
            <CreateBudgetPlanPage
              onBack={() => setViewMode('list')}
              onSaveSuccess={handleFullPageSaveSuccess}
              departments={departments}
            />
          ) : (
            /* Screen 2: Main Budget Planning Dashboard */
            <BudgetPlanningPage
              budgets={budgets}
              departments={departments}
              search={search}
              onCreateBudget={() => setIsModalOpen(true)}
              onCreateBudgetPlan={() => setViewMode('create-plan')}
              onDelete={handleDeletePlan}
              onStatusToggle={handleStatusToggle}
              onBulkApprove={handleBulkApprove}
            />
          )
        )}

        {/* Expense Tracking */}
        {activeTab === 'Expense Tracking' && (
          <ExpenseTrackingPage
            expenses={expenses}
            departments={departments}
            search={search}
            onAdd={handleAddExpense}
            onDelete={handleDeleteExpense}
            onUpdateStatus={handleUpdateExpenseStatus}
          />
        )}

        {/* Departments */}
        {activeTab === 'Departments' && (
          <DepartmentsPage
            departments={departments}
            onSave={handleSaveDepartment}
            onDelete={handleDeleteDepartment}
          />
        )}

        {/* Projects */}
        {activeTab === 'Projects' && (
          <ProjectsPage
            projects={projects}
            departments={departments.filter((d) => d.active)}
            onSave={handleSaveProject}
            onDelete={handleDeleteProject}
            onStatusChange={handleUpdateProjectStatus}
          />
        )}

        {/* Approvals */}
        {activeTab === 'Approvals' && (
          <ApprovalsPage
            approvalItems={approvalItems}
            summary={approvalSummary}
            onBatchApprove={handleBatchApprove}
            onSingleApprove={handleSingleApprove}
            onSingleReject={handleSingleReject}
          />
        )}

        {/* Notifications */}
        {activeTab === 'Notifications' && (
          <NotificationsPage
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onDelete={handleDeleteNotification}
            onNavigate={handleSelectTab}
          />
        )}

        {/* Settings */}
        {activeTab === 'Settings' && (
          <SettingsPage onThemeChange={setTheme} />
        )}

        {/* Reports & Analytics */}
        {activeTab === 'Reports & Analytics' && (
          <ReportsAnalyticsPage
            budgets={budgets}
            departments={departments}
            projects={projects}
          />
        )}

        {/* Placeholder tabs */}
        {!['Dashboard', 'Budget Planning', 'Expense Tracking', 'Departments', 'Projects', 'Approvals', 'Notifications', 'Settings', 'Reports & Analytics'].includes(activeTab) && (
          <div className="placeholder-page-container">
            <div className="placeholder-page-inner">
              <div className="placeholder-icon-wrap">
                <span className="placeholder-icon">🚧</span>
              </div>
              <h2 className="placeholder-title">{activeTab}</h2>
              <p className="placeholder-desc">
                This section is under development. Check back soon.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Screen 1: Create Budget Modal Dialog */}
      <CreateBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleModalSaveSuccess}
        departments={departments}
      />
    </div>
  )
}
