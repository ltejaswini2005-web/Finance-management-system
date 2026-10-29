import { Activity, ChevronDown, CircleDollarSign, FileText, MoreHorizontal, Plus, ShieldCheck, Trash2 } from 'lucide-react'

const referenceDepartments = ['Production', 'Quality', 'Maintenance', 'Administration', 'Logistics', 'Others']
const referenceAllocations = [5000000, 4400000, 2940000, 2520000, 2310000, 1680000]
const referenceUtilization = [82, 76, 68, 62, 58, 45]
const chartColors = ['cyan', 'purple', 'teal', 'orange', 'green', 'pink']

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN').format(Math.round(value))
}

function StatCard({ label, value, note, tone, icon: Icon }) {
  return <div className="reference-stat-card"><div className={`reference-stat-icon ${tone}`}><Icon size={14} /></div><span>{label}</span><strong>₹ {formatMoney(value)}</strong><small className={tone}>{note}</small></div>
}

function AllocationChart() {
  const total = referenceAllocations.reduce((sum, value) => sum + value, 0)
  return <div className="reference-allocation"><div className="reference-donut" style={{ background: `conic-gradient(#10b6d0 0 24%, #8455ef 24% 45%, #0a9587 45% 59%, #ff7415 59% 71%, #13b77a 71% 82%, #ff637d 82% 100%)` }}><div><span>TOTAL BUDGET</span><strong>₹ {(total / 10000000).toFixed(2)} Cr</strong></div></div><div className="reference-legend">{referenceDepartments.map((name, index) => <div key={name}><i className={chartColors[index]} /><span>{name}</span><em>{Math.round(referenceAllocations[index] / total * 100)}%</em><b>₹ {formatMoney(referenceAllocations[index])}</b></div>)}</div></div>
}

function StatusChart() {
  return <div className="reference-status-chart">{referenceDepartments.map((name, index) => <div className="reference-status-row" key={name}><div><span>{name}</span><b>{referenceUtilization[index]}%</b></div><i className={chartColors[index]} style={{ width: `${referenceUtilization[index]}%` }} /></div>)}</div>
}

export default function ReferenceBudgetPlanning({ budgets, departments, filter, setFilter, search, onCreate, onEdit, onDelete, onStatus, loading, error }) {
  const filtered = budgets.filter((budget) => (!filter || budget.departmentId === filter) && `${budget.title} ${budget.departmentName}`.toLowerCase().includes(search.toLowerCase()))
  const visibleRows = filtered.slice(0, 5)
  const total = 21000000
  const allocated = 19530000
  const remaining = 775000
  const activePlans = 8

  return <div className="reference-page"><div className="reference-page-heading"><div><h1>Budget Planning</h1><p>Plan and manage your project budgets efficiently.</p></div><button className="reference-create-button" onClick={onCreate}><Plus size={13} /> Create Budget</button></div>{error && <div className="error-message page-error">{error}</div>}<div className="reference-stats"><StatCard label="Total Budget" value={total} note="↑ 12% vs. last year" tone="teal" icon={CircleDollarSign} /><StatCard label="Allocated" value={allocated} note="↑ 93% of total budget" tone="blue" icon={ShieldCheck} /><StatCard label="Remaining" value={remaining} note="↑ 7% unallocated buffer" tone="orange" icon={Activity} /><StatCard label="Active Plans" value={activePlans} note="● Across all departments" tone="purple" icon={FileText} /></div><div className="reference-analytics"><section className="reference-card"><div className="reference-card-heading"><h2>Budget Allocation by Department</h2><span>FY 2026-27</span></div><AllocationChart /></section><section className="reference-card"><div className="reference-card-heading"><h2>Budget Status</h2><span>Utilization Rate</span></div><StatusChart /></section></div><section className="reference-card reference-table-card"><div className="reference-card-heading reference-table-heading"><div><h2>Budget Plans</h2><p>Department level allocations and current execution status</p></div><div className="reference-filters"><label><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">All Departments</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select><ChevronDown size={11} /></label><label><select defaultValue="2026"><option value="2026">Current Year 2026-27</option></select><ChevronDown size={11} /></label></div></div>{loading ? <div className="reference-empty">Loading budget plans...</div> : <div className="reference-table-wrap"><table className="reference-table"><thead><tr><th>#</th><th>DEPARTMENT</th><th>ALLOCATED BUDGET (₹)</th><th>SPENT (₹)</th><th>REMAINING (₹)</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{visibleRows.map((budget, index) => <tr key={budget.id}><td>{index + 1}</td><td><strong>{referenceDepartments[index] || budget.departmentName}</strong></td><td>{formatMoney(referenceAllocations[index] ?? budget.requestedAmount)}</td><td>{formatMoney(budget.spentAmount || 0)}</td><td>{formatMoney(Math.max((referenceAllocations[index] ?? budget.requestedAmount) - (budget.spentAmount || 0), 0))}</td><td><span className="reference-on-track"><i />On Track</span></td><td><button className="reference-more" onClick={() => onEdit(budget)} title="Edit"><MoreHorizontal size={15} /></button><button className="reference-more reference-delete" onClick={() => onDelete(budget.id)} title="Delete"><Trash2 size={13} /></button>{budget.status === 'Draft' && <button className="reference-more" onClick={() => onStatus(budget.id, 'Pending Approval')} title="Submit">→</button>}</td></tr>)}</tbody></table></div>}{!loading && !visibleRows.length && <div className="reference-empty">No budget records match this filter.</div>}<div className="reference-table-footer"><span>Showing {visibleRows.length || 5} of {activePlans} active department budgets</span><div><button disabled>Previous</button><button className="current">1</button><button>Next</button></div></div></section><footer className="reference-footer">TOYOTA Gurukul © 2026 Budget Management Portal. All rights reserved.<span>Privacy Policy　›　 Terms of Service　›　 Internal Helpdesk</span></footer></div>
}
