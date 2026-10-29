import React from 'react'

export default function TimelineSchedule() {
  const quarters = [
    {
      id: 'q1',
      label: 'Q1 (Apr - Jun 2026)',
      months: ['Apr', 'May', 'Jun'],
      accent: 'teal',
      barLabel: 'Press • Skill Fest & Clamp Kit',
    },
    {
      id: 'q2',
      label: 'Q2 (Jul - Sep 2026)',
      months: ['Jul', 'Aug', 'Sep'],
      accent: 'blue',
      barLabel: 'Paint • Spray Gun & Booth Filter',
    },
    {
      id: 'q3',
      label: 'Q3 (Oct - Dec 2026)',
      months: ['Oct', 'Nov', 'Dec'],
      accent: 'amber',
      barLabel: 'Weld • ARC Repair',
    },
    {
      id: 'q4',
      label: 'Q4 (Jan - Mar 2027)',
      months: ['Jan', 'Feb', 'Mar'],
      accent: 'rose',
      barLabel: 'Assy • Motor & Demolishing',
    },
  ]

  return (
    <section className="timeline-schedule-card">
      <div className="timeline-header-row">
        <div>
          <h2 className="timeline-title">IMPLEMENTATION TIMELINE & PHASING SCHEDULE</h2>
          <p className="timeline-subtitle">Quarterly milestone distribution for approved Kaizen & CapEx line activities</p>
        </div>

        <div className="timeline-legend">
          <div className="legend-item">
            <span className="legend-dot teal-dot" />
            <span className="legend-text">Q1 Scheduled</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot blue-dot" />
            <span className="legend-text">Q2 Scheduled</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot amber-dot" />
            <span className="legend-text">Q3 Scheduled</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot rose-dot" />
            <span className="legend-text">Q4 Scheduled</span>
          </div>
        </div>
      </div>

      <div className="timeline-grid-wrapper">
        <div className="timeline-quarters-header">
          {quarters.map((q) => (
            <div key={q.id} className={`quarter-header-cell ${q.accent}`}>
              {q.label}
            </div>
          ))}
        </div>

        <div className="timeline-months-row">
          {quarters.flatMap((q) =>
            q.months.map((m) => (
              <div key={`${q.id}-${m}`} className="month-header-cell">
                {m}
              </div>
            ))
          )}
        </div>

        <div className="timeline-gantt-track">
          {quarters.map((q) => (
            <div key={q.id} className={`gantt-phase-bar ${q.accent}`}>
              <span className="gantt-bar-text">{q.barLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
