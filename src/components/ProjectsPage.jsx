import React, { useState, useMemo } from 'react'
import {
  Plus,
  X,
  Search,
  FolderGit2,
  Users,
  IndianRupee,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Pause,
} from 'lucide-react'

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(val) || 0
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
  return `₹${new Intl.NumberFormat('en-IN').format(num)}`
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUSES = ['Active', 'On Hold', 'Completed', 'Cancelled']
const PRIORITIES = ['High', 'Medium', 'Low']

const EMPTY_FORM = {
  name: '',
  code: '',
  departmentId: '',
  departmentName: '',
  status: 'Active',
  priority: 'Medium',
  startDate: '',
  endDate: '',
  budget: '',
  owner: '',
  description: '',
  tags: '',
}

function statusMeta(status) {
  const map = {
    Active:    { bg: '#dcfce7', color: '#15803d', icon: CheckCircle2 },
    'On Hold': { bg: '#fef3c7', color: '#b45309', icon: Pause },
    Completed: { bg: '#dbeafe', color: '#1d4ed8', icon: CheckCircle2 },
    Cancelled: { bg: '#fee2e2', color: '#b91c1c', icon: AlertCircle },
  }
  return map[status] || { bg: '#f1f5f9', color: '#475569', icon: Clock }
}

function priorityMeta(priority) {
  const map = {
    High:   { bg: '#fee2e2', color: '#b91c1c' },
    Medium: { bg: '#fef3c7', color: '#b45309' },
    Low:    { bg: '#f0fdf4', color: '#15803d' },
  }
  return map[priority] || { bg: '#f1f5f9', color: '#64748b' }
}

// Progress bar
function ProgressBar({ spent, budget }) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
  const overBudget = pct >= 100
  return (
    <div>
      <div className="proj-progress-track">
        <div
          className="proj-progress-fill"
          style={{ width: `${pct}%`, background: overBudget ? '#dc2626' : '#0d9488' }}
        />
      </div>
      <div className="proj-progress-labels">
        <span>{formatINR(spent)} spent</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
    </div>
  )
}

