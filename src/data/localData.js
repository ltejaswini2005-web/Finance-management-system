const BUDGETS_KEY = 'gurukul-budget-plans'
const DEPARTMENTS_KEY = 'gurukul-departments'
const EXPENSES_KEY = 'gurukul-expenses'
const PROJECTS_KEY = 'gurukul-projects'
const DATA_VERSION_KEY = 'gurukul-budget-data-version'
const DATA_VERSION = 'stitch-budget-dashboard-v5'

export const initialDepartments = [
  { id: 'dept-press', name: 'Press Shop', code: 'PRESS', active: true, division: 'Manufacturing', head: 'Arjun Menon', email: 'press@toyota-gurukul.in', phone: '+91-80-4411-2201', location: 'Block A, Bay 1', headCount: 42, annualBudget: 3500000, description: 'High-tonnage stamping and blanking for body panels and structural components.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-weld', name: 'Weld Shop', code: 'WELD', active: true, division: 'Manufacturing', head: 'Sneha Pillai', email: 'weld@toyota-gurukul.in', phone: '+91-80-4411-2202', location: 'Block A, Bay 2', headCount: 38, annualBudget: 2800000, description: 'Robotic and manual spot welding for body-in-white assembly and sub-frame joining.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-paint', name: 'Paint Shop (Coating & Sealing)', code: 'PAINT', active: true, division: 'Manufacturing', head: 'Ravi Shankar', email: 'paint@toyota-gurukul.in', phone: '+91-80-4411-2203', location: 'Block B, Bay 1', headCount: 56, annualBudget: 4200000, description: 'Electrodeposition priming, robotic base-coat/clear-coat spray and quality inspection.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-assy', name: 'Assembly (Production)', code: 'ASSY', active: true, division: 'Manufacturing', head: 'Divya Nair', email: 'assembly@toyota-gurukul.in', phone: '+91-80-4411-2204', location: 'Block C, Bay 1-3', headCount: 120, annualBudget: 7500000, description: 'Trim, chassis and final assembly including engine dress and end-of-line functional testing.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-production', name: 'Production (Assembly Line)', code: 'PROD', active: true, division: 'Operations', head: 'Rohit Sharma', email: 'production@toyota-gurukul.in', phone: '+91-80-4411-2205', location: 'Block C, Bay 4', headCount: 85, annualBudget: 5000000, description: 'Line balancing, cycle-time optimisation and automated PLC-driven assembly control.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-quality', name: 'Quality Assurance', code: 'QUAL', active: true, division: 'Inspection', head: 'Meena Kulkarni', email: 'quality@toyota-gurukul.in', phone: '+91-80-4411-2206', location: 'Block D, Lab 1', headCount: 28, annualBudget: 1800000, description: 'CMM metrology, NDT inspection, IATF 16949 audit management and supplier quality assurance.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-maintenance', name: 'Maintenance & Utilities', code: 'MNT', active: true, division: 'Engineering', head: 'Kiran Bhat', email: 'maintenance@toyota-gurukul.in', phone: '+91-80-4411-2207', location: 'Block E, Utility Wing', headCount: 34, annualBudget: 2200000, description: 'Predictive and preventive maintenance of plant machinery, utilities and compressed-air systems.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
  { id: 'dept-logistics', name: 'Logistics & Material Movement', code: 'LOG', active: true, division: 'Supply Chain', head: 'Priya Venkat', email: 'logistics@toyota-gurukul.in', phone: '+91-80-4411-2208', location: 'Block F, Dock Area', headCount: 46, annualBudget: 2600000, description: 'Inbound sequenced delivery, AGV material routing, dock operations and vendor milk-run management.', createdAt: '2024-04-01T00:00:00.000Z', updatedAt: '2026-04-01T00:00:00.000Z' },
]

export const initialProjects = [
  {
    id: 'proj-001',
    name: 'FY27 Assembly Line Automation Upgrade',
    code: 'PRJ-2026-001',
    departmentId: 'dept-production',
    departmentName: 'Production (Assembly Line)',
    status: 'Active',
    priority: 'High',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    budget: 4500000,
    spent: 1700000,
    owner: 'Rohit Sharma',
    description: 'Full replacement of legacy servo rigs with PLC-telemetry sensors across Assembly Track #2. Target: 48 cars/hour throughput.',
    tags: ['CAPEX', 'Automation', 'PLC'],
    milestones: 4,
    completedMilestones: 1,
    createdAt: '2026-04-01T09:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'proj-002',
    name: 'Paint Shop Sealant Dispenser Overhaul',
    code: 'PRJ-2026-002',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    status: 'Active',
    priority: 'Medium',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    budget: 1500000,
    spent: 300000,
    owner: 'Ravi Shankar',
    description: 'Nozzle overhaul and micro-dosing pump replacement on Automated Sealant Booth B.',
    tags: ['CAPEX', 'Paint'],
    milestones: 3,
    completedMilestones: 1,
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'proj-003',
    name: 'Skill Festival 2026 — Press & Weld',
    code: 'PRJ-2026-003',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    status: 'Completed',
    priority: 'Low',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    budget: 1400000,
    spent: 1400000,
    owner: 'Arjun Menon',
    description: 'Annual kaizen skill festival with inter-department press and weld competition.',
    tags: ['OPEX', 'Training'],
    milestones: 2,
    completedMilestones: 2,
    createdAt: '2026-03-15T09:00:00.000Z',
    updatedAt: '2026-07-02T10:00:00.000Z',
  },
  {
    id: 'proj-004',
    name: 'CMM Metrology Lab Expansion',
    code: 'PRJ-2026-004',
    departmentId: 'dept-quality',
    departmentName: 'Quality Assurance',
    status: 'Active',
    priority: 'High',
    startDate: '2026-05-01',
    endDate: '2026-10-31',
    budget: 850000,
    spent: 850000,
    owner: 'Meena Kulkarni',
    description: 'Precision ceramic calibration sphere and sapphire ruby styli upgrade for Metrology Lab CC-5010.',
    tags: ['CAPEX', 'Quality'],
    milestones: 2,
    completedMilestones: 2,
    createdAt: '2026-05-01T09:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'proj-005',
    name: 'Chiller Plant VFD Compressor Overhaul',
    code: 'PRJ-2026-005',
    departmentId: 'dept-maintenance',
    departmentName: 'Maintenance & Utilities',
    status: 'Completed',
    priority: 'Medium',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    budget: 1200000,
    spent: 1200000,
    owner: 'Kiran Bhat',
    description: 'Preventive replacement of ceramic spindle bearings in centrifugal chiller unit CC-6012.',
    tags: ['OPEX', 'Maintenance'],
    milestones: 2,
    completedMilestones: 2,
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
  },
  {
    id: 'proj-006',
    name: 'AGV Charging Infrastructure Upgrade',
    code: 'PRJ-2026-006',
    departmentId: 'dept-assy',
    departmentName: 'Assembly (Production)',
    status: 'On Hold',
    priority: 'Low',
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    budget: 320000,
    spent: 160000,
    owner: 'Divya Nair',
    description: 'In-floor inductive wireless magnetic power strip servicing for AGV floor route CC-4018.',
    tags: ['OPEX', 'AGV'],
    milestones: 2,
    completedMilestones: 1,
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-15T10:00:00.000Z',
  },
  {
    id: 'proj-007',
    name: 'ED Bath Anode Membrane Replacement',
    code: 'PRJ-2026-007',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    status: 'Active',
    priority: 'High',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    budget: 920000,
    spent: 0,
    owner: 'Ravi Shankar',
    description: 'Tubular dialyzer membranes for continuous pH and conductivity stabilization in electrodeposition tank.',
    tags: ['CAPEX', 'Paint'],
    milestones: 2,
    completedMilestones: 0,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'proj-008',
    name: 'Compressed Air Leak Reduction Initiative',
    code: 'PRJ-2026-008',
    departmentId: 'dept-maintenance',
    departmentName: 'Maintenance & Utilities',
    status: 'Active',
    priority: 'Medium',
    startDate: '2026-10-01',
    endDate: '2027-03-31',
    budget: 310000,
    spent: 0,
    owner: 'Kiran Bhat',
    description: 'Acoustic imaging camera deployment to localize compressed air loss and reduce plant kWh consumption.',
    tags: ['CAPEX', 'Energy'],
    milestones: 3,
    completedMilestones: 0,
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
]

export const initialBudgetActivityPlans = [
  {
    id: 'plan-1806090',
    budgetCode: '1806090',
    activityHead: 'Press',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    section: '1',
    activityDescription: 'Skill Festival Activities',
    requestedAmount: 1000000,
    timeline: 'Apr-Jun',
    quartersActive: { q1: true, q2: false, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-1011 - Press Tooling',
    purpose: 'Kaizen skill festival and line worker certification.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 100, amount: 1000000, milestone: 'Skill Festival Execution' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [
      { description: 'Skill Festival Demonstration Tooling', category: 'Equipment', quantity: '1 set', unitRate: 600000, subtotal: 600000 },
      { description: 'Evaluation Kits & Safety Gear', category: 'Hardware', quantity: '40 kits', unitRate: 10000, subtotal: 400000 },
    ],
    updatedAt: '2026-04-18T10:00:00.000Z',
  },
  {
    id: 'plan-1806091',
    budgetCode: '1806091',
    activityHead: 'Weld',
    departmentId: 'dept-weld',
    departmentName: 'Weld Shop',
    section: '2',
    activityDescription: 'Visual check station',
    requestedAmount: 700000,
    timeline: 'Apr-Jun',
    quartersActive: { q1: true, q2: false, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-2022 - Robotic Weld Line',
    purpose: 'High accuracy visual inspection camera station for spot welds.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 100, amount: 700000, milestone: 'Vision Sensor Installation' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [
      { description: 'High-Res Industrial Vision Cameras', category: 'Equipment', quantity: '2 units', unitRate: 250000, subtotal: 500000 },
      { description: 'Calibration & Rig Mounting', category: 'Services', quantity: '1 pkg', unitRate: 200000, subtotal: 200000 },
    ],
    updatedAt: '2026-04-17T09:30:00.000Z',
  },
  {
    id: 'plan-1806092',
    budgetCode: '1806092',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '3',
    activityDescription: 'Skill contest part procurement',
    requestedAmount: 500000,
    timeline: 'Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3031 - Coating Line',
    purpose: 'Specialized primer and topcoat contest panels for paint craftsmanship.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 500000, milestone: 'Contest Material Delivery' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [
      { description: 'Substrate Test Panels & Automotive Coats', category: 'Hardware', quantity: '50 sets', unitRate: 10000, subtotal: 500000 },
    ],
    updatedAt: '2026-04-16T14:20:00.000Z',
  },
  {
    id: 'plan-1806093',
    budgetCode: '1806093',
    activityHead: 'Press',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    section: '4',
    activityDescription: 'Pneumatic clamping kit (prevent mask part)',
    requestedAmount: 250000,
    timeline: 'Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-1014 - Stamping Line',
    purpose: 'Pneumatic rapid fixture clamping kits to eliminate masking defects.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 250000, milestone: 'Press Clamping Retrofit' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-15T11:15:00.000Z',
  },
  {
    id: 'plan-1806094',
    budgetCode: '1806094',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '5',
    activityDescription: 'Sending Table rubber mat procurement',
    requestedAmount: 50000,
    timeline: 'Oct',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Hold',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3032 - Buffer Conveyor',
    purpose: 'Heavy duty antistatic ESD conductive mats for paint unloading tables.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 50000, milestone: 'ESD Mat Procurement' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-14T16:00:00.000Z',
  },
  {
    id: 'plan-1806095',
    budgetCode: '1806095',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '6',
    activityDescription: 'Booth Chimney Cleaning & Filter replace',
    requestedAmount: 20000,
    timeline: 'Aug',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3035 - Booth Air Systems',
    purpose: 'Exhaust plenum scrub and primary/secondary HEPA filter replacement.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 100, amount: 20000, milestone: 'Filter Overhaul' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-14T08:45:00.000Z',
  },
  {
    id: 'plan-1806096',
    budgetCode: '1806096',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '7',
    activityDescription: 'Spray Gun procurement',
    requestedAmount: 200000,
    timeline: 'July',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-3036 - Robotic Atomizers',
    purpose: 'Precision electrostatic rotary bell spray guns for clearcoat booth.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 100, amount: 200000, milestone: 'Bell Atomizer Delivery' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-13T13:20:00.000Z',
  },
  {
    id: 'plan-1806097',
    budgetCode: '1806097',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '8',
    activityDescription: 'Paint Material for FST & EWT',
    requestedAmount: 100000,
    timeline: 'Sep',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3038 - Test Batch Laboratory',
    purpose: 'Trial paint runs and environmental chamber durability verification.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 100, amount: 100000, milestone: 'FST Run Supplies' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-12T10:10:00.000Z',
  },
  {
    id: 'plan-1806098',
    budgetCode: '1806098',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '9',
    activityDescription: 'ARC/WELD Repair panel',
    requestedAmount: 100000,
    timeline: 'Jan',
    quartersActive: { q1: false, q2: false, q3: false, q4: true },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3040 - Body Repair Line',
    purpose: 'Protective acoustic and thermal barrier panels for repair station.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 100, amount: 100000, milestone: 'Panel Replacement' },
    ],
    lineItems: [],
    updatedAt: '2026-04-11T12:00:00.000Z',
  },
  {
    id: 'plan-1806099',
    budgetCode: '1806099',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '10',
    activityDescription: 'Paint entrance mat procurement',
    requestedAmount: 50000,
    timeline: 'Sep',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3042 - Cleanroom Air Shower',
    purpose: 'Multilayer tacky contamination control entrance mats for clean zone.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 100, amount: 50000, milestone: 'Cleanroom Mat Supply' },
      { label: 'Q3 (Oct – Dec)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-10T14:30:00.000Z',
  },
  {
    id: 'plan-1806010',
    budgetCode: '1806010',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '11',
    activityDescription: 'New training area setup',
    requestedAmount: 50000,
    timeline: 'Oct',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3045 - Dojo Area',
    purpose: 'Ergonomic workbench and training visual displays for apprentice dojo.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 50000, milestone: 'Dojo Rigging' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-09T09:00:00.000Z',
  },
  {
    id: 'plan-1806011',
    budgetCode: '1806011',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '12',
    activityDescription: 'Gun cleaning table',
    requestedAmount: 500000,
    timeline: 'Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-3048 - Solvent Recovery',
    purpose: 'Explosion-proof automatic solvent gun washing table and vapor extractor.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 500000, milestone: 'Washer Station Commission' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-08T15:10:00.000Z',
  },
  {
    id: 'plan-1806012',
    budgetCode: '1806012',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '13',
    activityDescription: 'Oven chimney exhaust & PLC Motor repair',
    requestedAmount: 25000,
    timeline: 'Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-3050 - Curing Oven 2',
    purpose: 'Variable speed drive inverter replacement for curing exhaust fan.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 25000, milestone: 'Inverter Swap' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-07T11:45:00.000Z',
  },
  {
    id: 'plan-1806014',
    budgetCode: '1806014',
    activityHead: 'Assy',
    departmentId: 'dept-assy',
    departmentName: 'Assembly (Production)',
    section: '15',
    activityDescription: 'Lift used exhaust Structure demolishing',
    requestedAmount: 20000,
    timeline: 'Oct',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-4015 - Trim Line Elevator',
    purpose: 'Safe structural deconstruction of obsolete overhead elevator duct.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q2 (Jul – Sep)', percentage: 0, amount: 0, milestone: '-' },
      { label: 'Q3 (Oct – Dec)', percentage: 100, amount: 20000, milestone: 'Scaffolding & Dismantling' },
      { label: 'Q4 (Jan – Mar)', percentage: 0, amount: 0, milestone: '-' },
    ],
    lineItems: [],
    updatedAt: '2026-04-06T17:00:00.000Z',
  },
  // Additional Activity Head records to make 28 items total (Page 2)
  {
    id: 'plan-1806015',
    budgetCode: '1806015',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: 'Shop 4 - Paint Shop / Automated Booth B',
    activityDescription: 'Robotic Sealant Dispenser Calibration & High-Precision Nozzle Overhaul',
    requestedAmount: 1500000,
    timeline: 'Oct-Dec',
    quartersActive: { q1: false, q2: true, q3: true, q4: true },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-3015 - Automated Sealing Booth',
    purpose: 'Complete nozzle overhaul and micro-dosing pump replacement.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 0, amount: 0, milestone: 'RFQ Drafting' },
      { label: 'Q2 (Jul – Sep)', percentage: 20, amount: 300000, milestone: 'Component Procurement' },
      { label: 'Q3 (Oct – Dec)', percentage: 70, amount: 1050000, milestone: 'Booth Installation & Calibration' },
      { label: 'Q4 (Jan – Mar)', percentage: 10, amount: 150000, milestone: 'Final Quality Sign-off' },
    ],
    lineItems: [
      { description: 'High Precision Dispense Nozzle Heads', category: 'Equipment', quantity: '6 units', unitRate: 150000, subtotal: 900000 },
      { description: 'Pressure Transducers & Cables', category: 'Hardware', quantity: '1 set', unitRate: 350000, subtotal: 350000 },
      { description: 'OEM Integration Specialist Certification', category: 'Services', quantity: '1 pkg', unitRate: 250000, subtotal: 250000 },
    ],
    updatedAt: '2026-04-21T09:24:00.000Z',
  },
  {
    id: 'plan-1806016',
    budgetCode: '1806016',
    activityHead: 'Assy',
    departmentId: 'dept-production',
    departmentName: 'Production (Assembly Line)',
    section: 'CC-4012 - Manufacturing & Automation',
    activityDescription: 'Annual Assembly & Machine Automation Upgrade FY27',
    requestedAmount: 4500000,
    timeline: 'Apr-Mar',
    quartersActive: { q1: true, q2: true, q3: true, q4: true },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-4012 - Manufacturing & Automation',
    purpose: 'Replacement of legacy End-of-Line testing servo rigs with intelligent PLC telemetry sensors. Projected to curb unplanned line stops by 14.8% and elevate throughput to 48 cars/hour on Assembly Track #2 in accordance with Toyota Gurukul FY27 Modernization directives.',
    quarters: [
      { label: 'Q1 (Apr – Jun)', percentage: 33.3, amount: 1500000, milestone: 'RFQ Issue & Vendor Advance' },
      { label: 'Q2 (Jul – Sep)', percentage: 26.7, amount: 1200000, milestone: 'Hardware Procurement & Delivery' },
      { label: 'Q3 (Oct – Dec)', percentage: 22.2, amount: 1000000, milestone: 'Installation & PLC Commissioning' },
      { label: 'Q4 (Jan – Mar)', percentage: 17.8, amount: 800000, milestone: 'Final Sign-off & Retention Release' },
    ],
    lineItems: [
      { description: 'Robotic Arm Servo Motors & Calibration (KUKA 6-Axis High Precision Modules Gen-IV)', category: 'Equipment', quantity: '4 units', unitRate: 550000, subtotal: 2200000 },
      { description: 'Sensor Array & PLC Controller Wiring (Omron Optical Bus + EtherCAT Terminal Nodes)', category: 'Hardware', quantity: '1 Lot', unitRate: 1450000, subtotal: 1450000 },
      { description: 'Vendor Integration & Safety Testing (On-site deployment, safety cage interlock certification)', category: 'Services', quantity: '1 pkg', unitRate: 850000, subtotal: 850000 },
    ],
    updatedAt: '2026-04-21T10:15:00.000Z',
  },
  {
    id: 'plan-1806017',
    budgetCode: '1806017',
    activityHead: 'Weld',
    departmentId: 'dept-weld',
    departmentName: 'Weld Shop',
    section: '16',
    activityDescription: 'Sub-frame Robotic Tip Dresser Overhaul',
    requestedAmount: 650000,
    timeline: 'Oct-Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-2025 - Spot Welding',
    purpose: 'Pneumatic cutter head retrofit for 12 robotic welding guns.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-04-05T10:00:00.000Z',
  },
  {
    id: 'plan-1806018',
    budgetCode: '1806018',
    activityHead: 'Press',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    section: '17',
    activityDescription: 'Blank Feeder Optical Alignment Sensor',
    requestedAmount: 380000,
    timeline: 'Jan-Mar',
    quartersActive: { q1: false, q2: false, q3: false, q4: true },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-1018 - High Speed Blanker',
    purpose: 'Laser sheet double-feed detection system.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-04-04T12:00:00.000Z',
  },
  {
    id: 'plan-1806019',
    budgetCode: '1806019',
    activityHead: 'Assy',
    departmentId: 'dept-assy',
    departmentName: 'Assembly (Production)',
    section: '18',
    activityDescription: 'AGV Induction Charging Plate Maintenance',
    requestedAmount: 320000,
    timeline: 'Jul-Sep',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-4018 - AGV Floor Route',
    purpose: 'In-floor inductive wireless magnetic power strips servicing.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-04-03T11:00:00.000Z',
  },
  {
    id: 'plan-1806020',
    budgetCode: '1806020',
    activityHead: 'Quality',
    departmentId: 'dept-quality',
    departmentName: 'Quality Assurance',
    section: '19',
    activityDescription: 'CMM Calibration Artifact & Styli Upgrade',
    requestedAmount: 850000,
    timeline: 'Apr-Jun',
    quartersActive: { q1: true, q2: false, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-5010 - Metrology Lab',
    purpose: 'Precision ceramic calibration sphere and sapphire ruby styli.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-04-02T15:00:00.000Z',
  },
  {
    id: 'plan-1806021',
    budgetCode: '1806021',
    activityHead: 'Maintenance',
    departmentId: 'dept-maintenance',
    departmentName: 'Maintenance & Utilities',
    section: '20',
    activityDescription: 'Chiller Plant VFD Compressor Bearing Overhaul',
    requestedAmount: 1200000,
    timeline: 'Jul-Sep',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-6012 - Central Chiller Unit',
    purpose: 'Preventive replacement of ceramic spindle bearings in centrifugal chillers.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-04-01T14:00:00.000Z',
  },
  {
    id: 'plan-1806022',
    budgetCode: '1806022',
    activityHead: 'Logistics',
    departmentId: 'dept-logistics',
    departmentName: 'Logistics & Material Movement',
    section: '21',
    activityDescription: 'Dock Leveler Hydraulic Cylinder Replacement',
    requestedAmount: 450000,
    timeline: 'Oct-Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-7014 - Receiving Docks',
    purpose: 'Heavy duty telescopic cylinders for Bays 4, 5, and 6.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-30T10:00:00.000Z',
  },
  {
    id: 'plan-1806023',
    budgetCode: '1806023',
    activityHead: 'Paint',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    section: '22',
    activityDescription: 'ED Bath Anode Membrane Replacement',
    requestedAmount: 920000,
    timeline: 'Jul-Sep',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-3022 - Electrodeposition Tank',
    purpose: 'Tubular dialyzer membranes for continuous pH and conductivity stabilization.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-29T16:00:00.000Z',
  },
  {
    id: 'plan-1806024',
    budgetCode: '1806024',
    activityHead: 'Weld',
    departmentId: 'dept-weld',
    departmentName: 'Weld Shop',
    section: '23',
    activityDescription: 'Fume Extraction Hood Flow Sensors',
    requestedAmount: 180000,
    timeline: 'Jan-Mar',
    quartersActive: { q1: false, q2: false, q3: false, q4: true },
    status: 'On Hold',
    fiscalYear: 2026,
    classification: 'OPEX',
    costCenter: 'CC-2028 - Environmental Safety',
    purpose: 'Differential pressure flow switches for automated damper balancing.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-28T09:30:00.000Z',
  },
  {
    id: 'plan-1806025',
    budgetCode: '1806025',
    activityHead: 'Press',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    section: '24',
    activityDescription: 'Cushion Cylinder Nitrogen Gas Recharge Rig',
    requestedAmount: 280000,
    timeline: 'Apr-Jun',
    quartersActive: { q1: true, q2: false, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-1022 - Die Cushion Systems',
    purpose: 'Mobile high pressure nitrogen charging manifold with digital calibration.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-27T14:15:00.000Z',
  },
  {
    id: 'plan-1806026',
    budgetCode: '1806026',
    activityHead: 'Assy',
    departmentId: 'dept-assy',
    departmentName: 'Assembly (Production)',
    section: '25',
    activityDescription: 'Torque Wrench Wireless Data Transceiver Hub',
    requestedAmount: 640000,
    timeline: 'Oct-Dec',
    quartersActive: { q1: false, q2: false, q3: true, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-4025 - Critical Fastening',
    purpose: 'Direct IoT torque-angle telemetry broadcast to MES quality database.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-26T12:00:00.000Z',
  },
  {
    id: 'plan-1806027',
    budgetCode: '1806027',
    activityHead: 'Quality',
    departmentId: 'dept-quality',
    departmentName: 'Quality Assurance',
    section: '26',
    activityDescription: 'Ultrasonic Spot Weld Thickness Gauge',
    requestedAmount: 490000,
    timeline: 'Jul-Sep',
    quartersActive: { q1: false, q2: true, q3: false, q4: false },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-5020 - NDT Inspection',
    purpose: 'Portable phased array ultrasonic transducer for non-destructive weld audit.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-25T15:30:00.000Z',
  },
  {
    id: 'plan-1806028',
    budgetCode: '1806028',
    activityHead: 'Maintenance',
    departmentId: 'dept-maintenance',
    departmentName: 'Maintenance & Utilities',
    section: '27',
    activityDescription: 'Compressed Air Line Ultrasonic Leak Detector',
    requestedAmount: 310000,
    timeline: 'Jan-Mar',
    quartersActive: { q1: false, q2: false, q3: false, q4: true },
    status: 'On Track',
    fiscalYear: 2026,
    classification: 'CAPEX',
    costCenter: 'CC-6020 - Energy Conservation',
    purpose: 'Acoustic imaging camera to localize compressed air loss and reduce kWh.',
    quarters: [],
    lineItems: [],
    updatedAt: '2026-03-24T10:00:00.000Z',
  },
]

export const initialExpenses = [
  {
    id: 'exp-001',
    date: '2026-04-05',
    description: 'Robotic Arm Servo Motor — Unit 1 of 4 (KUKA 6-Axis)',
    departmentId: 'dept-production',
    departmentName: 'Production (Assembly Line)',
    category: 'CAPEX',
    budgetCodeRef: '1806016',
    amount: 550000,
    vendor: 'KUKA Robotics India Pvt Ltd',
    invoiceNo: 'INV-KR-2026-0045',
    status: 'Approved',
    approvedBy: 'Rohit Sharma',
    remarks: 'First servo motor delivery — QC verified',
    createdAt: '2026-04-05T09:15:00.000Z',
    updatedAt: '2026-04-05T09:15:00.000Z',
  },
  {
    id: 'exp-002',
    date: '2026-04-10',
    description: 'EtherCAT PLC Controller Wiring — Lot 1',
    departmentId: 'dept-production',
    departmentName: 'Production (Assembly Line)',
    category: 'CAPEX',
    budgetCodeRef: '1806016',
    amount: 725000,
    vendor: 'Omron Automation India',
    invoiceNo: 'INV-OM-2026-1122',
    status: 'Approved',
    approvedBy: 'Rohit Sharma',
    remarks: 'Optical bus + terminal nodes. Installed in Track #2.',
    createdAt: '2026-04-10T11:00:00.000Z',
    updatedAt: '2026-04-10T11:00:00.000Z',
  },
  {
    id: 'exp-003',
    date: '2026-04-18',
    description: 'Skill Festival Demonstration Tooling',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    category: 'OPEX',
    budgetCodeRef: '1806090',
    amount: 600000,
    vendor: 'Bharat Press Tools Pvt Ltd',
    invoiceNo: 'INV-BPT-2026-0388',
    status: 'Approved',
    approvedBy: 'Meena Kulkarni',
    remarks: 'Festive demonstration press tooling set — 1 of 1',
    createdAt: '2026-04-18T10:30:00.000Z',
    updatedAt: '2026-04-18T10:30:00.000Z',
  },
  {
    id: 'exp-004',
    date: '2026-04-20',
    description: 'High-Res Industrial Vision Camera (2 units)',
    departmentId: 'dept-weld',
    departmentName: 'Weld Shop',
    category: 'CAPEX',
    budgetCodeRef: '1806091',
    amount: 500000,
    vendor: 'Cognex Vision Systems India',
    invoiceNo: 'INV-COG-2026-0201',
    status: 'Approved',
    approvedBy: 'Rohit Sharma',
    remarks: 'Spot weld vision system cameras — installed and calibrated',
    createdAt: '2026-04-20T14:00:00.000Z',
    updatedAt: '2026-04-20T14:00:00.000Z',
  },
  {
    id: 'exp-005',
    date: '2026-04-25',
    description: 'Vendor Integration & Safety Testing',
    departmentId: 'dept-production',
    departmentName: 'Production (Assembly Line)',
    category: 'CAPEX',
    budgetCodeRef: '1806016',
    amount: 425000,
    vendor: 'SysIntegro Solutions LLP',
    invoiceNo: 'INV-SI-2026-0044',
    status: 'Pending',
    approvedBy: '',
    remarks: 'On-site deployment; safety cage interlock certification pending',
    createdAt: '2026-04-25T16:20:00.000Z',
    updatedAt: '2026-04-25T16:20:00.000Z',
  },
  {
    id: 'exp-006',
    date: '2026-05-02',
    description: 'CMM Sapphire Ruby Styli & Calibration Sphere',
    departmentId: 'dept-quality',
    departmentName: 'Quality Assurance',
    category: 'CAPEX',
    budgetCodeRef: '1806020',
    amount: 850000,
    vendor: 'Hexagon Metrology India',
    invoiceNo: 'INV-HX-2026-0099',
    status: 'Approved',
    approvedBy: 'Divya Nair',
    remarks: 'Full CMM styli set delivered to Metrology Lab CC-5010',
    createdAt: '2026-05-02T09:45:00.000Z',
    updatedAt: '2026-05-02T09:45:00.000Z',
  },
  {
    id: 'exp-007',
    date: '2026-05-10',
    description: 'Evaluation Kits & Safety Gear (40 kits)',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    category: 'OPEX',
    budgetCodeRef: '1806090',
    amount: 400000,
    vendor: 'SafeWorks India',
    invoiceNo: 'INV-SW-2026-0173',
    status: 'Approved',
    approvedBy: 'Meena Kulkarni',
    remarks: 'PPE and evaluation kits for Skill Festival participants',
    createdAt: '2026-05-10T11:15:00.000Z',
    updatedAt: '2026-05-10T11:15:00.000Z',
  },
  {
    id: 'exp-008',
    date: '2026-05-18',
    description: 'Nitrogen Gas Recharge Rig — Mobile Manifold',
    departmentId: 'dept-press',
    departmentName: 'Press Shop',
    category: 'CAPEX',
    budgetCodeRef: '1806025',
    amount: 280000,
    vendor: 'PressureTech Instruments',
    invoiceNo: 'INV-PT-2026-0055',
    status: 'Approved',
    approvedBy: 'Rohit Sharma',
    remarks: 'High-pressure N2 manifold for CC-1022 die cushion system',
    createdAt: '2026-05-18T13:30:00.000Z',
    updatedAt: '2026-05-18T13:30:00.000Z',
  },
  {
    id: 'exp-009',
    date: '2026-06-05',
    description: 'Booth Chimney Cleaning & HEPA Filter Replacement',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    category: 'OPEX',
    budgetCodeRef: '1806095',
    amount: 20000,
    vendor: 'AirClean Services Bangalore',
    invoiceNo: 'INV-AC-2026-0215',
    status: 'Approved',
    approvedBy: 'Divya Nair',
    remarks: 'Primary and secondary HEPA overhaul — completed in Q1',
    createdAt: '2026-06-05T08:00:00.000Z',
    updatedAt: '2026-06-05T08:00:00.000Z',
  },
  {
    id: 'exp-010',
    date: '2026-06-20',
    description: 'AGV Induction Charging Plate Maintenance (partial)',
    departmentId: 'dept-assy',
    departmentName: 'Assembly (Production)',
    category: 'OPEX',
    budgetCodeRef: '1806019',
    amount: 160000,
    vendor: 'FlexMov Automation Ltd',
    invoiceNo: 'INV-FM-2026-0310',
    status: 'Pending',
    approvedBy: '',
    remarks: '50% advance released; remaining on delivery of second charge strip',
    createdAt: '2026-06-20T15:10:00.000Z',
    updatedAt: '2026-06-20T15:10:00.000Z',
  },
  {
    id: 'exp-011',
    date: '2026-07-02',
    description: 'Electrostatic Rotary Bell Spray Guns (2 units)',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    category: 'CAPEX',
    budgetCodeRef: '1806096',
    amount: 200000,
    vendor: 'Graco India Pvt Ltd',
    invoiceNo: 'INV-GR-2026-0401',
    status: 'Approved',
    approvedBy: 'Rohit Sharma',
    remarks: 'Bell atomizer set installed in clearcoat booth — tested OK',
    createdAt: '2026-07-02T10:00:00.000Z',
    updatedAt: '2026-07-02T10:00:00.000Z',
  },
  {
    id: 'exp-012',
    date: '2026-07-15',
    description: 'Chiller Plant VFD Compressor Bearing Overhaul',
    departmentId: 'dept-maintenance',
    departmentName: 'Maintenance & Utilities',
    category: 'OPEX',
    budgetCodeRef: '1806021',
    amount: 1200000,
    vendor: 'Carrier Engineering India',
    invoiceNo: 'INV-CE-2026-0512',
    status: 'Approved',
    approvedBy: 'Rohit Sharma',
    remarks: 'Central chiller unit — ceramic spindle bearing full replacement done',
    createdAt: '2026-07-15T14:00:00.000Z',
    updatedAt: '2026-07-15T14:00:00.000Z',
  },
  {
    id: 'exp-013',
    date: '2026-07-28',
    description: 'Ultrasonic Spot Weld Thickness Gauge',
    departmentId: 'dept-quality',
    departmentName: 'Quality Assurance',
    category: 'CAPEX',
    budgetCodeRef: '1806027',
    amount: 490000,
    vendor: 'Olympus NDT India',
    invoiceNo: 'INV-OL-2026-0620',
    status: 'Approved',
    approvedBy: 'Divya Nair',
    remarks: 'Phased-array UT transducer for non-destructive weld audit',
    createdAt: '2026-07-28T11:30:00.000Z',
    updatedAt: '2026-07-28T11:30:00.000Z',
  },
  {
    id: 'exp-014',
    date: '2026-08-05',
    description: 'FST & EWT Paint Material — Trial Batch',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    category: 'OPEX',
    budgetCodeRef: '1806097',
    amount: 100000,
    vendor: 'Nippon Paint Industrial India',
    invoiceNo: 'INV-NP-2026-0708',
    status: 'Approved',
    approvedBy: 'Divya Nair',
    remarks: 'Environmental chamber trial run paints — all lots received',
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-05T09:00:00.000Z',
  },
  {
    id: 'exp-015',
    date: '2026-08-20',
    description: 'ED Bath Anode Membrane Replacement',
    departmentId: 'dept-paint',
    departmentName: 'Paint Shop (Coating & Sealing)',
    category: 'CAPEX',
    budgetCodeRef: '1806023',
    amount: 920000,
    vendor: 'Ionics Membrane Technologies',
    invoiceNo: 'INV-IM-2026-0815',
    status: 'Pending',
    approvedBy: '',
    remarks: 'Tubular dialyzer membranes — awaiting sign-off from QA head',
    createdAt: '2026-08-20T16:45:00.000Z',
    updatedAt: '2026-08-20T16:45:00.000Z',
  },
]

function read(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('Failed to write to localStorage', err)
  }
}

export function getBudgets() {
  if (typeof window === 'undefined') return initialBudgetActivityPlans
  if (window.localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION) {
    write(BUDGETS_KEY, initialBudgetActivityPlans)
    write(DEPARTMENTS_KEY, initialDepartments)
    write(EXPENSES_KEY, initialExpenses)
    write(PROJECTS_KEY, initialProjects)
    window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION)
  }
  return read(BUDGETS_KEY, initialBudgetActivityPlans)
}

