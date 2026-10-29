import React, { useState, useMemo } from 'react'
import {
  Download,
  Printer,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react'
import { getExpenses, getExpenseSummary } from '../data/localData'

// Format functions
function formatINR(value) {
  if (!value) return '₹0'
  return `₹${(value / 100000).toFixed(2).replace(/\.?0+$/, '')}L`
}

function formatINRFull(value) {
  if (!value) return '₹0'
  return `₹${value.toLocaleString('en-IN')}`
}

// KPI Card Component
function KpiCard({ icon: Icon, label, value, sub, iconBg }) {
  return (
    <div className="rep-kpi-card">
      <div className={`rep-kpi-icon-wrap ${iconBg}`}>
        <Icon size={20} />
      </div>
      <div className="rep-kpi-content">
        <h3 className="rep-kpi-label">{label}</h3>
        <div className="rep-kpi-value">{value}</div>
        {sub && <p className="rep-kpi-sub">{sub}</p>}
      </div>
    </div>
  )
}

// Department Bar Component
function DepartmentBar({ name, budget, total, color }) {
  const percentage = total > 0 ? ((budget / total) * 100).toFixed(1) : 0
  return (
    <div className="rep-dept-bar-item">
      <div className="rep-dept-bar-label">
        <span className="rep-dept-name">{name}</span>
        <span className="rep-dept-amount">{formatINR(budget)}</span>
      </div>
      <div className="rep-dept-bar-track">
        <div className="rep-dept-bar-fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
      <span className="rep-dept-bar-pct">{percentage}%</span>
    </div>
  )
}

// Simple Bar Chart for Budget vs Actual by Department
function BudgetByDepartmentChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="rep-chart-empty">
        <Activity size={32} />
        <p>No department data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.budget, d.actual)))
  const scale = maxValue > 0 ? 100 / maxValue : 1

  return (
    <div className="rep-chart-bars">
      <div className="rep-chart-y-axis">
        <div className="rep-chart-y-label">{formatINR(maxValue)}</div>
        <div className="rep-chart-y-label">{formatINR(maxValue * 0.5)}</div>
        <div className="rep-chart-y-label">₹0</div>
      </div>
      <div className="rep-chart-bars-wrap">
        {data.map((dept, i) => (
          <div key={i} className="rep-chart-dept-group">
            <div className="rep-chart-bars-pair">
              <div className="rep-chart-bar-col">
                <div
                  className="rep-chart-bar rep-chart-bar-budget"
                  style={{ height: `${dept.budget * scale}%` }}
                  title={`Budget: ${formatINR(dept.budget)}`}
                />
              </div>
              <div className="rep-chart-bar-col">
                <div
                  className="rep-chart-bar rep-chart-bar-actual"
                  style={{ height: `${dept.actual * scale}%` }}
                  title={`Actual: ${formatINR(dept.actual)}`}
                />
              </div>
            </div>
            <div className="rep-chart-bar-label">{dept.name.substring(0, 8)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Pie Chart for Category Spending
function CategorySpendingChart({ capex, opex }) {
  const total = capex + opex
  if (total === 0) {
    return (
      <div className="rep-chart-empty">
        <Activity size={32} />
        <p>No expense data</p>
      </div>
    )
  }

  const capexPct = ((capex / total) * 100).toFixed(1)
  const opexPct = ((opex / total) * 100).toFixed(1)

  return (
    <div className="rep-pie-chart">
      <div className="rep-pie-circle" style={{
        background: `conic-gradient(#2563eb 0% ${capexPct}%, #0d9488 ${capexPct}% 100%)`
      }}>
        <div className="rep-pie-inner">
          <div className="rep-pie-center-text">
            <div className="rep-pie-center-pct">{capexPct}%</div>
            <div className="rep-pie-center-label">CAPEX</div>
          </div>
        </div>
      </div>
      <div className="rep-pie-legend">
        <div className="rep-pie-legend-item">
          <span className="rep-pie-legend-dot" style={{ background: '#2563eb' }} />
          <span className="rep-pie-legend-label">CAPEX</span>
          <span className="rep-pie-legend-value">{formatINR(capex)}</span>
          <span className="rep-pie-legend-pct">{capexPct}%</span>
        </div>
        <div className="rep-pie-legend-item">
          <span className="rep-pie-legend-dot" style={{ background: '#0d9488' }} />
          <span className="rep-pie-legend-label">OPEX</span>
          <span className="rep-pie-legend-value">{formatINR(opex)}</span>
          <span className="rep-pie-legend-pct">{opexPct}%</span>
        </div>
      </div>
    </div>
  )
}

// Timeline Table Component with Pagination
function TimelineTable({ budgets, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1)

  if (!budgets || budgets.length === 0) {
    return (
      <div className="rep-timeline-empty">
        <Activity size={32} />
        <p>No budget activities available</p>
      </div>
    )
  }

  const totalPages = Math.ceil(budgets.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const pageItems = budgets.slice(startIdx, endIdx)

  return (
    <div className="rep-timeline-wrapper">
      {/* Quarter Boxes Timeline */}
      <div className="rep-quarters-timeline">
        <div className="rep-quarter-box rep-quarter-q1-box">
          <span className="rep-quarter-box-label">Q1 (Jul - Aug 2025)</span>
        </div>
        <div className="rep-quarter-box rep-quarter-q2-box">
          <span className="rep-quarter-box-label">Q2 (Oct - Dec 2025)</span>
        </div>
        <div className="rep-quarter-box rep-quarter-q3-box">
          <span className="rep-quarter-box-label">Q3 (Jan - Mar 2026)</span>
        </div>
        <div className="rep-quarter-box rep-quarter-q4-box">
          <span className="rep-quarter-box-label">Q4 (Apr - May 2026)</span>
        </div>
      </div>

      {/* Status Legend */}
      <div className="rep-status-legend">
        <div className="rep-status-legend-item">
          <span className="rep-legend-dot rep-status-on-track"></span>
          <span className="rep-legend-text">On-Track</span>
        </div>
        <div className="rep-status-legend-item">
          <span className="rep-legend-dot rep-status-on-hold"></span>
          <span className="rep-legend-text">On-Hold</span>
        </div>
        <div className="rep-status-legend-item">
          <span className="rep-legend-dot rep-status-scheduled"></span>
          <span className="rep-legend-text">Scheduled</span>
        </div>
      </div>

      <div className="rep-timeline-table-wrap">
        <table className="rep-timeline-table">
          <thead>
            <tr>
              <th>Budget Code</th>
              <th>Activity Name</th>
              <th>Department</th>
              <th>Approved Funds</th>
              <th>Total</th>
              <th>Timeline</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Q4</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
            <tr className="rep-timeline-header-sub">
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th>NOX</th>
              <th>NOX</th>
              <th>NOX</th>
              <th>NOX</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((budget, idx) => {
              const quarters = budget.quarters || []
              const q1 = quarters[0]?.amount || 0
              const q2 = quarters[1]?.amount || 0
              const q3 = quarters[2]?.amount || 0
              const q4 = quarters[3]?.amount || 0
              
              return (
                <tr key={idx}>
                  <td className="rep-timeline-code">{budget.budgetCode}</td>
                  <td className="rep-timeline-activity">{budget.activityName || budget.activityHead}</td>
                  <td className="rep-timeline-dept">{budget.departmentName}</td>
                  <td className="rep-timeline-amount">{formatINRFull(budget.requestedAmount)}</td>
                  <td className="rep-timeline-total">{formatINRFull(budget.requestedAmount)}</td>
                  <td className="rep-timeline-timeline">FY 26-27</td>
                  <td className="rep-timeline-quarter">{q1 > 0 ? formatINR(q1) : '—'}</td>
                  <td className="rep-timeline-quarter">{q2 > 0 ? formatINR(q2) : '—'}</td>
                  <td className="rep-timeline-quarter">{q3 > 0 ? formatINR(q3) : '—'}</td>
                  <td className="rep-timeline-quarter">{q4 > 0 ? formatINR(q4) : '—'}</td>
                  <td className="rep-timeline-status">
                    <div className="rep-status-with-dot">
                      <span className={`rep-status-dot rep-dot-${budget.status?.toLowerCase().replace(/\s+/g, '-')}`}></span>
                      <span className="rep-status-text">{budget.status}</span>
                    </div>
                  </td>
                  <td className="rep-timeline-remarks">{budget.remarks || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rep-timeline-pagination">
          <span className="rep-pagination-info">
            Showing {startIdx + 1} to {Math.min(endIdx, budgets.length)} of {budgets.length} records
          </span>
          <div className="rep-pagination-controls">
            <button
              type="button"
              className="rep-pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="rep-pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`rep-pagination-page ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rep-pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Reports & Analytics Page
export default function ReportsAnalyticsPage({ budgets = [], projects = [] }) {
  const expenses = useMemo(() => getExpenses(), [])
  const expenseSummary = useMemo(() => getExpenseSummary(), [])

  // Calculate KPIs
  const totalBudget = useMemo(() =>
    budgets.reduce((sum, b) => sum + (b.requestedAmount || 0), 0), [budgets])

  const totalRequested = useMemo(() => totalBudget, [totalBudget])

  const totalSpent = useMemo(() => expenseSummary.total, [expenseSummary])

  const variance = useMemo(() => totalBudget - totalSpent, [totalBudget, totalSpent])

  const variancePercent = useMemo(() => {
    if (totalBudget === 0) return 0
    return (((totalBudget - totalSpent) / totalBudget) * 100).toFixed(1)
  }, [totalBudget, totalSpent])

  // Budget by Department Data
  const budgetByDept = useMemo(() => {
    const map = {}
    budgets.forEach((b) => {
      const deptName = b.departmentName || 'Unknown'
      if (!map[deptName]) {
        map[deptName] = { name: deptName, budget: 0, actual: 0 }
      }
      map[deptName].budget += b.requestedAmount || 0
    })

    // Add actual spending from expenses
    expenses.forEach((e) => {
      const deptName = e.departmentName || 'Unknown'
      if (!map[deptName]) {
        map[deptName] = { name: deptName, budget: 0, actual: 0 }
      }
      map[deptName].actual += e.amount || 0
    })

    return Object.values(map).sort((a, b) => b.budget - a.budget).slice(0, 8)
  }, [budgets, expenses])

  // Top Projects by Spending
  const topProjects = useMemo(() => {
    return projects
      .map((p) => ({
        ...p,
        spending: p.spent || 0,
      }))
      .sort((a, b) => b.spending - a.spending)
      .slice(0, 5)
  }, [projects])

  // Department-wise Spending Bars
  const deptSpendingData = useMemo(() => {
    const map = {}
    expenses.forEach((e) => {
      const deptName = e.departmentName || 'Unknown'
      if (!map[deptName]) {
        map[deptName] = 0
      }
      map[deptName] += e.amount || 0
    })
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8)
  }, [expenses])

  const maxDeptSpending = deptSpendingData.length > 0 ? Math.max(...deptSpendingData.map((d) => d.amount)) : 0

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Budget Code', 'Activity Name', 'Department', 'Approved Funds', 'Status']
    const rows = budgets.map((b) => [
      b.budgetCode,
      b.activityName || b.activityHead,
      b.departmentName,
      formatINRFull(b.requestedAmount),
      b.status,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n')
    const link = document.createElement('a')
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    link.download = `Toyota_Reports_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Print
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="rep-page-container">
      {/* Page Header */}
      <div className="rep-page-header">
        <div className="rep-header-text">
          <h1 className="page-main-title">Reports & Analytics</h1>
          <p className="page-sub-title">
            Comprehensive budget overview, departmental allocations, expense analytics and project spending insights.
          </p>
        </div>
        <div className="rep-header-actions">
          <button type="button" className="btn-export-outline" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn-export-outline" onClick={handlePrint}>
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="rep-kpi-grid">
        <KpiCard
          icon={IndianRupee}
          label="Total Budget"
          value={formatINR(totalBudget)}
          sub={`₹ ${(totalBudget / 10000000).toFixed(2)}Cr`}
          iconBg="rep-kpi-bg-teal"
        />
        <KpiCard
          icon={TrendingUp}
          label="Total Requested"
          value={formatINR(totalRequested)}
          sub="FY 2026-27"
          iconBg="rep-kpi-bg-blue"
        />
        <KpiCard
          icon={Activity}
          label="Total Spent"
          value={formatINR(totalSpent)}
          sub={`${((totalSpent / totalBudget) * 100).toFixed(1)}% utilised`}
          iconBg="rep-kpi-bg-amber"
        />
        <KpiCard
          icon={AlertCircle}
          label="Variance / Remaining"
          value={formatINR(variance)}
          sub={`${variancePercent}% remaining`}
          iconBg="rep-kpi-bg-rose"
        />
      </div>

      {/* Charts Row */}
      <div className="rep-charts-grid">
        {/* Budget Overview by Department */}
        <div className="rep-card">
          <div className="rep-card-header">
            <h2 className="rep-card-title">Budget Overview by Department</h2>
            <span className="rep-card-subtitle">Distributed (Budget</span>
          </div>
          <div className="rep-card-content">
            <BudgetByDepartmentChart data={budgetByDept} />
          </div>
        </div>

        {/* Category-wise Spending */}
        <div className="rep-card">
          <div className="rep-card-header">
            <h2 className="rep-card-title">Category-wise Spending</h2>
            <span className="rep-card-subtitle">Distribution</span>
          </div>
          <div className="rep-card-content rep-pie-wrap">
            <CategorySpendingChart capex={expenseSummary.capex} opex={expenseSummary.opex} />
          </div>
        </div>
      </div>

      {/* Department-wise Spending Row */}
      <div className="rep-card">
        <div className="rep-card-header">
          <h2 className="rep-card-title">Department-wise Spending</h2>
          <span className="rep-card-subtitle">View Details</span>
        </div>
        <div className="rep-card-content">
          <div className="rep-dept-bars-list">
            {deptSpendingData.length > 0 ? (
              deptSpendingData.map((dept, i) => (
                <DepartmentBar
                  key={i}
                  name={dept.name}
                  budget={dept.amount}
                  total={maxDeptSpending}
                  color={['#0d9488', '#2563eb', '#7e22ce', '#d97706', '#dc2626', '#0891b2', '#059669', '#1e40af'][i % 8]}
                />
              ))
            ) : (
              <div className="rep-empty-state">
                <Activity size={32} />
                <p>No department spending data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Projects by Spending */}
      <div className="rep-card">
        <div className="rep-card-header">
          <h2 className="rep-card-title">Top Projects by Spending</h2>
          <span className="rep-card-subtitle">FY26-27</span>
        </div>
        <div className="rep-card-content">
          {topProjects.length > 0 ? (
            <div className="rep-projects-list">
              {topProjects.map((project, i) => (
                <div key={i} className="rep-project-item">
                  <div className="rep-project-rank">{i + 1}</div>
                  <div className="rep-project-info">
                    <h4 className="rep-project-name">{project.name}</h4>
                    <p className="rep-project-dept">{project.departmentName}</p>
                  </div>
                  <div className="rep-project-amount">
                    <div className="rep-project-spent">{formatINR(project.spending)}</div>
                    <div className="rep-project-budget">of {formatINR(project.budget)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rep-empty-state">
              <Activity size={32} />
              <p>No project data</p>
            </div>
          )}
        </div>
      </div>

      {/* Implementation Timeline */}
      <div className="rep-card">
        <div className="rep-card-header">
          <h2 className="rep-card-title">Implementation Timeline</h2>
          <span className="rep-card-subtitle">FY 2026-27 quarterly structure</span>
        </div>
        <div className="rep-card-content">
          <TimelineTable budgets={budgets} itemsPerPage={10} />
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