// Project Card
function ProjectCard({ project, onEdit, onDelete, onStatusChange }) {
  const sm = statusMeta(project.status)
  const pm = priorityMeta(project.priority)
  const StatusIcon = sm.icon

  return (
    <div className="proj-card">
      <div className="proj-card-top">
        <div className="proj-card-icon-wrap">
          <FolderGit2 size={18} style={{ color: '#0d9488' }} />
        </div>
        <div className="proj-card-badges">
          <span className="proj-priority-pill" style={{ background: pm.bg, color: pm.color }}>
            {project.priority}
          </span>
          <span className="proj-status-pill" style={{ background: sm.bg, color: sm.color }}>
            <StatusIcon size={11} /> {project.status}
          </span>
        </div>
      </div>

      <div className="proj-card-body">
        <span className="proj-code-label">{project.code}</span>
        <h3 className="proj-card-name">{project.name}</h3>
        {project.description && <p className="proj-card-desc">{project.description}</p>}
      </div>

      {project.tags?.length > 0 && (
        <div className="proj-tags-row">
          {project.tags.map((tag) => (
            <span key={tag} className="proj-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="proj-card-info-grid">
        <div className="proj-info-row">
          <Users size={12} className="proj-info-icon" />
          <span>{project.departmentName || '—'}</span>
        </div>
        <div className="proj-info-row">
          <Users size={12} className="proj-info-icon" />
          <span>{project.owner || '—'}</span>
        </div>
        <div className="proj-info-row">
          <Calendar size={12} className="proj-info-icon" />
          <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
        </div>
      </div>

      <div className="proj-budget-section">
        <div className="proj-budget-label-row">
          <span className="proj-budget-label">Budget: {formatINR(project.budget)}</span>
          <span className="proj-milestone-chip">
            {project.completedMilestones}/{project.milestones} milestones
          </span>
        </div>
        <ProgressBar spent={project.spent || 0} budget={project.budget || 0} />
      </div>

      <div className="proj-card-footer">
        <select
          className="proj-status-select"
          value={project.status}
          onChange={(e) => onStatusChange(project.id, e.target.value)}
          style={{ color: sm.color }}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="dept-card-actions">
          <button type="button" className="dept-action-btn" title="Edit project" onClick={() => onEdit(project)}>
            <Pencil size={13} />
          </button>
          <button type="button" className="dept-action-btn dept-action-delete" title="Delete project" onClick={() => onDelete(project.id)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Add/Edit Project Drawer Form
function ProjectDrawerForm({ onClose, onSave, editItem, departments }) {
  const [form, setForm] = useState(() =>
    editItem
      ? { ...editItem, tags: Array.isArray(editItem.tags) ? editItem.tags.join(', ') : '' }
      : { ...EMPTY_FORM }
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleDeptChange = (deptId) => {
    const dept = departments.find((d) => d.id === deptId)
    setForm((prev) => ({ ...prev, departmentId: deptId, departmentName: dept?.name || '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Project name is required'
    if (!form.departmentId) e.departmentId = 'Department is required'
    if (!form.startDate) e.startDate = 'Start date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave(
        {
          ...form,
          budget: form.budget ? Number(form.budget) : 0,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        },
        editItem?.id
      )
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="exp-drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exp-drawer">
        <div className="exp-drawer-header">
          <div>
            <h2 className="exp-drawer-title">{editItem ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="exp-drawer-subtitle">Define project details, timeline and budget</p>
          </div>
          <button type="button" className="exp-drawer-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="exp-drawer-form">
          {/* Project Name */}
          <div className="exp-form-field">
            <label className="exp-form-label">Project Name <span className="req">*</span></label>
            <input
              type="text"
              className={`exp-form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. FY27 Assembly Line Automation Upgrade"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <span className="exp-field-error">{errors.name}</span>}
          </div>

          {/* Department + Owner */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Department <span className="req">*</span></label>
              <select
                className={`exp-form-select ${errors.departmentId ? 'input-error' : ''}`}
                value={form.departmentId}
                onChange={(e) => handleDeptChange(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <span className="exp-field-error">{errors.departmentId}</span>}
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Project Owner</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="Owner name"
                value={form.owner}
                onChange={(e) => set('owner', e.target.value)}
              />
            </div>
          </div>

          {/* Status + Priority */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Status</label>
              <select className="exp-form-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Priority</label>
              <select className="exp-form-select" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Start + End Date */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Start Date <span className="req">*</span></label>
              <input
                type="date"
                className={`exp-form-input ${errors.startDate ? 'input-error' : ''}`}
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
              {errors.startDate && <span className="exp-field-error">{errors.startDate}</span>}
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">End Date</label>
              <input
                type="date"
                className="exp-form-input"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Budget */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Budget (₹)</label>
              <input
                type="number"
                min="0"
                className="exp-form-input"
                placeholder="0"
                value={form.budget}
                onChange={(e) => set('budget', e.target.value)}
              />
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="e.g. CAPEX, Automation, PLC"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="exp-form-field">
            <label className="exp-form-label">Description</label>
            <textarea
              className="exp-form-textarea"
              rows={3}
              placeholder="Brief project description and objectives"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="exp-drawer-actions">
            <button type="button" className="btn-export-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-create-plan-primary" disabled={saving}>
              {saving ? 'Saving…' : editItem ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProjectDrawer({ isOpen, onClose, onSave, editItem, departments }) {
  if (!isOpen) return null
  return (
    <ProjectDrawerForm
      key={`${editItem?.id ?? 'new'}-open`}
      onClose={onClose}
      onSave={onSave}
      editItem={editItem}
      departments={departments}
    />
  )
}

export default function ProjectsPage({ projects, departments, onSave, onDelete, onStatusChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [localSearch, setLocalSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const openAdd = () => { setEditItem(null); setDrawerOpen(true) }
  const openEdit = (p) => { setEditItem(p); setDrawerOpen(true) }
  const closeDrawer = () => { setDrawerOpen(false); setEditItem(null) }

  const handleSave = async (formData, id) => { await onSave(formData, id) }
  const handleDelete = (id) => {
    if (!window.confirm('Delete this project?')) return
    onDelete(id)
  }

  // Export CSV
  const handleExport = () => {
    const headers = ['Code', 'Name', 'Department', 'Status', 'Priority', 'Owner', 'Start Date', 'End Date', 'Budget', 'Spent']
    const rows = projects.map((p) => [
      p.code, `"${p.name}"`, p.departmentName, p.status, p.priority,
      p.owner || '', p.startDate || '', p.endDate || '', p.budget || 0, p.spent || 0,
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const link = document.createElement('a')
    link.href = encodeURI(csv)
    link.download = `Toyota_Gurukul_Projects_${Date.now()}.csv`
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false
      if (priorityFilter && p.priority !== priorityFilter) return false
      if (deptFilter && p.departmentId !== deptFilter) return false
      if (localSearch) {
        const q = localSearch.toLowerCase()
        if (!`${p.name} ${p.code} ${p.owner} ${p.departmentName}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [projects, statusFilter, priorityFilter, deptFilter, localSearch])

  // KPI calculations
  const activeCount = projects.filter((p) => p.status === 'Active').length
  const completedCount = projects.filter((p) => p.status === 'Completed').length
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0)
  const totalSpent = projects.reduce((s, p) => s + (p.spent || 0), 0)

  return (
    <div className="dept-page-container">
      {/* Header */}
      <div className="budget-page-heading-row">
        <div className="heading-text-group">
          <div className="title-with-pill">
            <h1 className="page-main-title">Projects</h1>
            <span className="badge-active-fiscal">{activeCount} Active</span>
          </div>
          <p className="page-sub-title">
            Track, manage and monitor all departmental capital and operational projects.
          </p>
        </div>
        <div className="heading-actions-group">
          <button type="button" className="btn-export-outline" onClick={handleExport}>
            <Download size={14} /><span>Export CSV</span>
          </button>
          <button type="button" className="btn-create-plan-primary" onClick={openAdd}>
            <Plus size={14} /><span>Add Project</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dept-kpi-grid">
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper teal-icon-bg"><FolderGit2 size={18} className="stat-icon-teal" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL PROJECTS</span>
            <strong className="stat-value-headline">{projects.length}</strong>
            <span className="stat-trend-subtext">{activeCount} active</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper blue-icon-bg"><CheckCircle2 size={18} className="stat-icon-blue" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">COMPLETED</span>
            <strong className="stat-value-headline">{completedCount}</strong>
            <span className="stat-trend-subtext">this fiscal year</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper amber-icon-bg"><IndianRupee size={18} className="stat-icon-amber" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL PROJECT BUDGET</span>
            <strong className="stat-value-headline">{formatINR(totalBudget)}</strong>
            <span className="stat-trend-subtext">across all projects</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper purple-icon-bg"><TrendingUp size={18} className="stat-icon-purple" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL SPENT</span>
            <strong className="stat-value-headline">{formatINR(totalSpent)}</strong>
            <span className="stat-trend-subtext">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% of budget
            </span>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="filters-toolbar-card">
        <span className="filter-lead-label">Filter By:</span>

        <div className="exp-search-pill">
          <Search size={13} className="exp-search-icon" />
          <input
            type="text"
            className="exp-search-input"
            placeholder="Search projects..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-pill">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="filter-select">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="filter-select">
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <button type="button" className="reset-filters-btn" onClick={() => { setLocalSearch(''); setStatusFilter(''); setPriorityFilter(''); setDeptFilter('') }}>
          Reset
        </button>
      </div>

      {/* Project Count Label */}
      <div className="proj-results-label">
        Showing <strong>{filtered.length}</strong> of <strong>{projects.length}</strong> projects
      </div>

      {/* Project Cards Grid */}
      {filtered.length === 0 ? (
        <div className="dept-empty-state">
          <FolderGit2 size={36} />
          <p>No projects found. <button type="button" className="exp-empty-link" onClick={openAdd}>Add the first one.</button></p>
        </div>
      ) : (
        <div className="dept-cards-grid">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}

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

      <ProjectDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onSave={handleSave}
        editItem={editItem}
        departments={departments}
      />
    </div>
  )
}
