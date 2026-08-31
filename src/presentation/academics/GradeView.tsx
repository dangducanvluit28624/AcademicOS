import { useState, type FormEvent } from 'react'
import type { Grade, Enrollment } from '../../domain'
import { convertCourseScore } from '../../domain'
import type { AcademicService } from '../../application'
import type { GradeConversion } from '../../domain'

export interface GradeViewProps {
  grades: Grade[]
  enrollments: Enrollment[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function GradeView({
  grades,
  enrollments,
  academicService,
  onReload,
}: GradeViewProps) {
  const [grade, setGrade] = useState<Grade>({
    id: '',
    enrollmentId: '',
    value: '',
    finalized: false,
  })
  const [message, setMessage] = useState('')

  const score = grade.originalScore
  let conversion: GradeConversion | undefined
  let conversionError = ''
  if (score !== undefined) {
    try {
      conversion = convertCourseScore(score)
    } catch (error) {
      conversionError = error instanceof Error ? error.message : 'Invalid score'
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      if (grade.originalScore === undefined || !conversion)
        throw new Error('Enter a course score')
      await academicService.saveGrade({
        ...grade,
        id: grade.id || id(),
        value: String(grade.originalScore),
        letterGrade: conversion.letterGrade,
        fourPointValue: conversion.fourPointValue,
      })
      await onReload()
      setMessage('Grade saved successfully')
      setGrade({ id: '', enrollmentId: '', value: '', finalized: false })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save grade',
      )
    }
  }

  async function handleDelete(gradeId: string) {
    try {
      await academicService.deleteGrade(gradeId)
      await onReload()
      setMessage('Grade deleted successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete grade',
      )
    }
  }

  return (
    <div>
      <h3>Grades</h3>
      <form
        onSubmit={(e) => void handleSave(e)}
        style={{ marginBottom: '24px' }}
      >
        <select
          aria-label="Grade enrollment"
          value={grade.enrollmentId}
          onChange={(e) =>
            setGrade({ ...grade, id: '', enrollmentId: e.target.value })
          }
          required
        >
          <option value="">Select enrollment</option>
          {enrollments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id}
            </option>
          ))}
        </select>
        <select
          aria-label="Existing grade"
          value={grade.id}
          onChange={(e) => {
            const selected = grades.find((item) => item.id === e.target.value)
            if (selected) setGrade(selected)
            else
              setGrade({
                id: '',
                enrollmentId: grade.enrollmentId,
                value: '',
                finalized: false,
              })
          }}
          style={{ marginLeft: '8px' }}
        >
          <option value="">New grade</option>
          {grades.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} ({item.letterGrade ?? 'ungraded'})
            </option>
          ))}
        </select>
        <input
          aria-label="Course score"
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Score / 10"
          value={grade.originalScore ?? ''}
          onChange={(e) =>
            setGrade({
              ...grade,
              originalScore: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
          required
          style={{ marginLeft: '8px' }}
        />
        <label style={{ marginLeft: '8px' }}>
          Finalized
          <input
            aria-label="Grade finalized"
            type="checkbox"
            checked={grade.finalized}
            onChange={(e) =>
              setGrade({ ...grade, finalized: e.target.checked })
            }
            style={{ marginLeft: '4px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '8px' }}>
          Save Grade
        </button>
        {conversion && (
          <output style={{ marginLeft: '8px' }}>
            {conversion.letterGrade} / {conversion.fourPointValue.toFixed(1)}
          </output>
        )}
        {conversionError && (
          <span role="alert" style={{ marginLeft: '8px', color: 'red' }}>
            {conversionError}
          </span>
        )}
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>

      {grades.length > 0 && (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Enrollment</th>
              <th>Value</th>
              <th>Letter</th>
              <th>Finalized</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id}>
                <td>{g.enrollmentId}</td>
                <td>{g.value}</td>
                <td>{g.letterGrade}</td>
                <td>{g.finalized ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => setGrade(g)}>Edit</button>
                  <button
                    onClick={() => void handleDelete(g.id)}
                    style={{ marginLeft: '8px', color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
