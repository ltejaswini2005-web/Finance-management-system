import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { firebaseApp } from './config'

const storage = firebaseApp ? getStorage(firebaseApp) : null

export async function uploadBudgetDocument(file: File, uid: string, budgetId: string) {
  if (!storage) throw new Error('Firebase Storage is not configured.')
  const path = `budget-documents/${uid}/${budgetId}/${file.name}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file, { contentType: file.type })
  return { name: file.name, path, url: await getDownloadURL(fileRef), contentType: file.type, size: file.size }
}
