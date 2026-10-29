import React, { useState, useMemo } from 'react'
import {
  Plus,
  X,
  Search,
  Building2,
  Users,
  IndianRupee,
  MapPin,
  Mail,
  Phone,
  Pencil,
  Trash2,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
} from 'lucide-react'

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(val) || 0
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
  return `₹${new Intl.NumberFormat('en-IN').format(num)}`
}

const DIVISIONS = ['Manufacturing', 'Operations', 'Inspection', 'Engineering', 'Supply Chain', 'Administration', 'Finance', 'HR']

const EMPTY_FORM = {
  name: '',
  code: '',
  division: '',
  head: '',
  email: '',
  phone: '',
  location: '',
  headCount: '',
  annualBudget: '',
  description: '',
  active: true,
}

// Division color mapping
function divisionColor(division) {
  const map = {
    Manufacturing: { bg: '#dbeafe', color: '#1d4ed8' },
    Operations: { bg: '#ccfbf1', color: '#0f766e' },
    Inspection: { bg: '#fef3c7', color: '#b45309' },
    Engineering: { bg: '#f3e8ff', color: '#6d28d9' },
    'Supply Chain': { bg: '#ffe4e6', color: '#be123c' },
    Administration: { bg: '#e0f2fe', color: '#0369a1' },
    Finance: { bg: '#dcfce7', color: '#15803d' },
    HR: { bg: '#fef9c3', color: '#a16207' },
  }
  return map[division] || { bg: '#f1f5f9', color: '#475569' }
}

