import React, { useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShieldCheck,
  Coins,
  AlertCircle,
  ArrowRight,
  Plus,
  Download,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart2,
} from 'lucide-react'
import { getExpenseSummary, getExpenses } from '../data/localData'

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(val) || 0
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
  return `₹${new Intl.NumberFormat('en-IN').format(num)}`
}

function formatINRFull(val) {
  const num = typeof val === 'number' ? val : Number(val) || 0
  return `₹${new Intl.NumberFormat('en-IN').format(num)}`
}

function formatDate(iso) {
  const d = new Date(iso || Date.now())
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// --- KPI Card ---
function KpiCard({ icon: Icon, iconBg, iconColor, label, value, sub, subColor, trend }) {
  return (
    <div className="dash-kpi-card">
      <div className={`dash-kpi-icon-wrap ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="dash-kpi-body">
        <span className="dash-kpi-label">{label}</span>
        <strong className="dash-kpi-value">{value}</strong>
        <span className={`dash-kpi-sub ${subColor || ''}`}>
          {trend === 'up' && <TrendingUp size={12} style={{ marginRight: 3 }} />}
          {trend === 'down' && <TrendingDown size={12} style={{ marginRight: 3 }} />}
          {sub}
        </span>
      </div>
    </div>
  )
}

// --- Horizontal Bar for Dept Allocation ---
function DeptAllocationBar({ name, allocated, total, color }) {
  const pct = total > 0 ? Math.min(100, (allocated / total) * 100) : 0
  return (
    <div className="dash-dept-bar-row">
      <div className="dash-dept-bar-name">{name}</div>
      <div className="dash-dept-bar-track">
        <div className="dash-dept-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="dash-dept-bar-amount">{formatINR(allocated)}</div>
      <div className="dash-dept-bar-pct">{pct.toFixed(0)}%</div>
    </div>
  )
}

// --- Quarterly SVG Line Chart ---
function QuarterlyChart({ data }) {
  const W = 560; const H = 140; const PAD = 36
  const maxVal = Math.max(...data.map((d) => Math.max(d.budget, d.actual)), 1)
  const toY = (v) => H - PAD - ((v / maxVal) * (H - PAD * 2))
  const toX = (i) => PAD + (i / (data.length - 1)) * (W - PAD * 2)

  const budgetPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.budget)}`).join(' ')
  const actualPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.actual)}`).join(' ')
  const actualFill = [
    ...data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.actual)}`),
    `L${toX(data.length - 1)},${H - PAD}`,
    `L${toX(0)},${H - PAD}Z`,
  ].join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dash-chart-svg" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={PAD} y1={toY(maxVal * f)}
          x2={W - PAD} y2={toY(maxVal * f)}
          stroke="#e2e8f0" strokeWidth="1"
        />
      ))}

      {/* Actual fill */}
      <path d={actualFill} fill="rgba(13,148,136,0.08)" />

      {/* Budget line */}
      <path d={budgetPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="6 3" />

      {/* Actual line */}
      <path d={actualPath} fill="none" stroke="#0d9488" strokeWidth="2.5" />

      {/* Dots */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.budget)} r="4" fill="#2563eb" />
          <circle cx={toX(i)} cy={toY(d.actual)} r="4.5" fill="#0d9488" />
          <text x={toX(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#64748b">{d.label}</text>
        </g>
      ))}
      {/* Y-axis labels */}
      {[0, 0.5, 1].map((f) => (
        <text key={f} x={PAD - 4} y={toY(maxVal * f) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
          {formatINR(maxVal * f)}
        </text>
      ))}
    </svg>
  )
}

// --- Activity item ---
function ActivityItem({ icon: Icon, iconColor, title, sub, time }) {
  return (
    <div className="dash-activity-item">
      <div className={`dash-activity-dot ${iconColor}`}>
        <Icon size={12} />
      </div>
      <div className="dash-activity-text">
        <span className="dash-activity-title">{title}</span>
        <span className="dash-activity-sub">{sub}</span>
      </div>
      <span className="dash-activity-time">{time}</span>
    </div>
  )
}

