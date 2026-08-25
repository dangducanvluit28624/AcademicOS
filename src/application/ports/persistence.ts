export interface PersistenceDatabase {
  open(): Promise<void>
}
