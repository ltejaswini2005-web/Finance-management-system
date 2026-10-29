import React, { useState, useEffect } from 'react'
import { X, FilePlus2, ChevronDown, ArrowRight } from 'lucide-react'

// Convert number to Indian words
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

function formatINR(val) {
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, '')) || 0
  return new Intl.NumberFormat('en-IN').format(num)
}

export default function CreateBudgetModal({ isOpen, onClose, onSaveSuccess, departments }) {
  const [activeTab, setActiveTab] = useState(1)
  const [departmentId, setDepartmentId] = useState('dept-paint')
  const [activityCode] = useState('1000015')
  const [sectionUnit, setSectionUnit] = useState('Shop 4 - Paint Shop / Automated Booth B')
  const [activityDescription, setActivityDescription] = useState('Robotic Sealant Dispenser Calibration & High-Precision Nozzle Overhaul')
  const [classification, setClassification] = useState('CAPEX')
  const [requestedAmount, setRequestedAmount] = useState('1500000')
  const [executionMonth, setExecutionMonth] = useState('October 2026 (Q3)')
  const [primaryQuarter, setPrimaryQuarter] = useState('Q3 (Oct - Dec)')
  
  // Quarterly split percentages
  const [q1Percent, setQ1Percent] = useState(0)
  const [q2Percent, setQ2Percent] = useState(20)
  const [q3Percent, setQ3Percent] = useState(70)
  const [q4Percent, setQ4Percent] = useState(10)

  const [savedTime, setSavedTime] = useState('11:24:48 AM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setSavedTime(now.toLocaleTimeString('en-US', { hour12: true }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  if (!isOpen) return null

  const totalAmountNum = Number(String(requestedAmount).replace(/[^0-9]/g, '')) || 0
  const q1Amount = Math.round((totalAmountNum * q1Percent) / 100)
  const q2Amount = Math.round((totalAmountNum * q2Percent) / 100)
  const q3Amount = Math.round((totalAmountNum * q3Percent) / 100)
  const q4Amount = Math.round((totalAmountNum * q4Percent) / 100)
  const totalPercent = q1Percent + q2Percent + q3Percent + q4Percent
  const isBalanced = totalPercent === 100

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setRequestedAmount(raw)
  }

  const handleSliderChange = (quarter, val) => {
    const num = Math.min(100, Math.max(0, Number(val)))
    if (quarter === 1) setQ1Percent(num)
    else if (quarter === 2) setQ2Percent(num)
    else if (quarter === 3) setQ3Percent(num)
    else if (quarter === 4) setQ4Percent(num)
  }

  const handleSave = async (status = 'Approved') => {
    setErrorMessage('')
    if (!activityDescription.trim()) {
      setErrorMessage('Please enter an Activity Head Description')
      return
    }
    if (totalAmountNum <= 0) {
      setErrorMessage('Please enter a valid requested budget amount')
      return
    }

    setIsSubmitting(true)
    try {
      const deptObj = departments.find((d) => d.id === departmentId) || { name: 'Paint Shop (Coating & Sealing)' }
      
      const newPlan = {
        budgetCode: activityCode,
        activityHead: 'Paint',
        departmentId,
        departmentName: deptObj.name,
        section: sectionUnit,
        activityDescription,
        requestedAmount: totalAmountNum,
        timeline: executionMonth.includes('Q3') ? 'Oct-Dec' : executionMonth.includes('Q1') ? 'Apr-Jun' : executionMonth.includes('Q2') ? 'Jul-Sep' : 'Jan-Mar',
        quartersActive: {
          q1: q1Percent > 0,
          q2: q2Percent > 0,
          q3: q3Percent > 0,
          q4: q4Percent > 0,
        },
        status: status === 'Draft' ? 'On Hold' : 'On Track',
        fiscalYear: 2026,
        classification,
        costCenter: 'CC-3015 - Automated Sealing Booth',
        purpose: activityDescription,
        quarters: [
          { label: 'Q1 (Apr – Jun)', percentage: q1Percent, amount: q1Amount, milestone: 'RFQ Preparation' },
          { label: 'Q2 (Jul – Sep)', percentage: q2Percent, amount: q2Amount, milestone: 'Component Procurement' },
          { label: 'Q3 (Oct – Dec)', percentage: q3Percent, amount: q3Amount, milestone: 'Installation & Calibration' },
          { label: 'Q4 (Jan – Mar)', percentage: q4Percent, amount: q4Amount, milestone: 'Final Quality Sign-off' },
        ],
        lineItems: [
          { description: 'Robotic Sealant Dispenser Calibration Kits', category: 'Equipment', quantity: '1 set', unitRate: totalAmountNum, subtotal: totalAmountNum }
        ]
      }

      await onSaveSuccess(newPlan)
      onClose()
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to submit budget plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="stitch-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-row">
          <div className="modal-title-lockup">
            <div className="modal-icon-badge">
              <FilePlus2 size={18} className="modal-icon-red" />
            </div>
            <div>
              <div className="modal-title-line">
                <h1 className="modal-heading-text">New Budget Plan Application</h1>
                <span className="badge-fy-red">FY 2026-27</span>
              </div>
              <p className="modal-subtitle-text">Activity Head Allocation Requisition • Plant: Bidadi Plant 2</p>
            </div>
          </div>

          <div className="modal-header-right">
            <div className="plan-id-box">
              <span className="plan-id-text">
                PLAN ID <strong className="plan-id-num">BP-2026-27-015</strong>
              </span>
              <span className="initiator-text">Initiator: Rohit Sharma (Admin)</span>
            </div>
            <button
              type="button"
              className="modal-close-icon-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stepped Progress Bar */}
        <div className="modal-progress-nav">
          <button
            type="button"
            className={`step-item-btn ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            <span className="step-circle red-step">1</span>
            <span className="step-label">Department & Head</span>
          </button>
          <button
            type="button"
            className={`step-item-btn ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            <span className="step-circle gray-step">2</span>
            <span className="step-label">Fiscal Phasing</span>
          </button>
          <button
            type="button"
            className={`step-item-btn ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => setActiveTab(3)}
          >
            <span className="step-circle gray-step">3</span>
            <span className="step-label">Kaizen Justification</span>
          </button>
          <button
            type="button"
            className={`step-item-btn ${activeTab === 4 ? 'active' : ''}`}
            onClick={() => setActiveTab(4)}
          >
            <span className="step-circle gray-step">4</span>
            <span className="step-label">Sign-off & Files</span>
          </button>
        </div>

        {errorMessage && <div className="modal-error-banner">{errorMessage}</div>}

        {/* Modal Scrollable Body */}
        <div className="modal-body-content">
          {/* SECTION 01 */}
          <section className="form-section-card">
            <div className="section-card-header">
              <div className="section-title-combo">
                <span className="section-num-circle red-num">01</span>
                <h2 className="section-heading">Department & Activity Head Specifications</h2>
              </div>
              <span className="mandatory-note">* Mandatory shopfloor mapping</span>
            </div>

            <div className="form-fields-grid three-col">
              <div className="form-group">
                <label className="field-label">
                  Department Division <span className="req-star">*</span>
                </label>
                <div className="select-container">
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="stitch-select"
                  >
                    <option value="dept-paint">Paint Shop (Coating & Sealing)</option>
                    <option value="dept-production">Production (Assembly Line)</option>
                    <option value="dept-press">Press Shop</option>
                    <option value="dept-weld">Weld Shop</option>
                    <option value="dept-assy">Assembly (Production)</option>
                    <option value="dept-quality">Quality Assurance</option>
                    <option value="dept-maintenance">Maintenance & Utilities</option>
                    <option value="dept-logistics">Logistics & Material Movement</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">
                  Activity Head Code <span className="req-star">*</span>
                </label>
                <div className="code-input-wrapper">
                  <input
                    type="text"
                    readOnly
                    value={activityCode}
                    className="stitch-input code-input"
                  />
                  <span className="badge-auto-assigned">Auto-Assigned</span>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">
                  Section / Shopfloor Unit <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  value={sectionUnit}
                  onChange={(e) => setSectionUnit(e.target.value)}
                  className="stitch-input"
                  placeholder="e.g. Shop 4 - Paint Shop / Automated Booth B"
                />
              </div>
            </div>

            <div className="form-group full-width-group">
              <label className="field-label">
                Activity Head Description <span className="req-star">*</span>
              </label>
              <input
                type="text"
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
                className="stitch-input"
                placeholder="Detailed activity description"
              />
            </div>

            <div className="form-group classification-group">
              <label className="field-label">
                Expenditure Classification <span className="req-star">*</span>
              </label>
              <div className="radio-cards-row">
                <label
                  className={`radio-card-label ${classification === 'CAPEX' ? 'selected-red' : ''}`}
                  onClick={() => setClassification('CAPEX')}
                >
                  <div className="radio-indicator-circle">
                    {classification === 'CAPEX' && <div className="radio-inner-dot" />}
                  </div>
                  <div className="radio-card-info">
                    <span className="radio-card-title">CAPEX (Capital Expenditure)</span>
                    <span className="radio-card-desc">Asset acquisition, machine automation retrofit, tooling additions</span>
                  </div>
                </label>

                <label
                  className={`radio-card-label ${classification === 'OPEX' ? 'selected-red' : ''}`}
                  onClick={() => setClassification('OPEX')}
                >
                  <div className="radio-indicator-circle">
                    {classification === 'OPEX' && <div className="radio-inner-dot" />}
                  </div>
                  <div className="radio-card-info">
                    <span className="radio-card-title">OPEX (Operational Expenditure)</span>
                    <span className="radio-card-desc">Routine consumables, filters, regular preventive calibration & parts</span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 02 */}
          <section className="form-section-card">
            <div className="section-card-header">
              <div className="section-title-combo">
                <span className="section-num-circle red-num">02</span>
                <h2 className="section-heading">Fiscal Budget, Milestones & Quarterly Phasing</h2>
              </div>
              <span className="headroom-note">
                Paint Shop Remaining Headroom: <strong>₹ 34,50,000</strong>
              </span>
            </div>

            <div className="form-fields-grid three-col">
              <div className="form-group">
                <label className="field-label">
                  Total Requested Amount (₹ INR) <span className="req-star">*</span>
                </label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="text"
                    value={formatINR(requestedAmount)}
                    onChange={handleAmountChange}
                    className="stitch-input amount-bold-input"
                  />
                </div>
                <div className="amount-helper-row">
                  <span className="in-words-text">In words: {numberToIndianWords(totalAmountNum)}</span>
                  <span className="badge-headroom-cap">Within Headroom Cap</span>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">
                  Target Execution Month <span className="req-star">*</span>
                </label>
                <div className="select-container">
                  <select
                    value={executionMonth}
                    onChange={(e) => {
                      const val = e.target.value
                      setExecutionMonth(val)
                      if (val.includes('Q1')) setPrimaryQuarter('Q1 (Apr - Jun)')
                      else if (val.includes('Q2')) setPrimaryQuarter('Q2 (Jul - Sep)')
                      else if (val.includes('Q3')) setPrimaryQuarter('Q3 (Oct - Dec)')
                      else if (val.includes('Q4')) setPrimaryQuarter('Q4 (Jan - Mar)')
                    }}
                    className="stitch-select"
                  >
                    <option value="October 2026 (Q3)">October 2026 (Q3)</option>
                    <option value="April 2026 (Q1)">April 2026 (Q1)</option>
                    <option value="May 2026 (Q1)">May 2026 (Q1)</option>
                    <option value="June 2026 (Q1)">June 2026 (Q1)</option>
                    <option value="July 2026 (Q2)">July 2026 (Q2)</option>
                    <option value="August 2026 (Q2)">August 2026 (Q2)</option>
                    <option value="September 2026 (Q2)">September 2026 (Q2)</option>
                    <option value="November 2026 (Q3)">November 2026 (Q3)</option>
                    <option value="December 2026 (Q3)">December 2026 (Q3)</option>
                    <option value="January 2027 (Q4)">January 2027 (Q4)</option>
                    <option value="February 2027 (Q4)">February 2027 (Q4)</option>
                    <option value="March 2027 (Q4)">March 2027 (Q4)</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Primary Milestone Quarter</label>
                <div className="primary-quarter-display-card">
                  <span className="primary-quarter-name">{primaryQuarter}</span>
                  <span className="primary-amber-dot" />
                </div>
              </div>
            </div>

            {/* Quarterly Disbursement Split Sliders */}
            <div className="quarterly-disbursement-subheading">
              <span className="split-title">Quarterly Disbursement Split (%)</span>
              <span className={`badge-balanced-phasing ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                {isBalanced ? '100% Balanced Phasing' : `${totalPercent}% Phased (Adjust to 100%)`}
              </span>
            </div>

            <div className="quarters-sliders-grid">
              {/* Q1 */}
              <div className="quarter-slider-box">
                <div className="q-box-top">
                  <span className="q-label-text">Q1 (Apr-Jun)</span>
                  <span className="q-percent-val">{q1Percent}%</span>
                </div>
                <div className="q-amount-text">₹ {formatINR(q1Amount)}</div>
                <div className="q-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={q1Percent}
                    onChange={(e) => handleSliderChange(1, e.target.value)}
                    className="quarter-range-slider q1-slider"
                  />
                </div>
              </div>

              {/* Q2 */}
              <div className="quarter-slider-box">
                <div className="q-box-top">
                  <span className="q-label-text">Q2 (Jul-Sep)</span>
                  <span className="q-percent-val">{q2Percent}%</span>
                </div>
                <div className="q-amount-text">₹ {formatINR(q2Amount)}</div>
                <div className="q-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={q2Percent}
                    onChange={(e) => handleSliderChange(2, e.target.value)}
                    className="quarter-range-slider q2-slider"
                  />
                </div>
              </div>

              {/* Q3 (Active/Highlight Border) */}
              <div className="quarter-slider-box highlight-amber-box">
                <div className="q-box-top">
                  <span className="q-label-text">Q3 (Oct-Dec)</span>
                  <span className="q-percent-val">{q3Percent}%</span>
                </div>
                <div className="q-amount-text">₹ {formatINR(q3Amount)}</div>
                <div className="q-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={q3Percent}
                    onChange={(e) => handleSliderChange(3, e.target.value)}
                    className="quarter-range-slider q3-slider"
                  />
                </div>
              </div>

              {/* Q4 */}
              <div className="quarter-slider-box">
                <div className="q-box-top">
                  <span className="q-label-text">Q4 (Jan-Mar)</span>
                  <span className="q-percent-val">{q4Percent}%</span>
                </div>
                <div className="q-amount-text">₹ {formatINR(q4Amount)}</div>
                <div className="q-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={q4Percent}
                    onChange={(e) => handleSliderChange(4, e.target.value)}
                    className="quarter-range-slider q4-slider"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Sticky Footer */}
        <div className="modal-footer-action-bar">
          <div className="footer-status-indicator">
            <span className="green-live-dot" />
            <span className="auto-save-text">Draft auto-saved to cloud: {savedTime}</span>
          </div>

          <div className="footer-button-group">
            <button
              type="button"
              className="btn-neutral-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel & Discard
            </button>
            <button
              type="button"
              className="btn-neutral-outline"
              onClick={() => handleSave('Draft')}
              disabled={isSubmitting}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="btn-submit-red"
              onClick={() => handleSave('Approved')}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Plan for Approval'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