export default function DashboardPage({ budgets, departments: _departments, onCreateBudget, onCreateBudgetPlan, onNavigate }) {
  const expSummary = useMemo(() => getExpenseSummary(), [])
  const expenses = useMemo(() => getExpenses(), [])

  const totalBudget = useMemo(() =>
    budgets.reduce((s, b) => s + (b.requestedAmount || 0), 0), [budgets])

  const approvedBudget = useMemo(() =>
    budgets.filter((b) => b.status === 'Approved').reduce((s, b) => s + (b.requestedAmount || 0), 0), [budgets])

  const pendingCount = useMemo(() =>
    budgets.filter((b) => b.status !== 'Approved').length, [budgets])

  const remaining = totalBudget - expSummary.total

  // Dept allocation data
  const deptData = useMemo(() => {
    const map = {}
    budgets.forEach((b) => {
      const key = b.departmentName || b.activityHead
      if (!map[key]) map[key] = 0
      map[key] += b.requestedAmount || 0
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, amt], i) => ({
        name,
        allocated: amt,
        color: ['#0d9488', '#2563eb', '#7e22ce', '#d97706', '#dc2626', '#0891b2'][i % 6],
      }))
  }, [budgets])

  // Quarterly chart data (budget planned vs actual expenses)
  const quarterlyData = useMemo(() => {
    const quarters = [
      { label: 'Q1 (Apr–Jun)', months: [3, 4, 5] },
      { label: 'Q2 (Jul–Sep)', months: [6, 7, 8] },
      { label: 'Q3 (Oct–Dec)', months: [9, 10, 11] },
      { label: 'Q4 (Jan–Mar)', months: [0, 1, 2] },
    ]
    return quarters.map(({ label, months }) => {
      const budget = budgets.reduce((s, b) => {
        const qKeys = ['q1', 'q2', 'q3', 'q4']
        const qIdx = quarters.findIndex((q) => q.label === label)
        return b.quartersActive?.[qKeys[qIdx]] ? s + (b.quarters?.[qIdx]?.amount || 0) : s
      }, 0)
      const actual = expenses
        .filter((e) => months.includes(new Date(e.date).getMonth()))
        .reduce((s, e) => s + e.amount, 0)
      return { label: label.split(' ')[0], budget, actual }
    })
  }, [budgets, expenses])

  // Recent activity feed (latest 8 expenses + budgets)
  const recentActivity = useMemo(() => {
    const expItems = expenses.slice(0, 5).map((e) => ({
      type: 'expense',
      title: e.description,
      sub: `${e.departmentName} • ${formatINRFull(e.amount)}`,
      status: e.status,
      time: formatDate(e.updatedAt),
    }))
    const budgetItems = budgets.slice(0, 3).map((b) => ({
      type: 'budget',
      title: `Budget Plan #${b.budgetCode}`,
      sub: `${b.activityHead} • ${formatINRFull(b.requestedAmount)}`,
      status: b.status,
      time: formatDate(b.updatedAt),
    }))
    return [...expItems, ...budgetItems].sort((a, b) => (a.time > b.time ? -1 : 1)).slice(0, 8)
  }, [expenses, budgets])

  const utilizationPct = totalBudget > 0 ? ((expSummary.total / totalBudget) * 100).toFixed(1) : '0.0'
  const capexPct = expSummary.total > 0 ? ((expSummary.capex / expSummary.total) * 100).toFixed(0) : 0
  const opexPct = expSummary.total > 0 ? ((expSummary.opex / expSummary.total) * 100).toFixed(0) : 0

  return (
    <div className="dash-page-container">
      {/* Page Header */}
      <div className="dash-page-header">
        <div>
          <div className="dash-title-row">
            <h1 className="dash-page-title">Dashboard</h1>
            <span className="dash-fiscal-pill">FY 2026-27</span>
          </div>
          <p className="dash-page-subtitle">
            Real-time overview of budget utilisation, departmental allocations and expense tracking across Toyota Gurukul.
          </p>
        </div>
        <div className="dash-header-actions">
          <button type="button" className="btn-export-outline" onClick={() => alert('Export coming soon')}>
            <Download size={14} />
            <span>Export Report</span>
          </button>
          <button type="button" className="btn-create-budget-secondary" onClick={onCreateBudget}>
            <Plus size={14} />
            <span>Create Budget</span>
          </button>
          <button type="button" className="btn-create-plan-primary" onClick={onCreateBudgetPlan}>
            <Plus size={14} />
            <span>Create Budget Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="dash-kpi-grid">
        <KpiCard
          icon={IndianRupee}
          iconBg="dash-kpi-bg-teal"
          iconColor="dash-kpi-color-teal"
          label="TOTAL PLANNED BUDGET"
          value={formatINR(totalBudget)}
          sub="↑ 12% vs FY 2025-26"
          subColor="dash-sub-green"
          trend="up"
        />
        <KpiCard
          icon={Activity}
          iconBg="dash-kpi-bg-blue"
          iconColor="dash-kpi-color-blue"
          label="TOTAL EXPENSES TO DATE"
          value={formatINR(expSummary.total)}
          sub={`${utilizationPct}% budget utilised`}
          subColor="dash-sub-blue"
        />
        <KpiCard
          icon={Coins}
          iconBg="dash-kpi-bg-amber"
          iconColor="dash-kpi-color-amber"
          label="REMAINING BALANCE"
          value={formatINR(remaining)}
          sub={`${(100 - Number(utilizationPct)).toFixed(1)}% unspent`}
          subColor="dash-sub-amber"
        />
        <KpiCard
          icon={AlertCircle}
          iconBg="dash-kpi-bg-rose"
          iconColor="dash-kpi-color-rose"
          label="PENDING APPROVALS"
          value={pendingCount}
          sub={`${budgets.length} total plans`}
          subColor="dash-sub-rose"
        />
      </div>

      {/* Middle Row — Chart + Dept Allocation */}
      <div className="dash-mid-grid">
        {/* Quarterly Trend Chart */}
        <div className="dash-card dash-chart-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Quarterly Spend Trend</h2>
              <p className="dash-card-desc">Budget planned vs actual expenses by quarter</p>
            </div>
            <div className="dash-chart-legend">
              <span className="dash-legend-dot" style={{ background: '#2563eb' }} />
              <span className="dash-legend-label">Budget</span>
              <span className="dash-legend-dot" style={{ background: '#0d9488' }} />
              <span className="dash-legend-label">Actual</span>
            </div>
          </div>
          <div className="dash-chart-wrap">
            <QuarterlyChart data={quarterlyData} />
          </div>
        </div>

        {/* Dept Allocation Bars */}
        <div className="dash-card dash-alloc-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Department Allocation</h2>
              <p className="dash-card-desc">Budget distribution across shop floors</p>
            </div>
            <button
              type="button"
              className="dash-view-all-btn"
              onClick={() => onNavigate?.('Budget Planning')}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="dash-dept-bars-list">
            {deptData.map((d) => (
              <DeptAllocationBar
                key={d.name}
                name={d.name}
                allocated={d.allocated}
                total={totalBudget}
                color={d.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row — CAPEX/OPEX split + Activity Feed + Quick Stats */}
      <div className="dash-bottom-grid">
        {/* Expense Category Split */}
        <div className="dash-card dash-split-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Expense Category Split</h2>
              <p className="dash-card-desc">CAPEX vs OPEX breakdown</p>
            </div>
          </div>

          {/* Donut-like split bar */}
          <div className="dash-split-bar-wrap">
            <div className="dash-split-bar">
              <div className="dash-split-fill dash-split-capex" style={{ width: `${capexPct}%` }} />
              <div className="dash-split-fill dash-split-opex" style={{ width: `${opexPct}%` }} />
            </div>
            <div className="dash-split-labels">
              <div className="dash-split-label-item">
                <span className="dash-split-dot" style={{ background: '#2563eb' }} />
                <span className="dash-split-type">CAPEX</span>
                <strong className="dash-split-amount">{formatINR(expSummary.capex)}</strong>
                <span className="dash-split-pct">{capexPct}%</span>
              </div>
              <div className="dash-split-label-item">
                <span className="dash-split-dot" style={{ background: '#0d9488' }} />
                <span className="dash-split-type">OPEX</span>
                <strong className="dash-split-amount">{formatINR(expSummary.opex)}</strong>
                <span className="dash-split-pct">{opexPct}%</span>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="dash-split-mini-stats">
            <div className="dash-mini-stat-row">
              <CheckCircle2 size={14} className="dash-mini-icon-green" />
              <span className="dash-mini-stat-label">Approved Expenses</span>
              <strong className="dash-mini-stat-val">{formatINR(expSummary.approved)}</strong>
            </div>
            <div className="dash-mini-stat-row">
              <Clock size={14} className="dash-mini-icon-amber" />
              <span className="dash-mini-stat-label">Pending Approval</span>
              <strong className="dash-mini-stat-val">{formatINR(expSummary.pending)}</strong>
            </div>
            <div className="dash-mini-stat-row">
              <ShieldCheck size={14} className="dash-mini-icon-blue" />
              <span className="dash-mini-stat-label">Approved Budget Plans</span>
              <strong className="dash-mini-stat-val">{approvedBudget > 0 ? formatINR(approvedBudget) : 'None yet'}</strong>
            </div>
            <div className="dash-mini-stat-row">
              <BarChart2 size={14} className="dash-mini-icon-purple" />
              <span className="dash-mini-stat-label">Total Expense Records</span>
              <strong className="dash-mini-stat-val">{expSummary.count} entries</strong>
            </div>
          </div>

          <button
            type="button"
            className="dash-goto-btn"
            onClick={() => onNavigate?.('Expense Tracking')}
          >
            Go to Expense Tracking <ArrowRight size={13} />
          </button>
        </div>

        {/* Recent Activity Feed */}
        <div className="dash-card dash-activity-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Recent Activity</h2>
              <p className="dash-card-desc">Latest budget and expense updates</p>
            </div>
            <button
              type="button"
              className="dash-view-all-btn"
              onClick={() => onNavigate?.('Expense Tracking')}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="dash-activity-list">
            {recentActivity.map((item, idx) => {
              let Icon = Activity
              let iconColor = 'dash-act-teal'
              if (item.status === 'Approved') { Icon = CheckCircle2; iconColor = 'dash-act-green' }
              else if (item.status === 'Pending') { Icon = Clock; iconColor = 'dash-act-amber' }
              else if (item.status === 'On Hold') { Icon = XCircle; iconColor = 'dash-act-rose' }
              return (
                <ActivityItem
                  key={idx}
                  icon={Icon}
                  iconColor={iconColor}
                  title={item.title}
                  sub={item.sub}
                  time={item.time}
                />
              )
            })}
          </div>
        </div>

        {/* Budget Plan Status Overview */}
        <div className="dash-card dash-status-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Plan Status Overview</h2>
              <p className="dash-card-desc">Activity plan breakdown by status</p>
            </div>
          </div>

          {(() => {
            const onTrack = budgets.filter((b) => b.status === 'On Track').length
            const onHold = budgets.filter((b) => b.status === 'On Hold').length
            const approved = budgets.filter((b) => b.status === 'Approved').length
            const total = budgets.length || 1
            return (
              <div className="dash-status-list">
                <div className="dash-status-item">
                  <div className="dash-status-left">
                    <span className="dash-status-dot dash-dot-green" />
                    <span className="dash-status-name">On Track</span>
                  </div>
                  <div className="dash-status-right">
                    <div className="dash-status-bar-track">
                      <div className="dash-status-bar-fill dash-fill-green" style={{ width: `${(onTrack / total) * 100}%` }} />
                    </div>
                    <span className="dash-status-count">{onTrack}</span>
                  </div>
                </div>
                <div className="dash-status-item">
                  <div className="dash-status-left">
                    <span className="dash-status-dot dash-dot-amber" />
                    <span className="dash-status-name">On Hold</span>
                  </div>
                  <div className="dash-status-right">
                    <div className="dash-status-bar-track">
                      <div className="dash-status-bar-fill dash-fill-amber" style={{ width: `${(onHold / total) * 100}%` }} />
                    </div>
                    <span className="dash-status-count">{onHold}</span>
                  </div>
                </div>
                <div className="dash-status-item">
                  <div className="dash-status-left">
                    <span className="dash-status-dot dash-dot-blue" />
                    <span className="dash-status-name">Approved</span>
                  </div>
                  <div className="dash-status-right">
                    <div className="dash-status-bar-track">
                      <div className="dash-status-bar-fill dash-fill-blue" style={{ width: `${(approved / total) * 100}%` }} />
                    </div>
                    <span className="dash-status-count">{approved}</span>
                  </div>
                </div>

                <div className="dash-status-total-row">
                  <span>Total Activity Plans</span>
                  <strong>{budgets.length}</strong>
                </div>
              </div>
            )
          })()}

          {/* Utilization gauge bar */}
          <div className="dash-util-section">
            <div className="dash-util-label-row">
              <span className="dash-util-label">Budget Utilization</span>
              <span className="dash-util-pct">{utilizationPct}%</span>
            </div>
            <div className="dash-util-bar-track">
              <div
                className="dash-util-bar-fill"
                style={{ width: `${Math.min(100, Number(utilizationPct))}%` }}
              />
            </div>
            <div className="dash-util-sub-row">
              <span>{formatINR(expSummary.total)} spent</span>
              <span>{formatINR(totalBudget)} total</span>
            </div>
          </div>

          <button
            type="button"
            className="dash-goto-btn"
            onClick={() => onNavigate?.('Budget Planning')}
          >
            Go to Budget Planning <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
