import type { PersistenceDatabase } from './ports/persistence'

export async function initializeApplication(
  database: PersistenceDatabase,
): Promise<void> {
  await database.open()
}
