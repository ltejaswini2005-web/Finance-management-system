export type UserRole = 'admin' | 'finance-manager' | 'department-manager' | 'viewer'
export type BudgetStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected'
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected'

export interface UserProfile { uid: string; displayName: string; email: string; role: UserRole; departmentId?: string }
export interface BudgetLineItem { description: string; category: string; quantity: string; unitRate: number; subtotal: number }
export interface BudgetQuarter { label: string; percentage: number; amount: number; milestone: string }
export interface BudgetDocument {
  id: string; departmentId: string; departmentName: string; title: string; costCenter: string
  classification: 'CAPEX' | 'OPEX'; requestedAmount: number; fiscalYear: number; purpose: string
  status: BudgetStatus; createdBy: string; createdByName: string; createdAt?: unknown; updatedAt?: unknown
  quarters: BudgetQuarter[]; lineItems: BudgetLineItem[]
  document?: { name: string; path: string; url: string; contentType: string; size: number }
}
export interface Department { id: string; name: string; managerUid?: string; active: boolean }
export interface Expense { id: string; description: string; departmentId: string; departmentName: string; amount: number; status: ExpenseStatus; submittedBy: string; createdAt: unknown }
