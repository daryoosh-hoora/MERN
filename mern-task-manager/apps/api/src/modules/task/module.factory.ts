import { MongoTaskRepository } from './infrastructure/repositories/MongoTaskRepository'
import { CreateTaskCommand, CreateTaskCommandHandler } from './application/commands/CreateTaskCommand'
import { UpdateTaskCommandHandler } from './application/commands/UpdateTaskCommand'
import { DeleteTaskCommandHandler } from './application/commands/DeleteTaskCommand'
import { TaskApplicationService } from './infrastructure/adapters/TaskApplicationService'
import { ITaskApplicationService } from './application/ports/inbound/ITaskApplicationService'
import { RequestCurrentUserProvider } from '@/shared/infrastructure/RequestCurrentUserProvider'
import { InMemoryCommandBus } from '@/shared/infrastructure/command-bus/InMemoryCommandBus'
import { InMemoryQueryBus } from '@/shared/infrastructure/query-bus/InMemoryQueryBus'
import { GetTaskByIdQuery, GetTaskByIdQueryHandler } from './application/queries/GetTaskByIdQuery'

export function createTaskModule(): ITaskApplicationService {

  const repository = new MongoTaskRepository()
  const currentUser = new RequestCurrentUserProvider()

  const commandBus = new InMemoryCommandBus()

  commandBus.register(
    CreateTaskCommand.name,
    new CreateTaskCommandHandler(repository, currentUser)
  )

  const queryBus = new InMemoryQueryBus()

  queryBus.register(
    GetTaskByIdQuery.name,
    new GetTaskByIdQueryHandler(repository, currentUser)
  )

  const createTaskCommandHandler = new CreateTaskCommandHandler(repository, currentUser)
  const updateTaskCommandHandler = new UpdateTaskCommandHandler(repository, currentUser)
  const deleteTaskCommandHandler = new DeleteTaskCommandHandler(repository)

  return new TaskApplicationService(
    createTaskCommandHandler,
    updateTaskCommandHandler,
    deleteTaskCommandHandler
  )
}