export function getProjects() {
  if (typeof window === 'undefined') return initialProjects
  getBudgets() // ensure seeding
  return read(PROJECTS_KEY, initialProjects)
}

export function getExpenses() {
  if (typeof window === 'undefined') return initialExpenses
  getBudgets() // ensure seeding runs first
  return read(EXPENSES_KEY, initialExpenses)
}

export function getDepartments() {
  if (typeof window === 'undefined') return initialDepartments
  return read(DEPARTMENTS_KEY, initialDepartments)
}

export async function listBudgets(fiscalYear, departmentId) {
  const all = getBudgets()
  return all
    .filter((b) => (!fiscalYear || b.fiscalYear === Number(fiscalYear)) && (!departmentId || b.departmentId === departmentId))
}

export async function getBudget(id) {
  const budget = getBudgets().find((item) => item.id === id || item.budgetCode === id)
  if (!budget) throw new Error('Budget plan was not found.')
  return budget
}

export async function saveBudget(input, id) {
  const current = getBudgets()
  const now = new Date().toISOString()
  const index = id ? current.findIndex((b) => b.id === id || b.budgetCode === id) : -1
  
  const saved = {
    ...input,
    id: id || input.id || `plan-${input.budgetCode || Date.now()}`,
    budgetCode: input.budgetCode || (1806000 + Math.floor(Math.random() * 999)).toString(),
    createdAt: index >= 0 ? current[index].createdAt : now,
    updatedAt: now,
  }

  if (index >= 0) {
    current[index] = saved
  } else {
    current.unshift(saved)
  }
  write(BUDGETS_KEY, current)
  return saved.id
}

