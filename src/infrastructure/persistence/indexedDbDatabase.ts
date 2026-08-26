import type { PersistenceDatabase } from '../../application/ports/persistence'

export const databaseName = 'academic-os'
export const databaseVersion = 2

export const academicStores = [
  'studentProfiles',
  'academicPrograms',
  'academicYears',
  'semesters',
  'subjects',
  'enrollments',
  'grades',
] as const

export type AcademicStoreName = (typeof academicStores)[number]

export class IndexedDbDatabase implements PersistenceDatabase {
  private connection?: IDBDatabase

  open(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        resolve()
        return
      }

      const request = indexedDB.open(databaseName, databaseVersion)

      request.onerror = () => reject(request.error)
      request.onupgradeneeded = () => {
        const database = request.result
        for (const storeName of academicStores) {
          if (!database.objectStoreNames.contains(storeName)) {
            const store = database.createObjectStore(storeName, {
              keyPath: 'id',
            })
            if (storeName === 'semesters')
              store.createIndex('academicYearId', 'academicYearId')
            if (storeName === 'subjects')
              store.createIndex('academicProgramId', 'academicProgramId')
            if (storeName === 'enrollments') {
              store.createIndex('subjectId', 'subjectId')
              store.createIndex('semesterId', 'semesterId')
            }
            if (storeName === 'grades')
              store.createIndex('enrollmentId', 'enrollmentId')
          }
        }
      }
      request.onsuccess = () => {
        this.connection = request.result
        this.connection.onversionchange = () => this.close()
        resolve()
      }
    })
  }

  async get<T>(
    storeName: AcademicStoreName,
    id: string,
  ): Promise<T | undefined> {
    await this.open()
    return this.request<T | undefined>(storeName, 'readonly', (store) =>
      store.get(id),
    )
  }

  async list<T>(storeName: AcademicStoreName): Promise<T[]> {
    await this.open()
    return this.request<T[]>(storeName, 'readonly', (store) => store.getAll())
  }

  async save<T extends { id: string }>(
    storeName: AcademicStoreName,
    value: T,
  ): Promise<void> {
    await this.open()
    await this.request<IDBValidKey>(storeName, 'readwrite', (store) =>
      store.put(value),
    )
  }

  close(): void {
    this.connection?.close()
    this.connection = undefined
  }

  private request<T>(
    storeName: AcademicStoreName,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    if (!this.connection)
      return Promise.reject(new Error('Database is not open'))

    return new Promise((resolve, reject) => {
      const transaction = this.connection!.transaction(storeName, mode)
      const request = operation(transaction.objectStore(storeName))
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      transaction.onerror = () => reject(transaction.error)
    })
  }
}
