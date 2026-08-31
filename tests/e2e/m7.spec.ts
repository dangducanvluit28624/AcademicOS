import { test, expect } from '@playwright/test'
import * as fs from 'fs'

test.describe('M7 Academic Workflows & Presentation', () => {
  test('manages academic lifecycles safely and validates integrity', async ({
    page,
  }) => {
    // 1. launch application
    await page.goto('/')

    // 2. navigate Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(
      page.getByRole('heading', { name: 'Academic dashboard' }),
    ).toBeVisible()

    // 3. navigate Academics
    await page.getByRole('link', { name: 'Academics' }).click()
    await expect(
      page.getByRole('heading', { name: 'Academic Management' }),
    ).toBeVisible()

    // 4. create academic record
    await page.getByRole('link', { name: 'Programs' }).click()
    await page.getByLabel('Program name').fill('Computer Science')
    await page.getByRole('button', { name: 'Save Program' }).click()
    await expect(page.getByText('Program saved successfully')).toBeVisible()

    // Create a subject
    await page.getByRole('link', { name: 'Subjects' }).click()
    await page.getByLabel('Subject name').fill('Math 101')
    await page.getByLabel('Subject credits').fill('3')
    await page.getByRole('button', { name: 'Save Subject' }).click()
    await expect(page.getByText('Subject saved successfully')).toBeVisible()

    // 5. edit record
    await page.getByRole('button', { name: 'Edit' }).first().click()
    await page.getByLabel('Subject name').fill('Mathematics 101')
    await page.getByRole('button', { name: 'Save Subject' }).click()
    await expect(page.getByText('Subject saved successfully')).toBeVisible()

    // 6. verify persistence
    await page.reload()
    await page.getByRole('link', { name: 'Academics' }).click()
    await page.getByRole('link', { name: 'Subjects' }).click()
    await expect(page.getByText('Mathematics 101')).toBeVisible()

    // 7. attempt duplicate
    await page.getByLabel('Subject name').fill('Mathematics 101')
    await page.getByLabel('Subject credits').fill('4')
    await page.getByRole('button', { name: 'Save Subject' }).click()

    // 8. verify validation
    await expect(
      page.getByText('A subject with this name or code already exists'),
    ).toBeVisible()

    // Setup an enrollment to test safe deletion
    await page.getByRole('link', { name: 'Years' }).click()
    await page.getByLabel('Academic year label').fill('2024')
    await page.getByRole('button', { name: 'Save Year' }).click()

    await page.getByRole('link', { name: 'Semesters' }).click()
    await page.getByLabel('Semester name').fill('Fall 2024')
    await page.getByLabel('Semester year').selectOption({ label: '2024' })
    await page.getByRole('button', { name: 'Save Semester' }).click()

    await page.getByRole('link', { name: 'Enrollments' }).click()
    await page
      .getByLabel('Enrollment subject')
      .selectOption({ label: 'Mathematics 101 ' }) // space might not be there
    // Actually we can select by index or just the label.
    // In our UI, subject name might have (Archived) suffix, but not yet.
    await page.getByLabel('Enrollment subject').selectOption({ index: 1 })
    await page.getByLabel('Enrollment semester').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Save Enrollment' }).click()
    await expect(page.getByText('Enrollment saved successfully')).toBeVisible()

    // 11. attempt unsafe deletion
    await page.getByRole('link', { name: 'Subjects' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()

    // 12. verify rejection
    await expect(
      page.getByText(
        'Cannot delete subject because it is referenced by one or more enrollments',
      ),
    ).toBeVisible()

    // 9. archive record
    await page.getByRole('button', { name: 'Archive' }).click()
    await expect(page.getByText('Subject archived successfully')).toBeVisible()

    // 10. verify archived state
    await expect(page.getByText('Archived', { exact: true })).toBeVisible()

    // Attempting new enrollment for archived subject should fail (or not show it, but our UI disables it)
    await page.getByRole('link', { name: 'Enrollments' }).click()
    // Select is disabled, so Playwright might fail to select, or we can check disabled
    const subjectOption = page.locator(
      'select[aria-label="Enrollment subject"] option',
      { hasText: 'Mathematics 101 (Archived)' },
    )
    await expect(subjectOption).toBeDisabled()

    // 13. navigate Planner
    await page.getByRole('link', { name: 'Planner' }).click()

    // 14. verify Planner functionality
    await expect(page.getByRole('heading', { name: 'Planner' })).toBeVisible()
    const now = new Date()
    const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    await page.getByLabel('Task title').fill('Planner task')
    await page.getByLabel('Task due date').fill(`${todayDate}T23:59`)
    await page.getByLabel('Task subject').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Save task' }).click()
    await expect(page.getByText('Planner task')).toBeVisible()

    // 15. navigate Goals
    await page.getByRole('link', { name: 'Goals' }).click()

    // 16. verify Goals functionality
    await expect(
      page.getByRole('heading', { name: 'Goals & Graduation Progress' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Create Goal' }).click()
    await page.getByLabel('Goal Title').fill('Test Goal')
    await page.getByLabel('Target Value').fill('3')
    await page.getByRole('button', { name: 'Save Goal' }).click()
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Test Goal' }),
    ).toBeVisible()

    // 17. navigate Backup
    await page.getByRole('link', { name: 'Backup/Restore' }).click()

    // 18. export
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Create Backup' }).click()
    const download = await downloadPromise
    const backupPath = await download.path()
    expect(backupPath).toBeTruthy()

    // 19. restore
    await page.locator('input[type="file"]').setInputFiles(backupPath!)
    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Restore' }).click()
    await expect(page.getByText('Backup restored successfully')).toBeVisible()

    // 20. verify application integrity after restore
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page.getByText('Trend status:')).toBeVisible()

    fs.unlinkSync(backupPath!)
  })
})
