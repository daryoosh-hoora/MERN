import { ITaskApplicationService } from '../../application/ports/inbound/ITaskApplicationService'
import { CreateTaskCommand, ICreateTaskResponseDTO } from '../../application/use-cases/CreateTask'
import { UpdateTaskCommand, IUpdateTaskResponseDTO } from '../../application/use-cases/UpdateTask'
import { Result } from '@/shared/domain/Result'
import { IQueryBus } from '@/shared/application/query-bus/IQueryBus'
import { ICommandBus } from '@/shared/application/command-bus/ICommandBus'
import { DeleteTaskCommand } from '../../application/use-cases/DeleteTask'
import { GetTaskByIdQuery, IGetTaskByIdResponseDTO } from '../../application/use-cases/GetTaskById'
import { GetAllTasksQuery } from '../../application/use-cases/GetAllTasks'
import { TaskStatusEnum } from '../../domain/enums/TaskStatusEnum'

export class TaskApplicationService implements ITaskApplicationService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus
  ) { }

  createTask(input: { 
    title: string, 
    description?: string 
  }): Promise<Result<ICreateTaskResponseDTO>> {
    const createTaskCommand = new CreateTaskCommand({
      title: input.title,
      description: input.description || undefined
    })

    return this.commandBus.execute<
      CreateTaskCommand,
      Result<ICreateTaskResponseDTO>
    >(createTaskCommand)
  }

  updateTask(input: {
    taskId: string
    title?: string
    description?: string
    status?: string
  }): Promise<Result<IUpdateTaskResponseDTO>> {
    const updateTaskCommand = new UpdateTaskCommand({
      taskId: input.taskId,
      title: input.title || undefined,
      description: input.description || undefined,
      status: input.status ? TaskStatusEnum[input.status] : undefined
    })

    return this.commandBus.execute<
      UpdateTaskCommand,
      Result<IUpdateTaskResponseDTO>
    >(updateTaskCommand)
    // return this.updateTaskCommandHandler.execute(input)
  }

  deleteTask(input: { 
    taskId: string 
  }): Promise<Result<void>> {
    const deleteTaskCommand = new DeleteTaskCommand({
      taskId: input.taskId
    })

    return this.commandBus.execute<
      DeleteTaskCommand,
      Result<void>
    >(deleteTaskCommand)
    // return this.deleteTaskCommandHandler.execute(input)
  }

  getTaskById(input: {
    taskId: string
  }): Promise<Result<IGetTaskByIdResponseDTO>> {
    const query = new GetTaskByIdQuery(
      input.taskId
    )

    return this.queryBus.execute<
      GetTaskByIdQuery,
      Result<IGetTaskByIdResponseDTO>
    >(query)
  }

  getAllTasks(input: {
    limit: number
    offset: number
    status?: TaskStatusEnum
    sortField?: string
    sortDirection?: string
  }): Promise<Result<IGetTaskByIdResponseDTO>> {
    const query = new GetAllTasksQuery(
      input.limit,
      input.offset,
      input.status,
      input.sortField,
      input.sortDirection
    )

    return this.queryBus.execute<
      GetAllTasksQuery,
      Result<IGetTaskByIdResponseDTO>
    >(query)
  }
}
