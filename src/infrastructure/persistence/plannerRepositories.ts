import type {
  AcademicEventRepository,
  SubjectRepository,
  TaskRepository,
} from '../../application/ports/academicRepositories'
import type { AcademicEvent, Task } from '../../domain'
import { validateAcademicEvent, validateTask } from '../../domain'
import { IndexedDbDatabase } from './indexedDbDatabase'

export class IndexedDbTaskRepository implements TaskRepository {
  constructor(
    private readonly database: IndexedDbDatabase,
    private readonly subjects: SubjectRepository,
  ) {}
  get(id: string) {
    return this.database.get<Task>('tasks', id)
  }
  list() {
    return this.database.list<Task>('tasks')
  }
  async save(task: Task) {
    validateTask(task)
    if (task.subjectId && !(await this.subjects.get(task.subjectId)))
      throw new Error(`Subject ${task.subjectId} does not exist`)
    await this.database.save('tasks', task)
  }
  async delete(id: string) {
    await this.database.delete('tasks', id)
  }
}

export class IndexedDbAcademicEventRepository implements AcademicEventRepository {
  constructor(
    private readonly database: IndexedDbDatabase,
    private readonly subjects: SubjectRepository,
  ) {}
  get(id: string) {
    return this.database.get<AcademicEvent>('academicEvents', id)
  }
  list() {
    return this.database.list<AcademicEvent>('academicEvents')
  }
  async save(event: AcademicEvent) {
    validateAcademicEvent(event)
    if (event.subjectId && !(await this.subjects.get(event.subjectId)))
      throw new Error(`Subject ${event.subjectId} does not exist`)
    await this.database.save('academicEvents', event)
  }
  async delete(id: string) {
    await this.database.delete('academicEvents', id)
  }
}
