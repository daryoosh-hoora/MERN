import { Result } from '@/shared/domain/Result'
import { ICreateTaskResponseDTO } from '../../use-cases/CreateTask'
import { IUpdateTaskResponseDTO } from '../../use-cases/UpdateTask'
import { IGetTaskByIdResponseDTO } from '../../use-cases/GetTaskById'
import { TaskStatusEnum } from '@/modules/task/domain/enums/TaskStatusEnum'

export interface ITaskApplicationService {
  createTask(input: {
    title: string
    description?: string
  }): Promise<Result<ICreateTaskResponseDTO>>

  updateTask(input: {
    taskId: string
    title?: string
    description?: string
    status?: string
  }): Promise<Result<IUpdateTaskResponseDTO>>

  deleteTask(input: {
    taskId: string
  }): Promise<Result<void>>

  getTaskById(input: {
    taskId: string
  }): Promise<Result<IGetTaskByIdResponseDTO>>

  getAllTasks(input: {
    limit: number
    offset: number
    status?: TaskStatusEnum
    sortField?: string
    sortDirection?: string
  }): Promise<Result<IGetTaskByIdResponseDTO[]>>
}
