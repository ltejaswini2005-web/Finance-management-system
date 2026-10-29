import React, { useState, useMemo } from 'react'
import {
  FileText,
  ShieldCheck,
  Coins,
  Layers,
  Download,
  Plus,
  MoreVertical,
  CheckCircle2,
  Columns,
  ChevronDown,
  Trash2,
} from 'lucide-react'
import TimelineSchedule from './TimelineSchedule'

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, '')) || 0
  return new Intl.NumberFormat('en-IN').format(num)
}

export default function BudgetPlanningPage({
  budgets,
  departments,
  search,
  onCreateBudget, // opens Screen 1 (Modal)
  onCreateBudgetPlan, // opens Screen 3 (Full-page)
  onDelete,
  onStatusToggle,
  onBulkApprove,
}) {
  const [yearFilter, setYearFilter] = useState('2026')
  const [deptFilter, setDeptFilter] = useState('')
  const [quarterFilter, setQuarterFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 14

  const [activeMenuId, setActiveMenuId] = useState(null)

  // Reset filters
  const handleResetFilters = () => {
    setYearFilter('2026')
    setDeptFilter('')
    setQuarterFilter('')
    setStatusFilter('')
  }

  // Filtered dataset
  const filteredPlans = useMemo(() => {
    return budgets.filter((plan) => {
      if (deptFilter && plan.departmentId !== deptFilter && plan.activityHead !== deptFilter) {
        return false
      }
      if (statusFilter && plan.status !== statusFilter) {
        return false
      }
      if (quarterFilter) {
        const qKey = quarterFilter.toLowerCase()
        if (!plan.quartersActive?.[qKey]) return false
      }
      if (search) {
        const query = search.toLowerCase()
        const text = `${plan.budgetCode} ${plan.activityHead} ${plan.activityDescription} ${plan.departmentName} ${plan.section}`.toLowerCase()
        if (!text.includes(query)) return false
      }
      return true
    })
  }, [budgets, deptFilter, statusFilter, quarterFilter, search])

  // Pagination calculation
  const totalCount = filteredPlans.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredPlans.slice(start, start + pageSize)
  }, [filteredPlans, currentPage, pageSize])

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Budget Code', 'Activity Head', 'Section', 'Description', 'Requested (INR)', 'Timeline', 'Status']
    const rows = filteredPlans.map((p) => [
      p.budgetCode,
      p.activityHead,
      p.section,
      `"${p.activityDescription.replace(/"/g, '""')}"`,
      p.requestedAmount,
      p.timeline,
      p.status,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Toyota_Gurukul_Budget_Plan_FY26_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="budget-planning-page-container">
      {/* Page Title & Top Actions */}
      <div className="budget-page-heading-row">
        <div className="heading-text-group">
          <div className="title-with-pill">
            <h1 className="page-main-title">Budget Planning</h1>
            <span className="badge-active-fiscal">Active Fiscal Plan</span>
          </div>
          <p className="page-sub-title">
            Plan, schedule, and track departmental fiscal allocations across quarterly milestones and activity heads.
          </p>
        </div>

        <div className="heading-actions-group">
          <button
            type="button"
            className="btn-export-outline"
            onClick={handleExportCSV}
          >
            <Download size={14} />
            <span>Export Plan (CSV/XLSX)</span>
          </button>

          <button
            type="button"
            className="btn-create-budget-secondary"
            onClick={onCreateBudget}
            title="Open New Budget Plan Application form"
          >
            <Plus size={14} />
            <span>Create Budget</span>
          </button>

          <button
            type="button"
            className="btn-create-plan-primary"
            onClick={onCreateBudgetPlan}
            title="Create Comprehensive Budget Plan with BOM Specification"
          >
            <Plus size={14} />
            <span>Create Budget Plan</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filters-toolbar-card">
        <span className="filter-lead-label">Filter By:</span>

        <div className="filter-dropdown-pill">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="filter-select"
          >
            <option value="2026">Current Year: FY 2026-27</option>
            <option value="2025">Previous Year: FY 2025-26</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments (8)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Quarters (Q1 - Q4)</option>
            <option value="q1">Q1 (Apr - Jun)</option>
            <option value="q2">Q2 (Jul - Sep)</option>
            <option value="q3">Q3 (Oct - Dec)</option>
            <option value="q4">Q4 (Jan - Mar)</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <div className="filter-dropdown-pill">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="On Hold">On Hold</option>
            <option value="Approved">Approved</option>
          </select>
          <ChevronDown size={13} className="filter-caret" />
        </div>

        <button
          type="button"
          className="reset-filters-btn"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="stat-cards-four-grid">
        {/* Card 1: TOTAL PLANNED BUDGET */}
        <div className="summary-stat-box">
          <div className="stat-icon-wrapper teal-icon-bg">
            <FileText size={18} className="stat-icon-teal" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">TOTAL PLANNED BUDGET</span>
            <strong className="stat-value-headline">₹ / 2,10,00,000</strong>
            <span className="stat-trend-subtext green-trend">↑ 12% vs. last year</span>
          </div>
        </div>

        {/* Card 2: APPROVED & PHASED */}
        <div className="summary-stat-box">
          <div className="stat-icon-wrapper blue-icon-bg">
            <ShieldCheck size={18} className="stat-icon-blue" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">APPROVED & PHASED</span>
            <strong className="stat-value-headline">₹ 1,95,30,000</strong>
            <span className="stat-trend-subtext blue-trend">93.0% allocated across shops</span>
          </div>
        </div>

        {/* Card 3: BUFFER / UNALLOCATED */}
        <div className="summary-stat-box">
          <div className="stat-icon-wrapper amber-icon-bg">
            <Coins size={18} className="stat-icon-amber" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">BUFFER / UNALLOCATED</span>
            <strong className="stat-value-headline">₹ 14,70,000</strong>
            <span className="stat-trend-subtext amber-trend">7.0% contingency pool</span>
          </div>
        </div>

        {/* Card 4: ACTIVE ACTIVITY PLANS */}
        <div className="summary-stat-box">
          <div className="stat-icon-wrapper purple-icon-bg">
            <Layers size={18} className="stat-icon-purple" />
          </div>
          <div className="stat-content-col">
            <span className="stat-caption-text">ACTIVE ACTIVITY PLANS</span>
            <strong className="stat-value-headline">14 Heads <span className="fraction-dim">/ 28 Total</span></strong>
            <span className="stat-trend-subtext purple-trend">8 Manufacturing Divisions</span>
          </div>
        </div>
      </div>

      {/* Implementation Timeline & Phasing Schedule */}
      <TimelineSchedule />

      {/* Departmental Activity Head Allocations Table Card */}
      <section className="allocations-table-card">
        <div className="table-top-header-row">
          <div>
            <h2 className="table-main-title">Departmental Activity Head Allocations</h2>
            <p className="table-sub-desc">
              Detailed register matching shopfloor activity codes, requested limits, and quarterly milestones
            </p>
          </div>

          <div className="table-batch-actions">
            <span className="batch-label">Batch Operations:</span>
            <button
              type="button"
              className="batch-action-btn"
              onClick={() => onBulkApprove?.()}
            >
              <CheckCircle2 size={13} />
              <span>Bulk Approve</span>
            </button>
            <button
              type="button"
              className="batch-action-btn"
              onClick={() => alert('All standard columns are currently visible.')}
            >
              <Columns size={13} />
              <span>Column Visibility</span>
            </button>
          </div>
        </div>

        <div className="stitch-table-scroll-container">
          <table className="department-allocations-table">
            <thead>
              <tr>
                <th className="col-hash">#</th>
                <th className="col-code">BUDGET CODE</th>
                <th className="col-head">ACTIVITY HEAD</th>
                <th className="col-section">SECTION</th>
                <th className="col-desc">ACTIVITY DESCRIPTION</th>
                <th className="col-amount">FY 2026-27 REQUESTED (₹)</th>
                <th className="col-timeline">IMPLEMENTATION TIMELINE</th>
                <th className="col-quarter-dot">Q1</th>
                <th className="col-quarter-dot">Q2</th>
                <th className="col-quarter-dot">Q3</th>
                <th className="col-quarter-dot">Q4</th>
                <th className="col-status">STATUS</th>
                <th className="col-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.map((plan, idx) => {
                const rowNum = (currentPage - 1) * pageSize + idx + 1
                const isMenuOpen = activeMenuId === plan.id

                // Department badge styling
                const headLower = (plan.activityHead || '').toLowerCase()
                let headPillClass = 'badge-head-paint'
                if (headLower.includes('press')) headPillClass = 'badge-head-press'
                else if (headLower.includes('weld')) headPillClass = 'badge-head-weld'
                else if (headLower.includes('assy') || headLower.includes('assembly')) headPillClass = 'badge-head-assy'
                else if (headLower.includes('quality')) headPillClass = 'badge-head-quality'
                else if (headLower.includes('maint')) headPillClass = 'badge-head-maintenance'

                return (
                  <tr key={plan.id || plan.budgetCode} className="table-data-row">
                    <td className="col-hash td-hash-num">{rowNum}</td>
                    <td className="col-code td-code-val">{plan.budgetCode}</td>
                    <td className="col-head">
                      <span className={`head-pill ${headPillClass}`}>{plan.activityHead}</span>
                    </td>
                    <td className="col-section td-section-val">{plan.section}</td>
                    <td className="col-desc td-desc-val">{plan.activityDescription}</td>
                    <td className="col-amount td-amount-bold">
                      {formatINR(plan.requestedAmount)}
                    </td>
                    <td className="col-timeline td-timeline-val">{plan.timeline}</td>

                    {/* Q1 Dot */}
                    <td className="col-quarter-dot">
                      {plan.quartersActive?.q1 ? (
                        <span className="dot-indicator dot-teal" title="Q1 Scheduled" />
                      ) : (
                        <span className="dot-indicator dot-empty" />
                      )}
                    </td>

                    {/* Q2 Dot */}
                    <td className="col-quarter-dot">
                      {plan.quartersActive?.q2 ? (
                        <span className="dot-indicator dot-blue" title="Q2 Scheduled" />
                      ) : (
                        <span className="dot-indicator dot-empty" />
                      )}
                    </td>

                    {/* Q3 Dot */}
                    <td className="col-quarter-dot">
                      {plan.quartersActive?.q3 ? (
                        <span className="dot-indicator dot-amber" title="Q3 Scheduled" />
                      ) : (
                        <span className="dot-indicator dot-empty" />
                      )}
                    </td>

                    {/* Q4 Dot */}
                    <td className="col-quarter-dot">
                      {plan.quartersActive?.q4 ? (
                        <span className="dot-indicator dot-rose" title="Q4 Scheduled" />
                      ) : (
                        <span className="dot-indicator dot-empty" />
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="col-status">
                      <span
                        className={`status-pill-badge ${
                          plan.status === 'On Hold' ? 'status-on-hold' : 'status-on-track'
                        }`}
                      >
                        {plan.status || 'On Track'}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="col-actions actions-cell-relative">
                      <button
                        type="button"
                        className="btn-dots-menu"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : plan.id)}
                        aria-label="Actions"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isMenuOpen && (
                        <div className="row-action-popover" onMouseLeave={() => setActiveMenuId(null)}>
                          <button
                            type="button"
                            className="popover-item"
                            onClick={() => {
                              onStatusToggle(plan.id, plan.status === 'On Hold' ? 'On Track' : 'On Hold')
                              setActiveMenuId(null)
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Toggle Status ({plan.status === 'On Hold' ? 'On Track' : 'On Hold'})</span>
                          </button>
                          <button
                            type="button"
                            className="popover-item delete-item"
                            onClick={() => {
                              onDelete(plan.id)
                              setActiveMenuId(null)
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete Activity Plan</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="table-pagination-footer">
          <span className="table-showing-summary">
            Showing <strong>{paginatedPlans.length}</strong> of <strong>{totalCount}</strong> budget activity plans
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

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`page-num-btn ${currentPage === pageNum ? 'active-page' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}

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
    </div>
  )
}