export async function deleteBudget(id) {
  write(BUDGETS_KEY, getBudgets().filter((b) => b.id !== id && b.budgetCode !== id))
}

export async function updateBudgetStatus(id, status) {
  const current = getBudgets()
  const budget = current.find((b) => b.id === id || b.budgetCode === id)
  if (!budget) throw new Error('Budget plan was not found.')
  budget.status = status
  budget.updatedAt = new Date().toISOString()
  write(BUDGETS_KEY, current)
}

export async function bulkApproveBudgets(ids) {
  const current = getBudgets()
  current.forEach((b) => {
    if (!ids || ids.includes(b.id) || ids.includes(b.budgetCode)) {
      b.status = 'Approved'
      b.updatedAt = new Date().toISOString()
    }
  })
  write(BUDGETS_KEY, current)
}

export async function listDepartments(includeInactive = false) {
  const all = getDepartments()
  return (includeInactive ? all : all.filter((d) => d.active)).sort((a, b) => a.name.localeCompare(b.name))
}

export async function saveDepartment(input, id) {
  const current = getDepartments()
  const now = new Date().toISOString()
  const resolvedId = id || input.id || `dept-${Date.now()}`
  const index = id ? current.findIndex((d) => d.id === id) : -1
  const saved = {
    active: true,
    ...input,
    id: resolvedId,
    createdAt: index >= 0 ? current[index].createdAt : now,
    updatedAt: now,
  }
  if (index >= 0) {
    current[index] = saved
  } else {
    current.push(saved)
  }
  write(DEPARTMENTS_KEY, current)
  return resolvedId
}

