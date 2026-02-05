import { Task } from './Task.js'

export interface TaskRepository {
  findById(id: string): Promise<Task | null>
  findByOwner(
    ownerId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<Task[]>
  save(task: Task): Promise<void>
  update(task: Task): Promise<void>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
}
