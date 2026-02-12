import { Task } from './Task.js'

export interface TaskRepository {
  findById(id: string): Promise<Task | null>
  findByOwner(
    ownerId: string,
    options: {
      limit: number
      offset: number
      status?: string
      sort?: string
    }
  ): Promise<Task[]>
  countByOwner(
    ownerId: string,
    status?: string
  ): Promise<number>
  save(task: Task): Promise<void>
  update(task: Task): Promise<void>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
}
