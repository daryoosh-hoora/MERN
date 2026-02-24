import { ITaskApplicationService } from '../../application/ports/inbound/ITaskApplicationService'
import { CreateTaskCommand } from '../../application/commands/CreateTaskCommand'
import { ICreateTaskResponseDTO } from '../../application/dto/ICreateTaskResponseDTO'
import { UpdateTaskCommand } from '../../application/commands/UpdateTaskCommand'
import { DeleteTaskCommand } from '../../application/commands/DeleteTaskCommand'
import { ICommandBus } from '@/shared/application/command-bus/ICommandBus'
import { IQueryBus } from '@/shared/application/query-bus/IQueryBus'
import { Result } from '@/shared/domain/Result'
import { GetTaskByIdQuery } from '../../application/queries/GetTaskByIdQuery'
import { IGetTaskByIdResponseDTO } from '../../application/dto/IGetTaskByIdResponseDTO'
import { IUpdateTaskResponseDTO } from '../../application/dto/IUpdateTaskResponseDTO'
import { GetAllTasksQuery } from '../../application/queries/GetAllTasksQuery'

export class TaskApplicationService implements ITaskApplicationService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus
  ) { }

  createTask(input: { title: string, description?: string }) {
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
  }) {
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

  deleteTask(input: { taskId: string }) {
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
  }) {
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
  }) {
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
