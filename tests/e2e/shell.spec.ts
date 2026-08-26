import { expect, test } from '@playwright/test'

test('dashboard recalculates from persisted academic records', async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('m3-e2e-seeded') === 'true') return
    const request = indexedDB.open('academic-os', 3)
    request.onupgradeneeded = () => {
      const database = request.result
      for (const storeName of [
        'studentProfiles',
        'academicPrograms',
        'academicYears',
        'semesters',
        'subjects',
        'enrollments',
        'grades',
      ]) {
        if (!database.objectStoreNames.contains(storeName)) {
          const store = database.createObjectStore(storeName, {
            keyPath: 'id',
          })
          if (storeName === 'grades')
            store.createIndex('enrollmentId', 'enrollmentId')
        }
      }
    }
    request.onsuccess = () => {
      const database = request.result
      const transaction = database.transaction(
        [
          'studentProfiles',
          'academicPrograms',
          'academicYears',
          'semesters',
          'subjects',
          'enrollments',
          'grades',
        ],
        'readwrite',
      )
      transaction.objectStore('studentProfiles').put({
        id: 'profile',
        name: 'Test Student',
        overallGpa: 3.2,
      })
      transaction.objectStore('academicPrograms').put({
        id: 'program',
        name: 'Test Program',
        totalRequiredCredits: 6,
      })
      transaction
        .objectStore('academicYears')
        .put({ id: 'year', label: '2026' })
      transaction.objectStore('semesters').put({
        id: 'semester',
        academicYearId: 'year',
        name: 'Fall',
        startDate: '2026-09-01',
        status: 'completed',
      })
      transaction
        .objectStore('subjects')
        .put({ id: 'subject', name: 'Algorithms', credits: 3 })
      transaction.objectStore('enrollments').put({
        id: 'enrollment',
        subjectId: 'subject',
        semesterId: 'semester',
        status: 'completed',
      })
      transaction.objectStore('grades').put({
        id: 'grade',
        enrollmentId: 'enrollment',
        value: '8.0',
        originalScore: 8,
        letterGrade: 'B',
        fourPointValue: 3,
        finalized: true,
      })
      transaction.oncomplete = () => {
        database.close()
        localStorage.setItem('m3-e2e-seeded', 'true')
      }
    }
  })
  await page.goto('/')

  await expect(page.getByText('Official GPA: 3.2')).toBeVisible()
  await expect(page.getByText('Calculated GPA: 3.00')).toBeVisible()
  await expect(page.getByText(/Completion percentage: 50.00%/)).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Algorithms' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Fall' }).first()).toBeVisible()

  await page.getByLabel('Existing grade').selectOption('grade')
  await page.getByLabel('Course score').fill('10')
  await page.getByRole('button', { name: 'Save grade' }).click()

  await expect(page.getByText('Calculated GPA: 4.00')).toBeVisible()
  await expect(page.getByText('Official GPA: 3.2')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Calculated GPA: 4.00')).toBeVisible()
  await expect(page.getByText('Official GPA: 3.2')).toBeVisible()
})
