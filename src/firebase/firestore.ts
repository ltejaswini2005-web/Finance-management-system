import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where, type DocumentData, type QuerySnapshot } from 'firebase/firestore'
import { db } from './config'
import type { BudgetDocument, Department, Expense } from '../types/domain'

function requireDb() {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to .env.local.')
  return db
}
function records<T>(snapshot: QuerySnapshot<DocumentData>) { return snapshot.docs.map((item) => ({ ...(item.data() as T), id: item.id })) }

export async function listBudgets(fiscalYear?: number, departmentId?: string) {
  const constraints = []
  if (fiscalYear) constraints.push(where('fiscalYear', '==', fiscalYear))
  if (departmentId) constraints.push(where('departmentId', '==', departmentId))
  constraints.push(orderBy('updatedAt', 'desc'))
  const snapshot = await getDocs(query(collection(requireDb(), 'budgets'), ...constraints))
  return records<BudgetDocument>(snapshot)
}

export async function getBudget(id: string) {
  const snapshot = await getDocs(query(collection(requireDb(), 'budgets'), where('__name__', '==', id)))
  const found = records<BudgetDocument>(snapshot)[0]
  if (!found) throw new Error('Budget plan was not found.')
  return found
}

export async function saveBudget(input: Omit<BudgetDocument, 'id' | 'createdAt' | 'updatedAt'>, id?: string) {
  const firestore = requireDb()
  if (id) {
    await updateDoc(doc(firestore, 'budgets', id), { ...input, updatedAt: serverTimestamp() })
    return id
  }
  const created = await addDoc(collection(firestore, 'budgets'), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return created.id
}

export async function deleteBudget(id: string) { await deleteDoc(doc(requireDb(), 'budgets', id)) }
export async function updateBudgetStatus(id: string, status: BudgetDocument['status']) { await updateDoc(doc(requireDb(), 'budgets', id), { status, updatedAt: serverTimestamp() }) }

export async function listDepartments() {
  const snapshot = await getDocs(query(collection(requireDb(), 'departments'), where('active', '==', true), orderBy('name')))
  return records<Department>(snapshot)
}

export async function listExpenses(departmentId?: string) {
  const constraints = departmentId ? [where('departmentId', '==', departmentId), orderBy('createdAt', 'desc')] : [orderBy('createdAt', 'desc')]
  const snapshot = await getDocs(query(collection(requireDb(), 'expenses'), ...constraints))
  return records<Expense>(snapshot)
}

export async function createExpense(input: Omit<Expense, 'id' | 'createdAt'>) {
  const created = await addDoc(collection(requireDb(), 'expenses'), { ...input, createdAt: serverTimestamp() })
  return created.id
}