export async function deleteDepartment(id) {
  // Soft delete — mark inactive
  const current = getDepartments()
  const dept = current.find((d) => d.id === id)
  if (dept) {
    dept.active = false
    dept.updatedAt = new Date().toISOString()
    write(DEPARTMENTS_KEY, current)
  }
}

export async function listProjects(filters = {}) {
  const all = getProjects()
  return all.filter((p) => {
    if (filters.departmentId && p.departmentId !== filters.departmentId) return false
    if (filters.status && p.status !== filters.status) return false
    if (filters.priority && p.priority !== filters.priority) return false
    return true
  })
}

export async function saveProject(input, id) {
  const current = getProjects()
  const now = new Date().toISOString()
  const resolvedId = id || input.id || `proj-${Date.now()}`
  const nextNum = current.length + 1
  const index = id ? current.findIndex((p) => p.id === id) : -1
  const saved = {
    milestones: 0,
    completedMilestones: 0,
    spent: 0,
    tags: [],
    ...input,
    id: resolvedId,
    code: input.code || `PRJ-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`,
    createdAt: index >= 0 ? current[index].createdAt : now,
    updatedAt: now,
  }
  if (index >= 0) {
    current[index] = saved
  } else {
    current.unshift(saved)
  }
  write(PROJECTS_KEY, current)
  return resolvedId
}

