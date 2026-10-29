import React, { useState, useMemo, useCallback } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  ChevronDown,
  Download,
  IndianRupee,
  FileSpreadsheet,
  CircleDollarSign,
  CheckSquare,
  Square,
  Layers,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react'

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatINR(val) {
  const n = typeof val === 'number' ? val : Number(val) || 0
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${new Intl.NumberFormat('en-IN').format(n)}`
}

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

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Status metadata ────────────────────────────────────────────────────────

function itemStatusMeta(status) {
  const map = {
    'On Track':      { bg: '#dcfce7', color: '#15803d', label: 'On Track' },
    'Pending Review':{ bg: '#fef3c7', color: '#b45309', label: 'Pending Review' },
    'On Hold':       { bg: '#fee2e2', color: '#b91c1c', label: 'On Hold' },
    'Pending':       { bg: '#fef3c7', color: '#b45309', label: 'Pending' },
    'Approved':      { bg: '#dcfce7', color: '#15803d', label: 'Approved' },
    'Rejected':      { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' },
  }
  return map[status] || { bg: '#f1f5f9', color: '#64748b', label: status }
}

// ─── Batch Approval Modal ──────────────────────────────────────────────────

function BatchApprovalModal({ isOpen, selectedItems, onClose, onConfirm, isBusy }) {
  const [action, setAction] = useState('Approved')
  const [approverNote, setApproverNote] = useState('')
  const [approverName, setApproverName] = useState('Finance Manager')
  const totalAmount = selectedItems.reduce((s, i) => s + i.amount, 0)

  if (!isOpen) return null

  return (
    <div className="appr-modal-overlay" onClick={(e) => e.target === e.currentTarget && !isBusy && onClose()}>
      <div className="appr-modal">
        {/* Modal Header */}
        <div className="appr-modal-header">
          <div className="appr-modal-title-row">
            <div className="appr-modal-icon-wrap">
              <Layers size={20} style={{ color: '#0d9488' }} />
            </div>
            <div>
              <h2 className="appr-modal-title">Batch Approval</h2>
              <p className="appr-modal-subtitle">Review and process {selectedItems.length} selected item{selectedItems.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {!isBusy && (
            <button type="button" className="exp-drawer-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Summary strip */}
        <div className="appr-batch-summary-strip">
          <div className="appr-batch-summary-item">
            <span className="appr-batch-summary-label">Items Selected</span>
            <strong className="appr-batch-summary-val">{selectedItems.length}</strong>
          </div>
          <div className="appr-batch-summary-divider" />
          <div className="appr-batch-summary-item">
            <span className="appr-batch-summary-label">Budget Plans</span>
            <strong className="appr-batch-summary-val">{selectedItems.filter(i => i.type === 'budget').length}</strong>
          </div>
          <div className="appr-batch-summary-divider" />
          <div className="appr-batch-summary-item">
            <span className="appr-batch-summary-label">Expenses</span>
            <strong className="appr-batch-summary-val">{selectedItems.filter(i => i.type === 'expense').length}</strong>
          </div>
          <div className="appr-batch-summary-divider" />
          <div className="appr-batch-summary-item">
            <span className="appr-batch-summary-label">Total Amount</span>
            <strong className="appr-batch-summary-val appr-amount">{formatINR(totalAmount)}</strong>
          </div>
        </div>

        {/* Selected items list */}
        <div className="appr-batch-items-list">
          {selectedItems.map((item) => {
            const sm = itemStatusMeta(item.status)
            return (
              <div key={item.id} className="appr-batch-item-row">
                <div className={`appr-type-pill appr-type-${item.type}`}>
                  {item.type === 'budget' ? <FileSpreadsheet size={11} /> : <CircleDollarSign size={11} />}
                  {item.type === 'budget' ? 'Budget' : 'Expense'}
                </div>
                <div className="appr-batch-item-info">
                  <span className="appr-batch-item-title">{item.title}</span>
                  <span className="appr-batch-item-sub">{item.subtitle} • {item.refCode}</span>
                </div>
                <span className="appr-batch-item-amount">{formatINR(item.amount)}</span>
                <span className="appr-status-chip" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
              </div>
            )
          })}
        </div>

        {/* Action selector */}
        <div className="appr-batch-action-section">
          <p className="appr-batch-action-label">Select Action</p>
          <div className="appr-action-toggle-row">
            <button
              type="button"
              className={`appr-action-toggle-btn ${action === 'Approved' ? 'appr-toggle-approve' : ''}`}
              onClick={() => setAction('Approved')}
              disabled={isBusy}
            >
              <CheckCircle2 size={15} />
              Approve All Selected
            </button>
            <button
              type="button"
              className={`appr-action-toggle-btn ${action === 'Rejected' ? 'appr-toggle-reject' : ''}`}
              onClick={() => setAction('Rejected')}
              disabled={isBusy}
            >
              <XCircle size={15} />
              Reject All Selected
            </button>
          </div>

          <div className="appr-batch-form-row">
            <div className="exp-form-field">
              <label className="exp-form-label">Approver Name</label>
              <input
                type="text"
                className="exp-form-input"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                disabled={isBusy}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="exp-form-field">
            <label className="exp-form-label">Approval Note (optional)</label>
            <textarea
              className="exp-form-textarea"
              rows={2}
              value={approverNote}
              onChange={(e) => setApproverNote(e.target.value)}
              disabled={isBusy}
              placeholder="Add a brief note for audit trail..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="appr-modal-footer">
          <button type="button" className="btn-export-outline" onClick={onClose} disabled={isBusy}>
            Cancel
          </button>
          <button
            type="button"
            className={`appr-confirm-btn ${action === 'Approved' ? 'appr-confirm-approve' : 'appr-confirm-reject'}`}
            onClick={() => onConfirm(action, approverName, approverNote)}
            disabled={isBusy || selectedItems.length === 0}
          >
            {isBusy ? (
              <><Loader2 size={14} className="appr-spinner" /> Processing…</>
            ) : action === 'Approved' ? (
              <><CheckCircle2 size={14} /> Confirm Approval ({selectedItems.length})</>
            ) : (
              <><XCircle size={14} /> Confirm Rejection ({selectedItems.length})</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Individual item row in the approval table ─────────────────────────────

function ApprovalRow({ item, selected, onToggle, onApprove, onReject }) {
  const sm = itemStatusMeta(item.status)
  return (
    <tr className={`table-data-row ${selected ? 'appr-row-selected' : ''}`}>
      {/* Checkbox */}
      <td className="appr-check-col">
        <button type="button" className="appr-check-btn" onClick={() => onToggle(item.id)} aria-label="Select">
          {selected
            ? <CheckSquare size={16} style={{ color: '#0d9488' }} />
            : <Square size={16} style={{ color: '#cbd5e1' }} />
          }
        </button>
      </td>

      {/* Type badge */}
      <td>
        <span className={`appr-type-pill appr-type-${item.type}`}>
          {item.type === 'budget' ? <FileSpreadsheet size={11} /> : <CircleDollarSign size={11} />}
          {item.type === 'budget' ? 'Budget' : 'Expense'}
        </span>
      </td>

      {/* Ref code */}
      <td className="td-code-val">{item.refCode}</td>

      {/* Title + subtitle */}
      <td>
        <div className="exp-desc-cell">
          <span className="exp-desc-main">{item.title}</span>
          <span className="exp-desc-remark">{item.subtitle}</span>
        </div>
      </td>

      {/* Department */}
      <td className="td-section-val">{item.departmentName}</td>

      {/* Classification */}
      <td>
        <span className={`exp-cat-pill ${item.classification === 'CAPEX' ? 'exp-cat-capex' : 'exp-cat-opex'}`}>
          {item.classification || '—'}
        </span>
      </td>

      {/* Amount */}
      <td className="td-amount-bold">{formatINR(item.amount)}</td>

      {/* Status */}
      <td>
        <span className="appr-status-chip" style={{ background: sm.bg, color: sm.color }}>
          {sm.label}
        </span>
      </td>

      {/* Submitted */}
      <td className="td-section-val appr-time-cell" title={formatDate(item.submittedAt)}>
        {timeAgo(item.submittedAt)}
      </td>

      {/* Actions */}
      <td className="col-actions">
        <div className="exp-action-btns">
          <button
            type="button"
            className="exp-action-approve"
            title="Approve this item"
            onClick={() => onApprove(item.id)}
          >
            <CheckCircle2 size={13} />
          </button>
          <button
            type="button"
            className="appr-reject-btn"
            title="Reject this item"
            onClick={() => onReject(item.id)}
          >
            <XCircle size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Main Approvals Page ────────────────────────────────────────────────────

export default function ApprovalsPage({
  approvalItems,
  summary,
  onBatchApprove,
  onSingleApprove,
  onSingleReject,
}) {
  const [localSearch, setLocalSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [batchOpen, setBatchOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // ── Filtering ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return approvalItems.filter((item) => {
      if (typeFilter && item.type !== typeFilter) return false
      if (statusFilter && item.status !== statusFilter) return false
      if (deptFilter && item.departmentId !== deptFilter) return false
      if (localSearch) {
        const q = localSearch.toLowerCase()
        if (!`${item.title} ${item.refCode} ${item.departmentName} ${item.submittedBy}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [approvalItems, typeFilter, statusFilter, deptFilter, localSearch])

  const allFilteredIds = filtered.map((i) => i.id)
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selected.has(id))
  const someSelected = allFilteredIds.some((id) => selected.has(id))
  const selectedItems = approvalItems.filter((i) => selected.has(i.id))

  // ── Selection helpers ──────────────────────────────────────────────────
  const toggleItem = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        allFilteredIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      setSelected((prev) => new Set([...prev, ...allFilteredIds]))
    }
  }

  const clearSelection = () => setSelected(new Set())

  // ── Single item actions ────────────────────────────────────────────────
  const handleSingleApprove = async (id) => {
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await onSingleApprove(id)
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
      showSuccess('Item approved successfully.')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Approval failed.')
    }
  }

  const handleSingleReject = async (id) => {
    if (!window.confirm('Reject this item?')) return
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await onSingleReject(id)
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
      showSuccess('Item rejected.')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Rejection failed.')
    }
  }

  // ── Batch action ───────────────────────────────────────────────────────
  const handleBatchConfirm = async (action, approverName) => {
    if (isBusy) return
    setIsBusy(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await onBatchApprove(Array.from(selected), action, approverName)
      setBatchOpen(false)
      clearSelection()
      showSuccess(`${selected.size} item${selected.size !== 1 ? 's' : ''} ${action.toLowerCase()} successfully.`)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Batch operation failed.')
    } finally {
      setIsBusy(false)
    }
  }

  function showSuccess(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  // ── Unique departments for filter ──────────────────────────────────────
  const departments = useMemo(() => {
    const seen = new Map()
    approvalItems.forEach((i) => { if (i.departmentId) seen.set(i.departmentId, i.departmentName) })
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [approvalItems])

  // ── CSV Export ─────────────────────────────────────────────────────────
  const handleExport = () => {
    const headers = ['Type', 'Ref Code', 'Title', 'Department', 'Classification', 'Amount (INR)', 'Status', 'Submitted By', 'Submitted At']
    const rows = filtered.map((i) => [
      i.type, i.refCode, `"${i.title.replace(/"/g, '""')}"`, i.departmentName, i.classification,
      i.amount, i.status, i.submittedBy, i.submittedAt,
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const link = document.createElement('a')
    link.href = encodeURI(csv)
    link.download = `Toyota_Gurukul_Approvals_${Date.now()}.csv`
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  return (
    <div className="appr-page-container">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="budget-page-heading-row">
        <div className="heading-text-group">
          <div className="title-with-pill">
            <h1 className="page-main-title">Approvals</h1>
            {summary.pendingTotal > 0 && (
              <span className="appr-pending-badge">{summary.pendingTotal} Pending</span>
            )}
          </div>
          <p className="page-sub-title">
            Review, approve or reject budget activity plans and expense requests across all departments.
          </p>
        </div>
        <div className="heading-actions-group">
          <button type="button" className="btn-export-outline" onClick={handleExport}>
            <Download size={14} /><span>Export CSV</span>
          </button>
          <button
            type="button"
            className="appr-batch-btn"
            disabled={selected.size === 0}
            onClick={() => setBatchOpen(true)}
          >
            <Layers size={14} />
            <span>Batch Approval {selected.size > 0 ? `(${selected.size})` : ''}</span>
          </button>
        </div>
      </div>

      {/* ── Alerts ───────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="appr-alert appr-alert-success">
          <CheckCircle2 size={14} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="appr-alert appr-alert-error">
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* ── Summary KPI Cards ─────────────────────────────────────────── */}
      <div className="appr-kpi-grid">
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper amber-icon-bg"><Clock size={18} className="stat-icon-amber" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">PENDING APPROVALS</span>
            <strong className="stat-value-headline">{summary.pendingTotal}</strong>
            <span className="stat-trend-subtext">awaiting decision</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper blue-icon-bg"><FileSpreadsheet size={18} className="stat-icon-blue" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">BUDGET PLANS</span>
            <strong className="stat-value-headline">{summary.pendingBudgets}</strong>
            <span className="stat-trend-subtext">pending budget plans</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper teal-icon-bg"><CircleDollarSign size={18} className="stat-icon-teal" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">EXPENSE REQUESTS</span>
            <strong className="stat-value-headline">{summary.pendingExpenses}</strong>
            <span className="stat-trend-subtext">pending expenses</span>
          </div>
        </div>
        <div className="exp-kpi-card">
          <div className="stat-icon-wrapper purple-icon-bg"><IndianRupee size={18} className="stat-icon-purple" /></div>
          <div className="stat-content-col">
            <span className="stat-caption-text">PENDING AMOUNT</span>
            <strong className="stat-value-headline">{formatINR(summary.pendingAmount)}</strong>
            <span className="stat-trend-subtext">total value awaiting</span>
          </div>
        </div>
      </div>

      {/* ── Selection action bar (shown when items selected) ─────────── */}
      {selected.size > 0 && (
        <div className="appr-selection-bar">
          <div className="appr-selection-info">
            <CheckSquare size={15} style={{ color: '#0d9488' }} />
            <span><strong>{selected.size}</strong> item{selected.size !== 1 ? 's' : ''} selected</span>
            <span className="appr-selection-amount">
              Total: <strong>{formatINR(selectedItems.reduce((s, i) => s + i.amount, 0))}</strong>
            </span>
          </div>
          <div className="appr-selection-actions">
            <button type="button" className="appr-quick-approve" onClick={() => { setBatchOpen(true) }}>
              <Layers size={13} /> Batch Approval
            </button>
            <button type="button" className="appr-clear-sel" onClick={clearSelection}>
              <X size={13} /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* ── Filter toolbar ────────────────────────────────────────────── */}
      <div className="filters-toolbar-card">
        <span className="filter-lead-label">Filter By:</span>
        <div className="exp-search-pill">
          <Search size={13} className="exp-search-icon" />
          <input
            type="text"
            className="exp-search-input"
            placeholder="Search approvals..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-pill">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            <option value="budget">Budget Plans</option>
            <option value="expense">Expenses</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Pending Review">Pending Review</option>
            <option value="On Hold">On Hold</option>
            <option value="Pending">Pending (Expense)</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="filter-select">
            <option value="">All Departments</option>
            {departments.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <button type="button" className="reset-filters-btn"
          onClick={() => { setLocalSearch(''); setTypeFilter(''); setStatusFilter(''); setDeptFilter('') }}>
          Reset
        </button>
      </div>

      {/* ── Approvals Table ──────────────────────────────────────────── */}
      <section className="allocations-table-card">
        <div className="table-top-header-row">
          <div>
            <h2 className="table-main-title">Approval Queue</h2>
            <p className="table-sub-desc">Pending budget plans and expense requests requiring your decision</p>
          </div>
          <span className="batch-label">
            <AlertTriangle size={13} />
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} pending
          </span>
        </div>

        <div className="stitch-table-scroll-container">
          <table className="department-allocations-table">
            <thead>
              <tr>
                {/* Select-all header checkbox */}
                <th className="appr-check-col">
                  <button type="button" className="appr-check-btn" onClick={toggleAll} aria-label="Select all">
                    {allSelected
                      ? <CheckSquare size={15} style={{ color: '#0d9488' }} />
                      : someSelected
                        ? <CheckSquare size={15} style={{ color: '#94a3b8' }} />
                        : <Square size={15} style={{ color: '#cbd5e1' }} />
                    }
                  </button>
                </th>
                <th style={{ minWidth: 80 }}>TYPE</th>
                <th style={{ minWidth: 100 }}>REF CODE</th>
                <th style={{ minWidth: 220 }}>DESCRIPTION</th>
                <th style={{ minWidth: 150 }}>DEPARTMENT</th>
                <th style={{ minWidth: 70 }}>CLASS.</th>
                <th style={{ minWidth: 120 }}>AMOUNT (₹)</th>
                <th style={{ minWidth: 120 }}>STATUS</th>
                <th style={{ minWidth: 90 }}>SUBMITTED</th>
                <th className="col-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="exp-empty-row">
                    <div className="exp-empty-state">
                      <CheckCircle2 size={28} />
                      <p>
                        {approvalItems.length === 0
                          ? 'All items have been reviewed. No pending approvals.'
                          : 'No items match the current filters.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((item) => (
                <ApprovalRow
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onToggle={toggleItem}
                  onApprove={handleSingleApprove}
                  onReject={handleSingleReject}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="table-pagination-footer">
          <span className="table-showing-summary">
            Showing <strong>{filtered.length}</strong> of <strong>{approvalItems.length}</strong> pending items
          </span>
          {selected.size > 0 && (
            <span className="appr-footer-selection">
              {selected.size} selected — <button type="button" className="exp-empty-link" onClick={() => setBatchOpen(true)}>Batch Approval</button>
            </span>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
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

      {/* ── Batch Approval Modal ─────────────────────────────────────── */}
      <BatchApprovalModal
        isOpen={batchOpen}
        selectedItems={selectedItems}
        onClose={() => !isBusy && setBatchOpen(false)}
        onConfirm={handleBatchConfirm}
        isBusy={isBusy}
      />
    </div>
  )
}
