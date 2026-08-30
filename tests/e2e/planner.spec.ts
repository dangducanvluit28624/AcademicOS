import { expect, test } from '@playwright/test'

test('manages persisted Planner tasks and academic events', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Planner' })).toBeVisible()

  await page.evaluate(async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('academic-os', 5)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const database = request.result
        const transaction = database.transaction('subjects', 'readwrite')
        transaction.objectStore('subjects').put({
          id: 'e2e-subject',
          name: 'Planner Mathematics',
          credits: 3,
        })
        transaction.oncomplete = () => {
          database.close()
          resolve(undefined)
        }
        transaction.onerror = () => reject(transaction.error)
      }
    })
  })

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Planner' })).toBeVisible()

  const now = new Date()
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const futureTime = '23:59'

  await page.getByLabel('Task title').fill('Read planner chapter')
  await page.getByLabel('Task due date').fill(`${todayDate}T${futureTime}`)
  await page.getByLabel('Task subject').selectOption('e2e-subject')
  await page.getByRole('button', { name: 'Save task' }).click()
  await expect(page.getByText('Read planner chapter')).toBeVisible()
  await expect(
    page.locator('li').filter({ hasText: 'Planner Mathematics' }).first(),
  ).toBeVisible()

  const task = page.locator('li').filter({ hasText: 'Read planner chapter' })
  await task.getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Task title').fill('Read updated planner chapter')
  await page.getByRole('button', { name: 'Save task' }).click()
  await expect(page.getByText('Read updated planner chapter')).toBeVisible()
  const updatedTask = page
    .locator('li')
    .filter({ hasText: 'Read updated planner chapter' })
  await updatedTask.getByRole('button', { name: 'Complete' }).click()
  await expect(updatedTask.getByText('completed')).toBeVisible()

  await page.getByLabel('Event title').fill('Planner Mathematics exam')
  await page.getByLabel('Event type').selectOption('exam')
  await page.getByLabel('Event start').fill(`${todayDate}T${futureTime}`)
  await page.getByLabel('Event subject').selectOption('e2e-subject')
  await page.getByRole('button', { name: 'Save event' }).click()
  await expect(page.getByText('Planner Mathematics exam')).toBeVisible()

  await page.getByRole('button', { name: 'Upcoming' }).click()
  await expect(page.getByText('Planner Mathematics exam')).toBeVisible()
  await expect(page.getByText('Read updated planner chapter')).not.toBeVisible() // Proves it's filtered

  await page.getByRole('button', { name: 'Today' }).click()
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible()

  await page.reload()
  await expect(page.getByText('Read updated planner chapter')).toBeVisible()
  await expect(page.getByText('Planner Mathematics exam')).toBeVisible()

  const event = page
    .locator('li')
    .filter({ hasText: 'Planner Mathematics exam' })
  await event.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByText('Planner Mathematics exam')).not.toBeVisible()
})
