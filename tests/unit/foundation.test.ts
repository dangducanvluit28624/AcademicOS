import { describe, expect, it } from 'vitest'
import { initializeApplication } from '../../src/application'
import { convertCourseScore, validateSubject } from '../../src/domain'
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

  it.each([
    [10, 'A+', 4],
    [9, 'A', 4],
    [8.9, 'B+', 3.5],
    [8.5, 'B+', 3.5],
    [8.4, 'B', 3],
    [8, 'B', 3],
    [7.9, 'C+', 2.5],
    [7, 'C+', 2.5],
    [6.9, 'C', 2],
    [6.5, 'C', 2],
    [6.4, 'D+', 1.5],
    [6, 'D+', 1.5],
    [5.9, 'D', 1],
    [5, 'D', 1],
    [4.9, 'F', 0],
    [0, 'F', 0],
  ])(
    'converts course score %s to %s/%s',
    (score, letterGrade, fourPointValue) => {
      expect(convertCourseScore(score)).toEqual({ letterGrade, fourPointValue })
    },
  )

  it('rejects scores outside the supported 0.1-point scale', () => {
    expect(() => convertCourseScore(8.05)).toThrow(
      'Course score must be a value from 0.0 through 10.0 in 0.1 increments',
    )
    expect(() => convertCourseScore(10.1)).toThrow()
  })
})
