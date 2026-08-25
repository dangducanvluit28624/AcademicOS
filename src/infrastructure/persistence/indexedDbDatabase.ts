import type { PersistenceDatabase } from '../../application/ports/persistence'

const databaseName = 'academic-os'
const databaseVersion = 1

export class IndexedDbDatabase implements PersistenceDatabase {
  open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, databaseVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        request.result.close()
        resolve()
      }
    })
  }
}
