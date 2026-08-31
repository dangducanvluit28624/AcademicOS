import { expect, test } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

test('creates and restores a local backup deterministically', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Academic OS' })).toBeVisible()

  // 1. Initialize deterministic test database directly
  await page.evaluate(async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('academic-os', 5)
      request.onerror = () => reject(request.error)
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
            'tasks',
            'academicEvents',
          ],
          'readwrite',
        )

        transaction.objectStore('studentProfiles').put({
          id: 'student-profile',
          name: 'Backup Test Student',
          overallGpa: 3.8,
        })
        transaction.objectStore('academicPrograms').put({
          id: 'prog-1',
          name: 'Backup Program',
        })
        transaction.objectStore('academicYears').put({
          id: 'year-1',
          label: '2026',
        })
        transaction.objectStore('semesters').put({
          id: 'sem-1',
          academicYearId: 'year-1',
          name: 'Backup Semester',
          status: 'planned',
        })
        transaction.objectStore('subjects').put({
          id: 'sub-1',
          name: 'Backup Subject',
          credits: 4,
        })
        transaction.objectStore('enrollments').put({
          id: 'enr-1',
          subjectId: 'sub-1',
          semesterId: 'sem-1',
          status: 'completed',
        })
        transaction.objectStore('grades').put({
          id: 'grd-1',
          enrollmentId: 'enr-1',
          value: 'A',
          letterGrade: 'A',
          fourPointValue: 4.0,
          originalScore: 9,
          finalized: true,
        })
        transaction.objectStore('tasks').put({
          id: 'tsk-1',
          title: 'Backup Task',
          status: 'planned',
          priority: 'high',
          subjectId: 'sub-1',
          createdAt: '2026-08-27T09:00:00.000Z',
          updatedAt: '2026-08-27T09:00:00.000Z',
        })
        transaction.objectStore('academicEvents').put({
          id: 'evt-1',
          title: 'Backup Event',
          type: 'exam',
          status: 'planned',
          subjectId: 'sub-1',
          startAt: '2026-08-28T09:00:00.000Z',
          createdAt: '2026-08-27T09:00:00.000Z',
          updatedAt: '2026-08-27T09:00:00.000Z',
        })

        transaction.oncomplete = () => {
          database.close()
          resolve(undefined)
        }
        transaction.onerror = () => reject(transaction.error)
      }
    })
  })

  // Reload to reflect seeded data
  await page.reload()
  await expect(page.getByText('Official GPA: 3.8')).toBeVisible()

  // 2. Create Backup (Download)
  await page.getByRole('link', { name: 'Backup/Restore' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Create Backup' }).click()
  const download = await downloadPromise
  const backupPath = await download.path()
  expect(backupPath).toBeTruthy()

  const backupContent = fs.readFileSync(backupPath!, 'utf-8')
  const backup = JSON.parse(backupContent)
  expect(backup.formatVersion).toBe(1)
  expect(backup.data.studentProfiles[0].name).toBe('Backup Test Student')

  // 3. Modify current records
  await page.getByRole('link', { name: 'Academics' }).click()
  await page.getByRole('link', { name: 'Profile' }).click()
  await page.getByLabel('Student name').fill('Modified Student')
  await page.getByLabel('Overall GPA').fill('2.5')
  await page.getByRole('button', { name: 'Save profile' }).click()
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByText('Official GPA: 2.5')).toBeVisible()

  // 4. Import backup
  // We click the input element. But since it's an input type=file, Playwright usually uses setInputFiles directly.
  await page.getByRole('link', { name: 'Backup/Restore' }).click()
  const fileInput = page.getByLabel('Choose Backup File')

  // We can write the downloaded file to a known location to upload it.
  const tempFile = path.join(process.cwd(), 'temp-backup.json')
  fs.writeFileSync(tempFile, backupContent)
  await fileInput.setInputFiles(tempFile)

  // 5. Validate and display preview
  await expect(page.getByText('Backup file validated')).toBeVisible()
  await expect(page.getByText('Restore Preview')).toBeVisible()
  await expect(page.getByText('Student profiles: 1')).toBeVisible()

  // 6. Confirm restore
  await page.getByRole('button', { name: 'Restore', exact: true }).click()
  await expect(page.getByText('Backup restored successfully')).toBeVisible()

  // 7. Verify academic records & Planner records
  // Since restore calls reload(), we check that the old data is back.
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByText('Official GPA: 3.8')).toBeVisible()
  await expect(page.getByText('Official GPA: 3.8')).toBeVisible()
  await expect(page.getByText('Calculated GPA: 4.00')).toBeVisible() // 9 = A = 4.0

  // 8. Reload to ensure persisted state
  await page.reload()
  await expect(page.getByText('Official GPA: 3.8')).toBeVisible()

  await page.getByRole('link', { name: 'Planner' }).click()
  await page.getByRole('button', { name: 'All' }).click()
  await expect(page.getByText('Backup Task')).toBeVisible()
  await expect(page.getByText('Backup Event')).toBeVisible()

  // Cleanup
  fs.unlinkSync(tempFile)
})

test('rejects an invalid backup file', async ({ page }) => {
  await page.goto('/')

  const tempFile = path.join(process.cwd(), 'invalid-backup.json')
  fs.writeFileSync(tempFile, JSON.stringify({ invalid: 'data' }))

  await page.getByRole('link', { name: 'Backup/Restore' }).click()
  const fileInput = page.getByLabel('Choose Backup File')
  await fileInput.setInputFiles(tempFile)

  await expect(
    page.getByText('Unsupported backup format version'),
  ).toBeVisible()
  await expect(page.getByText('Restore Preview')).not.toBeVisible()

  fs.unlinkSync(tempFile)
})