export async function deleteProject(id) {
  write(PROJECTS_KEY, getProjects().filter((p) => p.id !== id))
}

export async function updateProjectStatus(id, status) {
  const current = getProjects()
  const project = current.find((p) => p.id === id)
  if (!project) throw new Error('Project not found.')
  project.status = status
  project.updatedAt = new Date().toISOString()
  write(PROJECTS_KEY, current)
}

export async function listExpenses(filters = {}) {
  const all = getExpenses()
  return all.filter((e) => {
    if (filters.departmentId && e.departmentId !== filters.departmentId) return false
    if (filters.category && e.category !== filters.category) return false
    if (filters.status && e.status !== filters.status) return false
    return true
  })
}

export async function saveExpense(input, id) {
  const current = getExpenses()
  const now = new Date().toISOString()
  const resolvedId = id || input.id || `exp-${Date.now()}`
  const index = id ? current.findIndex((e) => e.id === id) : -1
  const saved = {
    ...input,
    id: resolvedId,
    createdAt: index >= 0 ? current[index].createdAt : now,
    updatedAt: now,
  }
  if (index >= 0) {
    current[index] = saved
  } else {
    current.unshift(saved)
  }
  write(EXPENSES_KEY, current)
  return resolvedId
}

export async function deleteExpense(id) {
  write(EXPENSES_KEY, getExpenses().filter((e) => e.id !== id))
}

