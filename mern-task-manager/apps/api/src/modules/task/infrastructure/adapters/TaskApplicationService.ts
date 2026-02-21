import { ITaskApplicationService } from '../../application/ports/inbound/ITaskApplicationService'
import { CreateTaskCommand, CreateTaskCommandHandler } from '../../application/commands/CreateTaskCommand'
import { ICreateTaskResponseDTO } from '../../application/dto/ICreateTaskResponseDTO'
import { UpdateTaskCommandHandler } from '../../application/commands/UpdateTaskCommand'
import { DeleteTaskCommandHandler } from '../../application/commands/DeleteTaskCommand'
import { ICommandBus } from '@/shared/application/command-bus/ICommandBus'
import { IQueryBus } from '@/shared/application/query-bus/IQueryBus'
import { Result } from '@/shared/domain/Result'
import { GetTaskByIdQuery } from '../../application/queries/GetTaskByIdQuery'
import { IGetTaskByIdResponseDTO } from '../../application/dto/IGetTaskByIdResponseDTO'

export class TaskApplicationService implements ITaskApplicationService {
  // constructor(
  //   private readonly createTaskCommandHandler: CreateTaskCommandHandler,
  //   private readonly updateTaskCommandHandler: UpdateTaskCommandHandler,
  //   private readonly deleteTaskCommandHandler: DeleteTaskCommandHandler
  // ) { }
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

    // return this.createTaskCommandHandler.execute(command)
  }

  updateTask(input: {
    taskId: string
    title?: string
    description?: string
    status?: string
  }) {
    return this.updateTaskCommandHandler.execute(input)
  }

  deleteTask(input: { taskId: string }) {
    return this.deleteTaskCommandHandler.execute(input)
  }

  getTaskById(input: { taskId: string, requesterRole: string }) {
    const query = new GetTaskByIdQuery(
      input.taskId,
      input.requesterRole
    )

    return this.queryBus.execute<
      GetTaskByIdQuery,
      Result<IGetTaskByIdResponseDTO>
    >(query)
  }
}
