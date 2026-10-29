import React, { useState, useMemo, useCallback } from 'react'
import {
  Plus,
  X,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronDown,
  Search,
  IndianRupee,
  Activity,
  BarChart2,
  Filter,
} from 'lucide-react'

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(val) || 0
  return `₹${new Intl.NumberFormat('en-IN').format(num)}`
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  departmentId: '',
  departmentName: '',
  category: 'CAPEX',
  budgetCodeRef: '',
  amount: '',
  vendor: '',
  invoiceNo: '',
  status: 'Pending',
  approvedBy: '',
  remarks: '',
}

// Add / Edit Expense Drawer
function ExpenseDrawerForm({ onClose, onSave, departments, editItem }) {
  const [form, setForm] = useState(() => editItem || EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleDeptChange = (deptId) => {
    const dept = departments.find((d) => d.id === deptId)
    setForm((prev) => ({ ...prev, departmentId: deptId, departmentName: dept?.name || '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.departmentId) e.departmentId = 'Department is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Valid amount is required'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({ ...form, amount: Number(form.amount) })
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save expense.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="exp-drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exp-drawer">
        {/* Drawer Header */}
        <div className="exp-drawer-header">
          <div>
            <h2 className="exp-drawer-title">{editItem ? 'Edit Expense' : 'Add New Expense'}</h2>
            <p className="exp-drawer-subtitle">Record an expense against a budget activity plan</p>
          </div>
          <button type="button" className="exp-drawer-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="exp-drawer-form">
          {/* Row 1: Date + Vendor */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Date <span className="req">*</span></label>
              <input
                type="date"
                className={`exp-form-input ${errors.date ? 'input-error' : ''}`}
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
              {errors.date && <span className="exp-field-error">{errors.date}</span>}
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Invoice No.</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="e.g. INV-KR-2026-0045"
                value={form.invoiceNo}
                onChange={(e) => set('invoiceNo', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="exp-form-field">
            <label className="exp-form-label">Description <span className="req">*</span></label>
            <input
              type="text"
              className={`exp-form-input ${errors.description ? 'input-error' : ''}`}
              placeholder="Brief expense description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
            {errors.description && <span className="exp-field-error">{errors.description}</span>}
          </div>

          {/* Row 2: Dept + Category */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Department <span className="req">*</span></label>
              <select
                className={`exp-form-select ${errors.departmentId ? 'input-error' : ''}`}
                value={form.departmentId}
                onChange={(e) => handleDeptChange(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.departmentId && <span className="exp-field-error">{errors.departmentId}</span>}
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Category</label>
              <select
                className="exp-form-select"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="CAPEX">CAPEX — Capital Expenditure</option>
                <option value="OPEX">OPEX — Operating Expenditure</option>
              </select>
            </div>
          </div>

          {/* Row 3: Amount + Budget Code Ref */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Amount (₹) <span className="req">*</span></label>
              <input
                type="number"
                min="1"
                className={`exp-form-input ${errors.amount ? 'input-error' : ''}`}
                placeholder="0"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
              {errors.amount && <span className="exp-field-error">{errors.amount}</span>}
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Budget Code Reference</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="e.g. 1806016"
                value={form.budgetCodeRef}
                onChange={(e) => set('budgetCodeRef', e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Vendor + Status */}
          <div className="exp-form-row-2">
            <div className="exp-form-field">
              <label className="exp-form-label">Vendor / Supplier</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="Vendor name"
                value={form.vendor}
                onChange={(e) => set('vendor', e.target.value)}
              />
            </div>
            <div className="exp-form-field">
              <label className="exp-form-label">Status</label>
              <select
                className="exp-form-select"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Approved By */}
          {form.status === 'Approved' && (
            <div className="exp-form-field">
              <label className="exp-form-label">Approved By</label>
              <input
                type="text"
                className="exp-form-input"
                placeholder="Approver name"
                value={form.approvedBy}
                onChange={(e) => set('approvedBy', e.target.value)}
              />
            </div>
          )}

          {/* Remarks */}
          <div className="exp-form-field">
            <label className="exp-form-label">Remarks</label>
            <textarea
              className="exp-form-textarea"
              rows={3}
              placeholder="Optional notes or remarks"
              value={form.remarks}
              onChange={(e) => set('remarks', e.target.value)}
            />
          </div>

          {/* Drawer Actions */}
          <div className="exp-drawer-actions">
            <button type="button" className="btn-export-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create-plan-primary" disabled={saving}>
              {saving ? 'Saving…' : editItem ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Outer wrapper: mounts ExpenseDrawerForm with a fresh key on each open to avoid setState-in-effect
function ExpenseDrawer({ isOpen, onClose, onSave, departments, editItem }) {
  if (!isOpen) return null
  return (
    <ExpenseDrawerForm
      key={`${editItem?.id ?? 'new'}-open`}
      onClose={onClose}
      onSave={onSave}
      departments={departments}
      editItem={editItem}
    />
  )
}

// Main Expense Tracking Page
export default function ExpenseTrackingPage({
  expenses,
  departments,
  search,
  onAdd,
  onDelete,
  onUpdateStatus,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deptFilter, setDeptFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [localSearch, setLocalSearch] = useState(search || '')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const openAdd = () => { setEditItem(null); setDrawerOpen(true) }
  const openEdit = (item) => { setEditItem(item); setDrawerOpen(true) }
  const closeDrawer = () => { setDrawerOpen(false); setEditItem(null) }

  const handleSave = useCallback(async (formData) => {
    await onAdd(formData, editItem?.id)
  }, [onAdd, editItem])

  const handleDelete = useCallback((id) => {
    if (!window.confirm('Delete this expense record?')) return
    onDelete(id)
  }, [onDelete])

  // Filtered list
  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (deptFilter && e.departmentId !== deptFilter) return false
      if (categoryFilter && e.category !== categoryFilter) return false
      if (statusFilter && e.status !== statusFilter) return false
      if (localSearch) {
        const q = localSearch.toLowerCase()
        const text = `${e.description} ${e.departmentName} ${e.vendor} ${e.invoiceNo} ${e.budgetCodeRef}`.toLowerCase()
        if (!text.includes(q)) return false
      }
      return true
    })
  }, [expenses, deptFilter, categoryFilter, statusFilter, localSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  // Summary totals for filtered view
  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0)
  const filteredApproved = filtered.filter((e) => e.status === 'Approved').reduce((s, e) => s + e.amount, 0)
  const filteredPending = filtered.filter((e) => e.status === 'Pending').reduce((s, e) => s + e.amount, 0)
  const filteredCapex = filtered.filter((e) => e.category === 'CAPEX').reduce((s, e) => s + e.amount, 0)

  // CSV Export
  const handleExport = () => {
    const headers = ['Date', 'Description', 'Department', 'Category', 'Budget Code', 'Amount (INR)', 'Vendor', 'Invoice No.', 'Status', 'Approved By', 'Remarks']
    const rows = filtered.map((e) => [
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.departmentName,
      e.category,
      e.budgetCodeRef,
      e.amount,
      `"${(e.vendor || '').replace(/"/g, '""')}"`,
      e.invoiceNo || '',
      e.status,
      e.approvedBy || '',
      `"${(e.remarks || '').replace(/"/g, '""')}"`,
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const link = document.createElement('a')
    link.href = encodeURI(csv)
    link.download = `Toyota_Gurukul_Expenses_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFilters = () => {
    setDeptFilter(''); setCategoryFilter(''); setStatusFilter(''); setLocalSearch(''); setCurrentPage(1)
  }

  return (
    <div className="exp-page-container">
      {/* Page Header */}
      <div className="budget-page-heading-row">
        <div className="heading-text-group">
          <div className="title-with-pill">
            <h1 className="page-main-title">Expense Tracking</h1>
            <span className="badge-active-fiscal">FY 2026-27</span>
          </div>
          <p className="page-sub-title">
            Record, approve, and audit all capital and operating expenditures across departments.
          </p>
        </div>
        <div className="heading-actions-group">
          <button type="button" className="btn-export-outline" onClick={handleExport}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn-create-plan-primary" onClick={openAdd}>
            <Plus size={14} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="exp-kpi-grid">
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper teal-icon-bg">
            <IndianRupee size={18} className="stat-icon-teal" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL EXPENSES</span>
            <strong className="stat-value-headline">{formatINR(filteredTotal)}</strong>
            <span className="stat-trend-subtext">{filtered.length} records</span>
          </div>
        </div>

        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper blue-icon-bg">
            <CheckCircle2 size={18} className="stat-icon-blue" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">APPROVED</span>
            <strong className="stat-value-headline">{formatINR(filteredApproved)}</strong>
            <span className="stat-trend-subtext">{filtered.filter((e) => e.status === 'Approved').length} entries</span>
          </div>
        </div>

        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper amber-icon-bg">
            <Clock size={18} className="stat-icon-amber" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">PENDING APPROVAL</span>
            <strong className="stat-value-headline">{formatINR(filteredPending)}</strong>
            <span className="stat-trend-subtext">{filtered.filter((e) => e.status === 'Pending').length} entries</span>
          </div>
        </div>

        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper purple-icon-bg">
            <BarChart2 size={18} className="stat-icon-purple" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">CAPEX EXPENSES</span>
            <strong className="stat-value-headline">{formatINR(filteredCapex)}</strong>
            <span className="stat-trend-subtext">
              {filteredTotal > 0 ? ((filteredCapex / filteredTotal) * 100).toFixed(0) : 0}% of total
            </span>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="filters-toolbar-card">
        <span className="filter-lead-label">
          <Filter size={13} />
          Filter By:
        </span>

        {/* Inline search */}
        <div className="exp-search-pill">
          <Search size={13} className="exp-search-icon" />
          <input
            type="text"
            className="exp-search-input"
            placeholder="Search expenses..."
            value={localSearch}
            onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1) }}
          />
        </div>

        <div className="filter-dropdown-pill">
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1) }}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="CAPEX">CAPEX</option>
            <option value="OPEX">OPEX</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <button type="button" className="reset-filters-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* Expenses Table */}
      <section className="allocations-table-card">
        <div className="table-top-header-row">
          <div>
            <h2 className="table-main-title">Expense Ledger</h2>
            <p className="table-sub-desc">All recorded expenditures with vendor, invoice, and approval details</p>
          </div>
          <div className="table-batch-actions">
            <span className="batch-label">
              <Activity size={13} />
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="stitch-table-scroll-container">
          <table className="department-allocations-table">
            <thead>
              <tr>
                <th className="col-hash">#</th>
                <th style={{ minWidth: 88 }}>DATE</th>
                <th style={{ minWidth: 220 }}>DESCRIPTION</th>
                <th style={{ minWidth: 150 }}>DEPARTMENT</th>
                <th style={{ minWidth: 70 }}>CAT.</th>
                <th style={{ minWidth: 90 }}>BUDGET CODE</th>
                <th style={{ minWidth: 120 }}>AMOUNT (₹)</th>
                <th style={{ minWidth: 160 }}>VENDOR</th>
                <th style={{ minWidth: 130 }}>INVOICE NO.</th>
                <th style={{ minWidth: 100 }}>STATUS</th>
                <th className="col-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="exp-empty-row">
                    <div className="exp-empty-state">
                      <Activity size={28} />
                      <p>No expense records found. <button type="button" className="exp-empty-link" onClick={openAdd}>Add the first one.</button></p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((expense, idx) => {
                const rowNum = (currentPage - 1) * pageSize + idx + 1
                return (
                  <tr key={expense.id} className="table-data-row">
                    <td className="col-hash td-hash-num">{rowNum}</td>
                    <td className="td-section-val" style={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</td>
                    <td>
                      <div className="exp-desc-cell">
                        <span className="exp-desc-main">{expense.description}</span>
                        {expense.remarks && <span className="exp-desc-remark">{expense.remarks}</span>}
                      </div>
                    </td>
                    <td className="td-section-val">{expense.departmentName}</td>
                    <td>
                      <span className={`exp-cat-pill ${expense.category === 'CAPEX' ? 'exp-cat-capex' : 'exp-cat-opex'}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="td-code-val">{expense.budgetCodeRef || '—'}</td>
                    <td className="td-amount-bold">{formatINR(expense.amount)}</td>
                    <td className="td-desc-val">{expense.vendor || '—'}</td>
                    <td className="td-section-val">{expense.invoiceNo || '—'}</td>
                    <td>
                      <span
                        className={`status-pill-badge ${
                          expense.status === 'Approved'
                            ? 'status-on-track'
                            : expense.status === 'Rejected'
                            ? 'status-on-hold'
                            : 'exp-status-pending'
                        }`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="exp-action-btns">
                        <button
                          type="button"
                          className="exp-action-edit"
                          title="Edit expense"
                          onClick={() => openEdit(expense)}
                        >
                          Edit
                        </button>
                        {expense.status === 'Pending' && (
                          <button
                            type="button"
                            className="exp-action-approve"
                            title="Approve expense"
                            onClick={() => onUpdateStatus(expense.id, 'Approved')}
                          >
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="exp-action-delete"
                          title="Delete expense"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-pagination-footer">
          <span className="table-showing-summary">
            Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> expense records
          </span>
          <div className="pagination-controls-row">
            <button
              type="button"
              className="page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`page-num-btn ${currentPage === i + 1 ? 'active-page' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              className="page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="portal-footer-line">
        <span className="copyright-text">
          <strong>TOYOTA Gurukul</strong> © 2028 Toyota Kirloskar Motor • Budget Management Portal. All rights reserved.
        </span>
        <div className="footer-links-group">
          <span>Privacy Policy</span>
          <span className="dot-divider">•</span>
          <span>Terms of Service</span>
          <span className="dot-divider">•</span>
          <span>Internal Helpdesk (Ext: 4402)</span>
        </div>
      </footer>

      {/* Add / Edit Drawer */}
      <ExpenseDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onSave={handleSave}
        departments={departments}
        editItem={editItem}
      />
    </div>
  )
}
