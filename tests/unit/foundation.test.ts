import { describe, expect, it } from 'vitest'
import { initializeApplication } from '../../src/application'
import { validateSubject } from '../../src/domain'
import type { PersistenceDatabase } from '../../src/application/ports/persistence'

describe('M0 foundation', () => {
  it('defines a persistence boundary independent of IndexedDB', () => {
    const database: PersistenceDatabase = { open: async () => undefined }

    expect(database.open).toBeTypeOf('function')
  })

  it('initializes through the application persistence port', async () => {
    let opened = false
    await initializeApplication({
      open: async () => {
        opened = true
      },
    })

    expect(opened).toBe(true)
  })

  it('rejects negative subject credits', () => {
    expect(() =>
      validateSubject({ id: 'subject-1', name: 'Algorithms', credits: -1 }),
    ).toThrow('Subject credits must be a non-negative number')
  })
})
