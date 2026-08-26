import { describe, expect, it } from 'vitest'
import {
  calculateCreditProgress,
  calculateCumulativeGpa,
  calculateSemesterGpa,
  calculateTrends,
  type AcademicRecord,
} from '../../src/domain'

const subject = (id: string, credits: number) => ({ id, name: id, credits })
const semester = (id: string, startDate?: string) => ({
  id,
  academicYearId: 'year-1',
  name: id,
  status: 'completed' as const,
  startDate,
})
const record = (
  id: string,
  subjectId: string,
  semesterId: string,
  fourPointValue: number,
  letterGrade = 'A',
): AcademicRecord => ({
  enrollment: { id, subjectId, semesterId, status: 'completed' },
  subject: subject(subjectId, 3),
  semester: semester(semesterId),
  grades: [
    {
      id: `grade-${id}`,
      enrollmentId: id,
      value: letterGrade,
      fourPointValue,
      letterGrade,
      finalized: true,
    },
  ],
})

describe('M3 analytics', () => {
  it('calculates a credit-weighted semester GPA without intermediate rounding', () => {
    const records = [
      { ...record('one', 'one', 'fall', 4), subject: subject('one', 1) },
      { ...record('two', 'two', 'fall', 3), subject: subject('two', 3) },
    ]
    const result = calculateSemesterGpa(records, 'fall')
    expect(result.value).toBe(3.25)
    expect(result.weightedPoints).toBe(13)
    expect(result.credits).toBe(4)
  })

  it('marks missing or unfinalized grades incomplete instead of treating them as zero', () => {
    const missing = { ...record('missing', 'missing', 'fall', 4), grades: [] }
    const unfinalized = {
      ...record('open', 'open', 'fall', 4),
      grades: [
        { ...record('open', 'open', 'fall', 4).grades[0], finalized: false },
      ],
    }
    expect(calculateSemesterGpa([missing, unfinalized], 'fall')).toMatchObject({
      status: 'Incomplete',
      value: undefined,
      missingGradeEnrollmentIds: ['missing', 'open'],
    })
  })

  it('includes failed grades in GPA and attempted credits, but not completed credits', () => {
    const failed = record('failed', 'failed', 'fall', 0, 'F')
    expect(calculateSemesterGpa([failed], 'fall').value).toBe(0)
    expect(
      calculateCreditProgress([failed], {
        id: 'program',
        name: 'Program',
        totalRequiredCredits: 3,
      }),
    ).toEqual({
      status: 'Available',
      attemptedCredits: 3,
      completedCredits: 0,
      remainingCredits: 3,
      completionPercentage: 0,
    })
  })

  it('reports repeated subjects as incomplete and multiple grades as an integrity issue', () => {
    const first = record('first', 'same', 'fall', 4)
    const second = record('second', 'same', 'spring', 3)
    const duplicate = {
      ...record('duplicate', 'duplicate', 'fall', 4),
      grades: [
        ...record('duplicate', 'duplicate', 'fall', 4).grades,
        {
          ...record('duplicate', 'duplicate', 'fall', 4).grades[0],
          id: 'second-grade',
        },
      ],
    }
    expect(calculateCumulativeGpa([first, second]).status).toBe('Incomplete')
    expect(calculateCumulativeGpa([duplicate]).status).toBe(
      'Data integrity issue',
    )
    expect(calculateCumulativeGpa([second, duplicate]).status).toBe(
      'Data integrity issue',
    )
  })

  it('reports malformed finalized grades and credits as integrity issues', () => {
    const invalidGrade = {
      ...record('invalid', 'invalid', 'fall', 4),
      grades: [
        {
          ...record('invalid', 'invalid', 'fall', 4).grades[0],
          fourPointValue: Number.NaN,
        },
      ],
    }
    const invalidScore = {
      ...record('score', 'score', 'fall', 4),
      grades: [
        { ...record('score', 'score', 'fall', 4).grades[0], originalScore: 11 },
      ],
    }
    const invalidCredit = {
      ...record('credit', 'credit', 'fall', 4),
      subject: subject('credit', 0),
    }
    expect(calculateSemesterGpa([invalidGrade], 'fall').status).toBe(
      'Data integrity issue',
    )
    expect(calculateSemesterGpa([invalidScore], 'fall').status).toBe(
      'Data integrity issue',
    )
    expect(
      calculateCreditProgress([invalidCredit], {
        id: 'p',
        name: 'P',
        totalRequiredCredits: 3,
      }).status,
    ).toBe('Data integrity issue')
  })

  it('does not invent chronology for semesters with equal dates', () => {
    const first = semester('first', '2025-09-01')
    const second = semester('second', '2025-09-01')
    const records = [
      record('one', 'one', 'first', 4),
      record('two', 'two', 'second', 3),
    ]
    expect(calculateTrends(records, [first, second]).status).toBe('Unavailable')
    expect(calculateTrends(records, [second, first]).status).toBe('Unavailable')
  })

  it('orders trends by dates and accumulates completed credits', () => {
    const fall = semester('fall', '2025-09-01')
    const spring = semester('spring', '2026-02-01')
    const records = [
      record('one', 'one', 'fall', 4),
      record('two', 'two', 'spring', 3),
    ]
    expect(
      calculateTrends(records, [spring, fall]).points.map(
        (item) => item.semesterId,
      ),
    ).toEqual(['fall', 'spring'])
    expect(
      calculateTrends(records, [fall, spring]).points.map(
        (item) => item.accumulatedCompletedCredits,
      ),
    ).toEqual([3, 6])
    expect(calculateTrends(records, [semester('undated')]).status).toBe(
      'Unavailable',
    )
  })
})
