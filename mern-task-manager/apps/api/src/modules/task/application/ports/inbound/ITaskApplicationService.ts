import { Result } from '@/shared/domain/Result'
import { ICreateTaskResponseDTO } from '../../dto/ICreateTaskResponseDTO'
import { IUpdateTaskResponseDTO } from '../../dto/IUpdateTaskResponseDTO'

export interface ITaskApplicationService {
  createTask(input: {
    title: string
    description? : string
  }): Promise<Result<ICreateTaskResponseDTO>>

  updateTask(input: {
    taskId: string
    title?: string
    description? : string
    status?: string
  }): Promise<Result<IUpdateTaskResponseDTO>>

  deleteTask(input: {
    taskId: string
  }): Promise<Result<void>>
}