// Dept Card
function DeptCard({ dept, onEdit, onDelete }) {
  const { bg, color } = divisionColor(dept.division)
  return (
    <div className="dept-card">
      <div className="dept-card-header">
        <div className="dept-card-icon-wrap">
          <Building2 size={20} style={{ color }} />
        </div>
        <div className="dept-card-meta">
          <h3 className="dept-card-name">{dept.name}</h3>
          <span className="dept-code-chip">{dept.code}</span>
        </div>
        <span className="dept-division-pill" style={{ background: bg, color }}>
          {dept.division}
        </span>
      </div>

      {dept.description && (
        <p className="dept-card-desc">{dept.description}</p>
      )}

      <div className="dept-card-info-grid">
        {dept.head && (
          <div className="dept-info-row">
            <Users size={13} className="dept-info-icon" />
            <span>{dept.head}</span>
          </div>
        )}
        {dept.location && (
          <div className="dept-info-row">
            <MapPin size={13} className="dept-info-icon" />
            <span>{dept.location}</span>
          </div>
        )}
        {dept.email && (
          <div className="dept-info-row">
            <Mail size={13} className="dept-info-icon" />
            <span>{dept.email}</span>
          </div>
        )}
        {dept.phone && (
          <div className="dept-info-row">
            <Phone size={13} className="dept-info-icon" />
            <span>{dept.phone}</span>
          </div>
        )}
      </div>

      <div className="dept-card-stats">
        <div className="dept-stat">
          <Users size={13} />
          <span className="dept-stat-label">Head Count</span>
          <strong className="dept-stat-val">{dept.headCount || '—'}</strong>
        </div>
        <div className="dept-stat-divider" />
        <div className="dept-stat">
          <IndianRupee size={13} />
          <span className="dept-stat-label">Annual Budget</span>
          <strong className="dept-stat-val">{dept.annualBudget ? formatINR(dept.annualBudget) : '—'}</strong>
        </div>
      </div>

      <div className="dept-card-footer">
        <span className={`dept-status-chip ${dept.active ? 'dept-active' : 'dept-inactive'}`}>
          {dept.active ? <><CheckCircle2 size={11} /> Active</> : <><XCircle size={11} /> Inactive</>}
        </span>
        <div className="dept-card-actions">
          <button type="button" className="dept-action-btn" title="Edit department" onClick={() => onEdit(dept)}>
            <Pencil size={13} />
          </button>
          <button type="button" className="dept-action-btn dept-action-delete" title="Remove department" onClick={() => onDelete(dept.id)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Add / Edit Drawer Form
function DeptDrawerForm({ onClose, onSave, editItem }) {
  const [form, setForm] = useState(() => editItem ? { ...editItem } : { ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Department name is required'
    if (!form.code.trim()) e.code = 'Department code is required'
    if (!form.division) e.division = 'Division is required'
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
          headCount: form.headCount ? Number(form.headCount) : undefined,
          annualBudget: form.annualBudget ? Number(form.annualBudget) : undefined,
        },
        editItem?.id
      )
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save department.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="exp-drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exp-drawer">
        <div className="exp-drawer-header">
          <div>
            <h2 className="exp-drawer-title">{editItem ? 'Edit Department' : 'Add New Department'}</h2>
            <p className="exp-drawer-subtitle">Fill in the department details below</p>
          </div>
          <button type="button" className="exp-drawer-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="exp-drawer-form">
          {/* Name + Code */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Department Name <span className="req">*</span></label>
              <input
                type="text"
                className={`exp-form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Press Shop"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
              {errors.name && <span className="exp-field-error">{errors.name}</span>}
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Code <span className="req">*</span></label>
              <input
                type="text"
                className={`exp-form-input ${errors.code ? 'input-error' : ''}`}
                placeholder="e.g. PRESS"
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                maxLength={8}
              />
              {errors.code && <span className="exp-field-error">{errors.code}</span>}
            </div>
          </div>

          {/* Division */}
          <div className="exp-form-field">
            <label className="exp-form-label">Division <span className="req">*</span></label>
            <select
              className={`exp-form-select ${errors.division ? 'input-error' : ''}`}
              value={form.division}
              onChange={(e) => set('division', e.target.value)}
            >
              <option value="">Select Division</option>
              {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.division && <span className="exp-field-error">{errors.division}</span>}
          </div>

          {/* Head + Location */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Department Head</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="Full name"
                value={form.head}
                onChange={(e) => set('head', e.target.value)}
              />
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Location</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="e.g. Block A, Bay 1"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Email</label>
              <input
                type="email"
                className="exp-form-input"
                placeholder="dept@toyota-gurukul.in"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Phone</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="+91-80-4411-XXXX"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
          </div>

          {/* Head Count + Annual Budget */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Head Count</label>
              <input
                type="number"
                min="1"
                className="exp-form-input"
                placeholder="Number of employees"
                value={form.headCount}
                onChange={(e) => set('headCount', e.target.value)}
              />
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Annual Budget (₹)</label>
              <input
                type="number"
                min="0"
                className="exp-form-input"
                placeholder="0"
                value={form.annualBudget}
                onChange={(e) => set('annualBudget', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="exp-form-field">
            <label className="exp-form-label">Description</label>
            <textarea
              className="exp-form-textarea"
              rows={3}
              placeholder="Brief description of department responsibilities"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Status toggle */}
          {editItem && (
            <div className="exp-form-field">
              <label className="exp-form-label">Status</label>
              <div className="dept-toggle-row">
                <button
                  type="button"
                  className={`dept-toggle-btn ${form.active ? 'toggle-active' : ''}`}
                  onClick={() => set('active', true)}
                >
                  <CheckCircle2 size={13} /> Active
                </button>
                <button
                  type="button"
                  className={`dept-toggle-btn ${!form.active ? 'toggle-inactive' : ''}`}
                  onClick={() => set('active', false)}
                >
                  <XCircle size={13} /> Inactive
                </button>
              </div>
            </div>
          )}

          <div className="exp-drawer-actions">
            <button type="button" className="btn-export-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-create-plan-primary" disabled={saving}>
              {saving ? 'Saving…' : editItem ? 'Update Department' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeptDrawer({ isOpen, onClose, onSave, editItem }) {
  if (!isOpen) return null
  return (
    <DeptDrawerForm
      key={`${editItem?.id ?? 'new'}-open`}
      onClose={onClose}
      onSave={onSave}
      editItem={editItem}
    />
  )
}

export default function DepartmentsPage({ departments, onSave, onDelete }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [localSearch, setLocalSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')

  const openAdd = () => { setEditItem(null); setDrawerOpen(true) }
  const openEdit = (dept) => { setEditItem(dept); setDrawerOpen(true) }
  const closeDrawer = () => { setDrawerOpen(false); setEditItem(null) }

  const handleSave = async (formData, id) => {
    await onSave(formData, id)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Remove this department? It will be marked inactive.')) return
    onDelete(id)
  }

  // Export CSV
  const handleExport = () => {
    const headers = ['Name', 'Code', 'Division', 'Head', 'Location', 'Email', 'Phone', 'Head Count', 'Annual Budget', 'Status']
    const rows = departments.map((d) => [
      `"${d.name}"`, d.code, d.division, d.head || '', d.location || '', d.email || '', d.phone || '',
      d.headCount || '', d.annualBudget || '', d.active ? 'Active' : 'Inactive',
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const link = document.createElement('a')
    link.href = encodeURI(csv)
    link.download = `Toyota_Gurukul_Departments_${Date.now()}.csv`
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  const divisions = useMemo(() => [...new Set(departments.map((d) => d.division).filter(Boolean))].sort(), [departments])

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      if (statusFilter === 'active' && !d.active) return false
      if (statusFilter === 'inactive' && d.active) return false
      if (divisionFilter && d.division !== divisionFilter) return false
      if (localSearch) {
        const q = localSearch.toLowerCase()
        if (!`${d.name} ${d.code} ${d.head} ${d.division} ${d.location}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [departments, statusFilter, divisionFilter, localSearch])

  const activeCnt = departments.filter((d) => d.active).length
  const totalHead = departments.filter((d) => d.active).reduce((s, d) => s + (d.headCount || 0), 0)
  const totalBudget = departments.filter((d) => d.active).reduce((s, d) => s + (d.annualBudget || 0), 0)

  return (
    <div className="dept-page-container">
      {/* Header */}
      <div className="budget-page-heading-row">
        <div className="heading-text-group">
          <div className="title-with-pill">
            <h1 className="page-main-title">Departments</h1>
            <span className="badge-active-fiscal">{activeCnt} Active</span>
          </div>
          <p className="page-sub-title">
            Manage Toyota Gurukul manufacturing departments, budgets and team leads.
          </p>
        </div>
        <div className="heading-actions-group">
          <button type="button" className="btn-export-outline" onClick={handleExport}>
            <Download size={14} /><span>Export CSV</span>
          </button>
          <button type="button" className="btn-create-plan-primary" onClick={openAdd}>
            <Plus size={14} /><span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="dept-kpi-grid">
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper teal-icon-bg"><Building2 size={18} className="stat-icon-teal" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL DEPARTMENTS</span>
            <strong className="stat-value-headline">{departments.length}</strong>
            <span className="stat-trend-subtext">{activeCnt} active</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper blue-icon-bg"><Users size={18} className="stat-icon-blue" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL HEADCOUNT</span>
            <strong className="stat-value-headline">{totalHead}</strong>
            <span className="stat-trend-subtext">across active depts</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper amber-icon-bg"><IndianRupee size={18} className="stat-icon-amber" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">COMBINED ANNUAL BUDGET</span>
            <strong className="stat-value-headline">{formatINR(totalBudget)}</strong>
            <span className="stat-trend-subtext">FY 2026-27</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper purple-icon-bg"><Filter size={18} className="stat-icon-purple" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">DIVISIONS</span>
            <strong className="stat-value-headline">{divisions.length}</strong>
            <span className="stat-trend-subtext">unique divisions</span>
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
            placeholder="Search departments..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-pill">
          <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} className="filter-select">
            <option value="">All Divisions</option>
            {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="">All</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <button type="button" className="reset-filters-btn" onClick={() => { setLocalSearch(''); setDivisionFilter(''); setStatusFilter('active') }}>
          Reset
        </button>
      </div>

      {/* Department Cards Grid */}
      {filtered.length === 0 ? (
        <div className="dept-empty-state">
          <Building2 size={36} />
          <p>No departments found. <button type="button" className="exp-empty-link" onClick={openAdd}>Add the first one.</button></p>
        </div>
      ) : (
        <div className="dept-cards-grid">
          {filtered.map((dept) => (
            <DeptCard key={dept.id} dept={dept} onEdit={openEdit} onDelete={handleDelete} />
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

      <DeptDrawer isOpen={drawerOpen} onClose={closeDrawer} onSave={handleSave} editItem={editItem} />
    </div>
  )
}
