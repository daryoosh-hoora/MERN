import { TaskStatusEnum } from "@/modules/task/domain/enums/TaskStatusEnum"
import { Task } from "../../../domain/entities/Task"

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>
  
  findByOwner(ownerId: string, options: {
    limit: number
    offset: number
    status?: TaskStatusEnum
    sortField?: string
    sortDirection?: string
  }): Promise<Task[]>
  
  countByOwner(ownerId: string, status?: string): Promise<number>
  
  save(task: Task): Promise<void>
  
  update(task: Task): Promise<void>
  
  delete(id: string, permanently?: boolean): Promise<void>
}