export async function updateExpenseStatus(id, status) {
  const current = getExpenses()
  const expense = current.find((e) => e.id === id)
  if (!expense) throw new Error('Expense not found.')
  expense.status = status
  expense.updatedAt = new Date().toISOString()
  write(EXPENSES_KEY, current)
}

export function getExpenseSummary() {
  const all = getExpenses()
  const total = all.reduce((sum, e) => sum + (e.amount || 0), 0)
  const approved = all.filter((e) => e.status === 'Approved').reduce((s, e) => s + e.amount, 0)
  const pending = all.filter((e) => e.status === 'Pending').reduce((s, e) => s + e.amount, 0)
  const capex = all.filter((e) => e.category === 'CAPEX').reduce((s, e) => s + e.amount, 0)
  const opex = all.filter((e) => e.category === 'OPEX').reduce((s, e) => s + e.amount, 0)
  const thisMonth = (() => {
    const now = new Date()
    return all
      .filter((e) => {
        const d = new Date(e.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((s, e) => s + e.amount, 0)
  })()
  return { total, approved, pending, capex, opex, thisMonth, count: all.length }
}

export async function uploadBudgetDocument(file, uid, budgetId) {
  return {
    name: file.name,
    path: `local-budget-documents/${uid}/${budgetId}/${file.name}`,
    url: URL.createObjectURL(file),
    contentType: file.type,
    size: file.size,
    sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }
}

// -------------------------------------------------------------------------
// APPROVALS — unified queue across budget plans and expenses
// -------------------------------------------------------------------------

/**
 * Returns a unified list of items awaiting approval.
 * type: 'budget' | 'expense'
 * pendingStatuses for budgets: On Track | Pending Review | On Hold
 * pendingStatuses for expenses: Pending
 */
export function listApprovalItems(typeFilter) {
  const PENDING_BUDGET_STATUSES = ['On Track', 'Pending Review', 'On Hold']
  const now = new Date().toISOString()

  const budgetItems = getBudgets()
    .filter((b) => PENDING_BUDGET_STATUSES.includes(b.status))
    .map((b) => ({
      id: b.id,
      type: 'budget',
      refCode: b.budgetCode,
      title: b.activityDescription,
      subtitle: b.activityHead ? `${b.activityHead} — ${b.departmentName}` : b.departmentName,
      departmentId: b.departmentId,
      departmentName: b.departmentName,
      amount: b.requestedAmount || 0,
      classification: b.classification || '',
      status: b.status,
      costCenter: b.costCenter || '',
      timeline: b.timeline || '',
      fiscalYear: b.fiscalYear,
      submittedAt: b.updatedAt || now,
      submittedBy: b.preparedBy || 'Department Head',
      purpose: b.purpose || '',
    }))

  const expenseItems = getExpenses()
    .filter((e) => e.status === 'Pending')
    .map((e) => ({
      id: e.id,
      type: 'expense',
      refCode: e.invoiceNo || e.id,
      title: e.description,
      subtitle: e.departmentName,
      departmentId: e.departmentId,
      departmentName: e.departmentName,
      amount: e.amount || 0,
      classification: e.category || '',
      status: e.status,
      costCenter: e.budgetCodeRef || '',
      timeline: e.date,
      fiscalYear: new Date(e.date || now).getFullYear(),
      submittedAt: e.createdAt || now,
      submittedBy: e.vendor || 'Vendor',
      purpose: e.remarks || '',
    }))

  const all = [...budgetItems, ...expenseItems].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  )

  if (!typeFilter || typeFilter === 'all') return all
  return all.filter((item) => item.type === typeFilter)
}

/**
 * Approve or reject a batch of items (mixed budget plans and expenses).
 * action: 'Approved' | 'Rejected'
 * ids: array of item ids
 * approverName: string
 */
export async function batchApproveItems(ids, action, approverName = 'Finance Manager') {
  const now = new Date().toISOString()

  // Separate into budget vs expense ids
  const budgets = getBudgets()
  const expenses = getExpenses()
  let budgetsChanged = false
  let expensesChanged = false

  ids.forEach((id) => {
    const b = budgets.find((x) => x.id === id)
    if (b) {
      b.status = action
      b.updatedAt = now
      if (action === 'Approved') b.approvedBy = approverName
      budgetsChanged = true
      return
    }
    const e = expenses.find((x) => x.id === id)
    if (e) {
      e.status = action
      e.updatedAt = now
      if (action === 'Approved') e.approvedBy = approverName
      expensesChanged = true
    }
  })

  if (budgetsChanged) write(BUDGETS_KEY, budgets)
  if (expensesChanged) write(EXPENSES_KEY, expenses)
}

/**
 * Returns counts for the approvals dashboard summary cards.
 */
export function getApprovalSummary() {
  const all = listApprovalItems('all')
  const budgets = all.filter((i) => i.type === 'budget')
  const expenses = all.filter((i) => i.type === 'expense')
  const totalAmount = all.reduce((s, i) => s + i.amount, 0)
  const highPriority = budgets.filter((i) => ['On Hold', 'Pending Review'].includes(i.status)).length

  // Historical — approved in this fiscal year
  const approvedBudgets = getBudgets().filter((b) => b.status === 'Approved' && b.fiscalYear === 2026).length
  const approvedExpenses = getExpenses().filter((e) => e.status === 'Approved').length

  return {
    pendingTotal: all.length,
    pendingBudgets: budgets.length,
    pendingExpenses: expenses.length,
    pendingAmount: totalAmount,
    highPriority,
    approvedTotal: approvedBudgets + approvedExpenses,
  }
}



const NOTIFICATIONS_KEY = 'gurukul-notifications'

export const initialNotifications = [
  {
    id: 'notif-001',
    type: 'approval_required',
    title: 'Budget Plan Awaiting Your Approval',
    message: 'Paint Shop (Coating & Sealing) submitted a budget plan for "Spray Gun procurement" (PRJ-1806096) requesting ₹2,00,000.',
    read: false,
    priority: 'high',
    action: 'Review Now',
    actionLink: '/approvals',
    timestamp: '2026-09-23T14:30:00.000Z',
    icon: 'CheckCircle2',
  },
  {
    id: 'notif-002',
    type: 'expense_pending',
    title: 'Expense Request Submitted',
    message: 'Assembly (Production) submitted an expense request for "Vendor Integration & Safety Testing" (₹4,25,000).',
    read: false,
    priority: 'medium',
    action: 'Review',
    actionLink: '/approvals',
    timestamp: '2026-09-23T13:15:00.000Z',
    icon: 'AlertCircle',
  },
  {
    id: 'notif-003',
    type: 'approval_approved',
    title: 'Budget Plan Approved',
    message: 'Your budget plan "CMM Calibration Artifact & Styli Upgrade" has been approved by Finance Manager.',
    read: true,
    priority: 'low',
    timestamp: '2026-09-22T10:45:00.000Z',
    icon: 'CheckCircle2',
  },
  {
    id: 'notif-004',
    type: 'deadline_approaching',
    title: 'Budget Plan Deadline Approaching',
    message: 'Your budget plan "Compressed Air Line Ultrasonic Leak Detector" will expire in 2 days. Submit for approval now.',
    read: true,
    priority: 'high',
    action: 'Submit for Approval',
    timestamp: '2026-09-22T08:20:00.000Z',
    icon: 'AlertTriangle',
  },
  {
    id: 'notif-005',
    type: 'project_update',
    title: 'Project Status Update',
    message: 'Project "FY27 Assembly Line Automation Upgrade" reached 40% completion. Current spend: ₹17,00,000 of ₹45,00,000.',
    read: true,
    priority: 'low',
    timestamp: '2026-09-21T16:00:00.000Z',
    icon: 'TrendingUp',
  },
  {
    id: 'notif-006',
    type: 'department_alert',
    title: 'Department Budget Alert',
    message: 'Press Shop has used 85% of its annual budget allocation (₹29,75,000 of ₹35,00,000).',
    read: true,
    priority: 'high',
    timestamp: '2026-09-20T12:00:00.000Z',
    icon: 'AlertTriangle',
  },
]

export function getNotifications() {
  if (typeof window === 'undefined') return initialNotifications
  if (window.localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION) {
    write(NOTIFICATIONS_KEY, initialNotifications)
  }
  return read(NOTIFICATIONS_KEY, initialNotifications)
}

export async function markNotificationAsRead(id) {
  const notifications = getNotifications()
  const notif = notifications.find((n) => n.id === id)
  if (notif) {
    notif.read = true
    write(NOTIFICATIONS_KEY, notifications)
  }
}

export async function markAllNotificationsAsRead() {
  const notifications = getNotifications()
  notifications.forEach((n) => { n.read = true })
  write(NOTIFICATIONS_KEY, notifications)
}

export async function deleteNotification(id) {
  write(NOTIFICATIONS_KEY, getNotifications().filter((n) => n.id !== id))
}

export function getUnreadCount() {
  return getNotifications().filter((n) => !n.read).length
}
