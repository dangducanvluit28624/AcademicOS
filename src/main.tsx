import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  IndexedDbAcademicProgramRepository,
  IndexedDbAcademicYearRepository,
  IndexedDbEnrollmentRepository,
  IndexedDbGradeRepository,
  IndexedDbSemesterRepository,
  IndexedDbStudentProfileRepository,
  IndexedDbSubjectRepository,
} from './infrastructure/persistence/academicRepositories'
import { initializeApplication } from './application/initializeApplication'
import { IndexedDbDatabase } from './infrastructure/persistence/indexedDbDatabase'
import { App } from './presentation/shell/App'

async function startApplication() {
  const database = new IndexedDbDatabase()
  await initializeApplication(database)
  const repositories = {
    profiles: new IndexedDbStudentProfileRepository(database),
    programs: new IndexedDbAcademicProgramRepository(database),
    years: new IndexedDbAcademicYearRepository(database),
    semesters: new IndexedDbSemesterRepository(database),
    subjects: new IndexedDbSubjectRepository(database),
    enrollments: new IndexedDbEnrollmentRepository(database),
    grades: new IndexedDbGradeRepository(database),
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App repositories={repositories} />
    </StrictMode>,
  )
}

void startApplication()
