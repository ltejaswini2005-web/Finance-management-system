import React, { useState } from 'react'
import {
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  RotateCcw,
  Check,
  FileText,
  X,
} from 'lucide-react'

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, '')) || 0
  return new Intl.NumberFormat('en-IN').format(num)
}

function numberToIndianWords(num) {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only'
  
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const inWords = (n) => {
    let str = ''
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10]
    } else if (n > 0) {
      str += a[n]
    }
    return str.trim()
  }

  let crore = Math.floor(num / 10000000)
  num %= 10000000
  let lakh = Math.floor(num / 100000)
  num %= 100000
  let thousand = Math.floor(num / 1000)
  num %= 1000
  let remaining = num

  let res = ''
  if (crore > 0) res += inWords(crore) + ' Crore '
  if (lakh > 0) res += inWords(lakh) + ' Lakhs '
  if (thousand > 0) res += inWords(thousand) + ' Thousand '
  if (remaining > 0) res += inWords(remaining) + ' '

  return (res.trim() + ' Rupees Only').replace(/\s+/g, ' ')
}

export default function CreateBudgetPlanPage({ onBack, onSaveSuccess, departments }) {
  const [title, setTitle] = useState('Annual Assembly & Machine Automation Upgrade FY27')
  const [departmentId, setDepartmentId] = useState('dept-production')
  const [costCenter, setCostCenter] = useState('CC-4012 - Manufacturing & Automation')
  const [classification, setClassification] = useState('CAPEX')
  const [requestedAmount, setRequestedAmount] = useState('4500000')
  const [purpose, setPurpose] = useState(
    'Replacement of legacy End-of-Line testing servo rigs with intelligent PLC telemetry sensors. Projected to curb unplanned line stops by 14.8% and elevate throughput to 48 cars/hour on Assembly Track #2 in accordance with Toyota Gurukul FY27 Modernization directives.'
  )

  // 4 Quarters
  const [quarters, setQuarters] = useState([
    { id: 'q1', label: 'Q1 (Apr – Jun)', percent: '33.3%', amount: '1500000', milestone: 'RFQ Issue & Vendor Advance' },
    { id: 'q2', label: 'Q2 (Jul – Sep)', percent: '26.7%', amount: '1200000', milestone: 'Hardware Procurement & Delivery' },
    { id: 'q3', label: 'Q3 (Oct – Dec)', percent: '22.2%', amount: '1000000', milestone: 'Installation & PLC Commissioning' },
    { id: 'q4', label: 'Q4 (Jan – Mar)', percent: '17.8%', amount: '800000', milestone: 'Final Sign-off & Retention Release' },
  ])

  // BOM Line Items
  const [lineItems, setLineItems] = useState([
    {
      id: 'item-1',
      title: 'Robotic Arm Servo Motors & Calibration',
      subtitle: 'KUKA 6-Axis High Precision Modules Gen-IV',
      category: 'Equipment',
      qty: '4 units',
      unitRate: 550000,
      subtotal: 2200000,
    },
    {
      id: 'item-2',
      title: 'Sensor Array & PLC Controller Wiring',
      subtitle: 'Omron Optical Bus + EtherCAT Terminal Nodes',
      category: 'Hardware',
      qty: '1 Lot',
      unitRate: 1450000,
      subtotal: 1450000,
    },
    {
      id: 'item-3',
      title: 'Vendor Integration & Safety Testing',
      subtitle: 'On-site deployment, safety cage interlock certification',
      category: 'Services',
      qty: '1 pkg',
      unitRate: 850000,
      subtotal: 850000,
    },
  ])

  // Documents
  const [attachedDoc, setAttachedDoc] = useState({
    name: 'Vendor_Automation_Quotation_v2.pdf',
    size: '2.4 MB',
    author: 'Uploaded by R. Sharma',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const totalAmountNum = Number(String(requestedAmount).replace(/[^0-9]/g, '')) || 0
  const lineItemsSum = lineItems.reduce((acc, item) => acc + (item.subtotal || 0), 0)

  const handleAddLineItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'Additional Telemetry Interface Rig',
      subtitle: 'High precision field sensors',
      category: 'Hardware',
      qty: '1 unit',
      unitRate: 0,
      subtotal: 0,
    }
    setLineItems([...lineItems, newItem])
  }

  const handleRemoveLineItem = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const handleAutoEqualize = () => {
    const quarterAmt = Math.round(totalAmountNum / 4)
    const newQuarters = quarters.map((q, idx) => {
      const amt = idx === 3 ? totalAmountNum - quarterAmt * 3 : quarterAmt
      const pct = (amt / totalAmountNum) * 100
      return {
        ...q,
        amount: String(amt),
        percent: `${pct.toFixed(1)}%`,
      }
    })
    setQuarters(newQuarters)
  }

  const handleQuarterAmountChange = (index, value) => {
    const raw = Number(value.replace(/[^0-9]/g, '')) || 0
    const newQuarters = [...quarters]
    newQuarters[index] = {
      ...newQuarters[index],
      amount: String(raw),
      percent: totalAmountNum > 0 ? `${((raw / totalAmountNum) * 100).toFixed(1)}%` : '0%',
    }
    setQuarters(newQuarters)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedDoc({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        author: 'Uploaded by R. Sharma',
      })
    }
  }

  const handleSubmit = async (status = 'Approved') => {
    setFormError('')
    if (!title.trim()) {
      setFormError('Please enter a Budget Title / Proposal Name')
      return
    }
    if (totalAmountNum <= 0) {
      setFormError('Please enter a valid requested budget')
      return
    }

    setIsSubmitting(true)
    try {
      const deptObj = departments.find((d) => d.id === departmentId) || { name: 'Production (Assembly Line)' }

      const newPlan = {
        budgetCode: '1806016',
        activityHead: 'Assy',
        departmentId,
        departmentName: deptObj.name,
        section: costCenter,
        activityDescription: title,
        requestedAmount: totalAmountNum,
        timeline: 'Apr-Mar',
        quartersActive: { q1: true, q2: true, q3: true, q4: true },
        status: status === 'Draft' ? 'On Hold' : 'On Track',
        fiscalYear: 2026,
        classification,
        costCenter,
        purpose,
        quarters: quarters.map((q) => ({
          label: q.label,
          percentage: Number(q.percent.replace('%', '')) || 0,
          amount: Number(q.amount) || 0,
          milestone: q.milestone,
        })),
        lineItems: lineItems.map((item) => ({
          description: `${item.title} (${item.subtitle})`,
          category: item.category,
          quantity: item.qty,
          unitRate: item.unitRate,
          subtotal: item.subtotal,
        })),
      }

      await onSaveSuccess(newPlan)
      onBack()
    } catch (err) {
      setFormError(err?.message || 'Failed to submit budget plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="stitch-fullpage-form-wrapper">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <span className="crumb-link" onClick={onBack}>Dashboard</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-link" onClick={onBack}>Budget Planning</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">Create New Budget Plan</span>
      </div>

      {/* Page Title & Meta Header */}
      <div className="page-title-banner">
        <div className="banner-left">
          <div className="title-with-badge">
            <h1 className="fullpage-title">Create Budget Plan</h1>
            <span className="badge-draft-mode">
              <span className="draft-dot" /> Draft Mode
            </span>
          </div>
          <p className="fullpage-subtitle">
            Define department budget allocations, fiscal phasing, and submit for executive sign-off.
          </p>
        </div>

        <div className="banner-right-meta">
          <div className="meta-box fy-box">
            <span className="meta-label">FY</span>
            <strong className="meta-value">2026-27</strong>
          </div>
          <div className="meta-box planid-box">
            <span className="meta-label">PLAN ID</span>
            <strong className="meta-value">BG-2026-27-009</strong>
          </div>
          <div className="meta-box initiator-box">
            <span className="meta-label">INITIATOR</span>
            <strong className="meta-value">Rohit Sharma</strong>
            <span className="role-tag">Admin</span>
          </div>
        </div>
      </div>

      {formError && <div className="page-error-banner">{formError}</div>}

      {/* Main 2-Column Grid */}
      <div className="create-plan-two-col-layout">
        {/* Left Column (Primary Cards) */}
        <div className="left-form-column">
          {/* CARD 01: Core Budget Information */}
          <section className="form-card-box">
            <div className="card-top-row">
              <div className="badge-and-titles">
                <span className="step-num-circle red-num">01</span>
                <div>
                  <h2 className="card-primary-title">Core Budget Information</h2>
                  <p className="card-secondary-desc">Essential proposal identifiers and capital classification</p>
                </div>
              </div>
              <span className="plant-tag-pill">Plant: Bidadi Plant 2</span>
            </div>

            <div className="card-content-body">
              <div className="form-field-unit full-width">
                <label className="field-caption">
                  Budget Title / Proposal Name <span className="red-star">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="stitch-text-input"
                  placeholder="e.g. Annual Assembly & Machine Automation Upgrade FY27"
                />
              </div>

              <div className="two-col-field-row">
                <div className="form-field-unit">
                  <label className="field-caption">
                    Department <span className="red-star">*</span>
                  </label>
                  <div className="select-box-wrap">
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="stitch-select-input"
                    >
                      <option value="dept-production">Production (Assembly Line)</option>
                      <option value="dept-paint">Paint Shop (Coating & Sealing)</option>
                      <option value="dept-press">Press Shop</option>
                      <option value="dept-weld">Weld Shop</option>
                      <option value="dept-assy">Assembly (Production)</option>
                      <option value="dept-quality">Quality Assurance</option>
                      <option value="dept-maintenance">Maintenance & Utilities</option>
                      <option value="dept-logistics">Logistics & Material Movement</option>
                    </select>
                    <ChevronDown size={14} className="dropdown-caret" />
                  </div>
                </div>

                <div className="form-field-unit">
                  <label className="field-caption">
                    Cost Center / Section Code <span className="red-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="stitch-text-input"
                    placeholder="e.g. CC-4012 - Manufacturing & Automation"
                  />
                </div>
              </div>

              {/* Expenditure Classification Radio Cards */}
              <div className="form-field-unit full-width">
                <label className="field-caption">Expenditure Classification</label>
                <div className="classification-cards-grid">
                  <div
                    className={`class-card ${classification === 'CAPEX' ? 'active-green' : ''}`}
                    onClick={() => setClassification('CAPEX')}
                  >
                    <div className="card-radio-circle">
                      {classification === 'CAPEX' && <div className="green-radio-inner" />}
                    </div>
                    <div className="class-card-text">
                      <strong className="class-type-title">CAPEX (Capital Expenditure)</strong>
                      <span className="class-type-subtitle">
                        Long term assets, robotics, equipment upgrades & tooling
                      </span>
                    </div>
                  </div>

                  <div
                    className={`class-card ${classification === 'OPEX' ? 'active-green' : ''}`}
                    onClick={() => setClassification('OPEX')}
                  >
                    <div className="card-radio-circle">
                      {classification === 'OPEX' && <div className="green-radio-inner" />}
                    </div>
                    <div className="class-card-text">
                      <strong className="class-type-title">OPEX (Operational Expenditure)</strong>
                      <span className="class-type-subtitle">
                        Day-to-day maintenance, servicing, training & utilities
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Requested Budget */}
              <div className="form-field-unit full-width">
                <div className="label-with-right-note">
                  <label className="field-caption">
                    Total Requested Budget (INR) <span className="red-star">*</span>
                  </label>
                  <span className="headroom-text">
                    Available Dept Headroom: <strong>₹ 77,50,000</strong>
                  </span>
                </div>
                <div className="currency-bold-wrap">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="text"
                    value={formatINR(requestedAmount)}
                    onChange={(e) => setRequestedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    className="currency-input-field"
                  />
                </div>
                <div className="amount-in-words-row">
                  <span className="words-content">In words: {numberToIndianWords(totalAmountNum)}</span>
                  <span className="safe-cap-badge">Safe within FY Allocation Cap</span>
                </div>
              </div>

              {/* Purpose & Justification */}
              <div className="form-field-unit full-width">
                <label className="field-caption">
                  Purpose & Business Justification <span className="red-star">*</span>
                </label>
                <textarea
                  rows={4}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="stitch-textarea"
                  placeholder="Detail the operational background, impact on cycle time, Kaizen objectives, and ROI justification."
                />
              </div>
            </div>
          </section>

          {/* CARD 02: Quarterly Phasing & Milestone Distribution */}
          <section className="form-card-box">
            <div className="card-top-row">
              <div className="badge-and-titles">
                <span className="step-num-circle green-num">02</span>
                <div>
                  <h2 className="card-primary-title">Quarterly Phasing & Milestone Distribution</h2>
                  <p className="card-secondary-desc">Spread the allocated funds across project milestones</p>
                </div>
              </div>
              <span className="balanced-phasing-pill">
                <span className="green-dot" /> Phased: ₹ {formatINR(totalAmountNum)} (100% Balanced)
              </span>
            </div>

            <div className="card-content-body">
              <div className="quarters-four-grid">
                {quarters.map((q, idx) => (
                  <div key={q.id} className="quarter-phase-card">
                    <div className="q-card-head">
                      <span className="q-name">{q.label}</span>
                      <span className="q-pct-badge">{q.percent}</span>
                    </div>
                    <div className="q-milestone-label">{q.milestone}</div>
                    <div className="q-amount-input-box">
                      <span className="q-curr">₹</span>
                      <input
                        type="text"
                        value={formatINR(q.amount)}
                        onChange={(e) => handleQuarterAmountChange(idx, e.target.value)}
                        className="q-input"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Cash Flow Equilibrium Row */}
              <div className="equilibrium-row-box">
                <div className="gauge-circle-lockup">
                  <div className="gauge-outer-circle">
                    <span className="gauge-val">100%</span>
                  </div>
                </div>
                <div className="equilibrium-text-content">
                  <strong className="eq-title">Quarterly Cash Flow Equilibrium</strong>
                  <p className="eq-desc">
                    All planned disbursements match the requested cap of ₹45.0 Lakhs with zero deficit.
                  </p>
                </div>
                <button
                  type="button"
                  className="auto-equalize-btn"
                  onClick={handleAutoEqualize}
                >
                  <RotateCcw size={13} className="spin-hover" />
                  <span>Auto Equalize</span>
                </button>
              </div>
            </div>
          </section>

          {/* CARD 03: Line Item Estimates & BOM Specification */}
          <section className="form-card-box">
            <div className="card-top-row">
              <div className="badge-and-titles">
                <span className="step-num-circle blue-num">03</span>
                <div>
                  <h2 className="card-primary-title">Line Item Estimates & BOM Specification</h2>
                  <p className="card-secondary-desc">Detailed component breakdown for audit and validation</p>
                </div>
              </div>
              <button
                type="button"
                className="add-line-item-btn"
                onClick={handleAddLineItem}
              >
                <Plus size={14} />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="card-content-body">
              <div className="bom-table-wrapper">
                <table className="bom-spec-table">
                  <thead>
                    <tr>
                      <th className="th-desc">ITEM DESCRIPTION</th>
                      <th className="th-cat">CATEGORY</th>
                      <th className="th-qty">QTY</th>
                      <th className="th-rate">UNIT RATE (₹)</th>
                      <th className="th-subtotal">SUBTOTAL (₹)</th>
                      <th className="th-act">ACT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="bom-row">
                        <td className="td-desc">
                          <span className="bom-item-name">{item.title}</span>
                          <span className="bom-item-sub">{item.subtitle}</span>
                        </td>
                        <td className="td-cat">
                          <span className={`category-tag ${item.category.toLowerCase()}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="td-qty">{item.qty}</td>
                        <td className="td-rate">{formatINR(item.unitRate)}</td>
                        <td className="td-subtotal">
                          <strong>{formatINR(item.subtotal)}</strong>
                        </td>
                        <td className="td-act">
                          <button
                            type="button"
                            className="trash-btn"
                            onClick={() => handleRemoveLineItem(item.id)}
                            title="Delete line item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bom-table-footer-sum">
                <span className="sum-label">Total Estimated Line Items Sum:</span>
                <strong className="sum-amount">₹ {formatINR(lineItemsSum)}</strong>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <aside className="right-sidebar-column">
          {/* Card 1: EXECUTIVE IMPACT */}
          <section className="sidebar-card-box">
            <div className="sidebar-card-head">
              <h3 className="sidebar-heading">EXECUTIVE IMPACT</h3>
              <span className="dept-tag-pill">Production Dept</span>
            </div>

            <div className="sidebar-card-content">
              <div className="metric-strip current-alloc">
                <span className="strip-label">Current Dept Allocation</span>
                <strong className="strip-value">₹ 50,00,000</strong>
              </div>

              <div className="metric-strip proposed-addition">
                <div className="addition-lead">
                  <span className="green-bullet" />
                  <span className="strip-label">Proposed Addition</span>
                </div>
                <strong className="strip-value green-text">+ ₹ {formatINR(totalAmountNum)}</strong>
              </div>

              <div className="metric-strip revised-total-card">
                <span className="strip-label white-text">Revised Dept Total</span>
                <strong className="strip-value white-text">₹ 95,00,000</strong>
              </div>

              <div className="utilization-progress-section">
                <div className="progress-labels">
                  <span className="util-title">Department Cap Utilization</span>
                  <span className="util-pct">74.5% Used</span>
                </div>
                <div className="progress-track-bg">
                  <div className="progress-fill-red" style={{ width: '74.5%' }} />
                </div>
                <span className="unallocated-subtext">Remaining unallocated pool: ₹ 32,50,000</span>
              </div>
            </div>
          </section>

          {/* Card 2: SIGN-OFF HIERARCHY */}
          <section className="sidebar-card-box">
            <div className="sidebar-card-head">
              <div>
                <h3 className="sidebar-heading">SIGN-OFF HIERARCHY</h3>
                <p className="sidebar-subtitle">Sequential approval workflow</p>
              </div>
              <span className="tier-badge-pill">4 Tiers</span>
            </div>

            <div className="sign-off-timeline-list">
              {/* Step 1 */}
              <div className="sign-off-step-item">
                <div className="step-badge-circle green-step-circle">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div className="step-info-block">
                  <strong className="approver-name">Rohit Sharma</strong>
                  <span className="approver-title">Admin / Manufacturing Operations</span>
                  <span className="step-timestamp">Today, 11:24 AM</span>
                </div>
                <span className="status-pill initiated-pill">INITIATED</span>
              </div>

              {/* Step 2 */}
              <div className="sign-off-step-item active-step">
                <div className="step-badge-circle amber-step-circle">2</div>
                <div className="step-info-block">
                  <strong className="approver-name">Rajesh Kulkarni</strong>
                  <span className="approver-title">VP Production & Plant Operations</span>
                  <span className="sla-note">SLA: 24h Response Window</span>
                </div>
                <span className="status-pill pending-pill">PENDING REVIEW</span>
              </div>

              {/* Step 3 */}
              <div className="sign-off-step-item">
                <div className="step-badge-circle gray-step-circle">3</div>
                <div className="step-info-block">
                  <strong className="approver-name">Ananya Sen</strong>
                  <span className="approver-title">Chief Financial Controller (CFC)</span>
                </div>
                <span className="status-pill next-pill">Next In Sequence</span>
              </div>

              {/* Step 4 */}
              <div className="sign-off-step-item">
                <div className="step-badge-circle gray-step-circle">4</div>
                <div className="step-info-block">
                  <strong className="approver-name">K. Tanaka</strong>
                  <span className="approver-title">Managing Director & Plant Head</span>
                </div>
                <span className="status-pill gatekeeper-pill">Final Gatekeeper</span>
              </div>
            </div>
          </section>

          {/* Card 3: DOCUMENTATION */}
          <section className="sidebar-card-box">
            <div className="sidebar-card-head">
              <h3 className="sidebar-heading">DOCUMENTATION</h3>
              <span className="file-formats-text">PDF / XLS / DOCX</span>
            </div>

            <div className="sidebar-card-content">
              <label className="upload-dropzone-box">
                <Upload size={18} className="upload-icon-gray" />
                <span className="drop-title">Upload Vendor Quotation or RFQ</span>
                <span className="drop-desc">Drag files here or click to browse (Max 25MB)</span>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {attachedDoc && (
                <div className="attached-file-pill">
                  <div className="doc-icon-red">
                    <FileText size={15} />
                  </div>
                  <div className="attached-file-info">
                    <span className="file-name-text">{attachedDoc.name}</span>
                    <span className="file-sub-info">
                      {attachedDoc.size} • {attachedDoc.author}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove-doc-btn"
                    onClick={() => setAttachedDoc(null)}
                    title="Remove document"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="floating-bottom-action-bar">
        <div className="cloud-save-status">
          <span className="green-pulse-dot" />
          <span className="save-status-text">Auto-saved to cloud draft as <strong>BG-2026-27-009</strong></span>
        </div>

        <div className="action-buttons-cluster">
          <button
            type="button"
            className="btn-neutral-flat"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Cancel & Discard
          </button>
          <button
            type="button"
            className="btn-neutral-box"
            onClick={() => handleSubmit('Draft')}
            disabled={isSubmitting}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn-primary-red"
            onClick={() => handleSubmit('Approved')}
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit for Approval'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="portal-footer-line">
        <span className="copyright-text">
          <strong>TOYOTA Gurukul</strong> © 2026 Budget Management Portal. All rights reserved.
        </span>
        <div className="footer-links-group">
          <span>Privacy Policy</span>
          <span className="dot-divider">•</span>
          <span>Terms of Service</span>
          <span className="dot-divider">•</span>
          <span>Internal Helpdesk</span>
        </div>
      </footer>
    </div>
  )
}
