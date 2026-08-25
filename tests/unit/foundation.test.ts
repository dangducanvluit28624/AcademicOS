import { describe, expect, it } from 'vitest'
import type { PersistenceDatabase } from '../../src/application/ports/persistence'

describe('M0 foundation', () => {
  it('defines a persistence boundary independent of IndexedDB', () => {
    const database: PersistenceDatabase = { open: async () => undefined }

    expect(database.open).toBeTypeOf('function')
  })
})
