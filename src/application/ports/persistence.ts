export interface PersistenceDatabase {
  open(): Promise<void>
  replaceData(data: Record<string, unknown[]>): Promise<void>
}
