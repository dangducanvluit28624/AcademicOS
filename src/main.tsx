import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeApplication } from './application/initializeApplication'
import { IndexedDbDatabase } from './infrastructure/persistence/indexedDbDatabase'
import { App } from './presentation/shell/App'

async function startApplication() {
  await initializeApplication(new IndexedDbDatabase())

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void startApplication()
