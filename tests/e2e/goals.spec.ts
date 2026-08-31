import { test, expect } from '@playwright/test'

test.describe('M6 Goals & Graduation Progress', () => {
  test('manages academic goals and calculates progress', async ({ page }) => {
    // We will navigate to the page
    await page.goto('/')

    // Fill in basic academic data to derive progress
    await page.getByRole('link', { name: 'Academics' }).click()
    await page.getByRole('link', { name: 'Profile' }).click()
    await page.getByLabel('Student name').fill('John Doe')
    await page.getByRole('button', { name: 'Save profile' }).click()

    await page.getByRole('link', { name: 'Programs' }).click()
    await page.getByLabel('Program name').fill('Computer Science')
    await page.getByRole('button', { name: 'Save program' }).click()

    await page.getByRole('link', { name: 'Subjects' }).click()
    await page.getByLabel('Subject name').fill('Intro to Programming')
    await page.getByLabel('Subject credits').fill('3')
    await page.getByRole('button', { name: 'Save subject' }).click()

    await page.getByRole('link', { name: 'Years' }).click()
    await page.getByLabel('Academic year label').fill('2024')
    await page.getByRole('button', { name: 'Save year' }).click()

    await page.getByRole('link', { name: 'Semesters' }).click()
    await page.getByLabel('Semester name').fill('Fall 2024')
    await page.getByLabel('Semester year').selectOption({ label: '2024' })
    await page.getByRole('button', { name: 'Save semester' }).click()

    await page.getByRole('link', { name: 'Enrollments' }).click()
    await page
      .getByLabel('Enrollment subject')
      .selectOption({ label: 'Intro to Programming' })
    await page
      .getByLabel('Enrollment semester')
      .selectOption({ label: 'Fall 2024' })
    await page.getByLabel('Enrollment status').selectOption('Completed')
    await page.getByRole('button', { name: 'Save enrollment' }).click()

    // Add a finalized grade to make it available
    await page.getByRole('link', { name: 'Grades' }).click()
    await page.getByLabel('Grade enrollment').selectOption({ index: 1 })
    await page.getByLabel('Course score').fill('9')
    await page.getByLabel('Grade finalized').check()
    await page.getByRole('button', { name: 'Save grade' }).click()

    // Now let's create a goal
    await page.getByRole('link', { name: 'Goals' }).click()
    await page.getByRole('button', { name: 'Create Goal' }).click()

    // Fill the goal form
    await page.getByLabel('Goal Title').fill('First Semester Credits')
    await page.getByLabel('Goal Type').selectOption({ label: 'Credits' })
    await page.getByLabel('Target Value').fill('3')
    await page.getByRole('button', { name: 'Save Goal' }).click()

    // It should now be in the list, and achieved because we have 3 credits completed
    await expect(
      page.getByRole('listitem').filter({ hasText: 'First Semester Credits' }),
    ).toBeVisible()
    await expect(
      page.getByRole('listitem').filter({ hasText: 'First Semester Credits' }),
    ).toContainText('Achieved')

    // Edit the goal
    await page.getByRole('button', { name: 'Edit' }).first().click()
    await page.getByLabel('Target Value').fill('15')
    await page.getByRole('button', { name: 'Save Goal' }).click()

    // Now it should be in progress
    await expect(
      page.getByRole('listitem').filter({ hasText: 'First Semester Credits' }),
    ).toContainText('In Progress')

    // Create a backup
    await page.getByRole('link', { name: 'Backup/Restore' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Create Backup' }).click()
    const download = await downloadPromise
    const path = await download.path()
    expect(path).toBeTruthy()

    // Archive the goal
    await page.getByRole('link', { name: 'Goals' }).click()
    await page
      .getByRole('button', { name: 'Archive', exact: true })
      .first()
      .click()
    await expect(
      page.getByRole('listitem').filter({ hasText: 'First Semester Credits' }),
    ).not.toBeVisible()

    // Show archived
    await page.getByRole('button', { name: 'Show Archived' }).click()
    await expect(
      page.getByRole('listitem').filter({ hasText: 'First Semester Credits' }),
    ).toBeVisible()

    // Restore the backup
    await page.getByRole('link', { name: 'Backup/Restore' }).click()
    await page.locator('input[type="file"]').setInputFiles(path)
    await expect(
      page.getByRole('heading', { name: 'Restore Preview' }),
    ).toBeVisible()

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Restore' }).click()

    await expect(page.getByText('Backup restored successfully')).toBeVisible()

    // After restoring, the goal should be back to active (because the backup was taken before archiving)
    await page.reload()
    await page.getByRole('link', { name: 'Goals' }).click()
    await expect(
      page.getByRole('listitem').filter({ hasText: 'First Semester Credits' }),
    ).toBeVisible()
  })
})
