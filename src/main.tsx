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
import { Planner } from './presentation/planner/Planner'
import {
  IndexedDbAcademicEventRepository,
  IndexedDbTaskRepository,
} from './infrastructure/persistence/plannerRepositories'

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
  const plannerRepositories = {
    tasks: new IndexedDbTaskRepository(database, repositories.subjects),
    events: new IndexedDbAcademicEventRepository(
      database,
      repositories.subjects,
    ),
    subjects: repositories.subjects,
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App
        repositories={repositories}
        plannerRepositories={plannerRepositories}
        database={database}
        planner={<Planner repositories={plannerRepositories} />}
      />
    </StrictMode>,
  )
}

void startApplication()
