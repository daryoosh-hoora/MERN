import { MongoTaskRepository } from '../../infrastructure/repositories/MongoTaskRepository'
import { CreateTaskCommand, CreateTaskCommandHandler } from '../../application/commands/CreateTaskCommand'
import { UpdateTaskCommand, UpdateTaskCommandHandler } from '../../application/commands/UpdateTaskCommand'
import { DeleteTaskCommand, DeleteTaskCommandHandler } from '../../application/commands/DeleteTaskCommand'
import { GetTaskByIdQuery, GetTaskByIdQueryHandler } from '../../application/queries/GetTaskByIdQuery'
import { GetAllTasksQuery, GetAllTasksQueryHandler } from '../../application/queries/GetAllTasksQuery'
import { TaskApplicationService } from '../../infrastructure/adapters/TaskApplicationService'
import { ITaskApplicationService } from '../../application/ports/inbound/ITaskApplicationService'
import { RequestCurrentUserProvider } from '@/shared/infrastructure/RequestCurrentUserProvider'
import { InMemoryCommandBus } from '@/shared/infrastructure/command-bus/InMemoryCommandBus'
import { InMemoryQueryBus } from '@/shared/infrastructure/query-bus/InMemoryQueryBus'
import { LoggingMiddleware } from '@/presentation/http/middlewares/logging.middleware'
import { TransactionMiddleware } from '@/presentation/http/middlewares/transaction.middleware'
import { InMemoryDomainEventDispatcher } from '@/shared/infrastructure/domain-event/InMemoryDomainEventDispatcher'
import { InMemoryUnitOfWork } from '@/shared/infrastructure/unit-of-work/InMemoryUnitOfWork'
import { TaskController } from '../../api/TaskController'
import { createTaskRouter } from '../../api/task.routes'
import { ITaskModule } from '../../application/ports/inbound/ITaskModule'

// import { DomainEventDispatcher } from '@/shared/domain/DomainEventDispatcher'
// import { TaskCreatedEvent } from './domain/events/TaskCreatedEvent'
// import { TaskCreatedHandler } from './application/handlers/TaskCreatedEventHandler'

// export function registerTaskModuleEvents() {
//   DomainEventDispatcher.register(
//     TaskCreatedEvent,
//     new TaskCreatedHandler()
//   )
// }
export function createTaskModule(): Promise<ITaskModule> {
  const taskRepository = new MongoTaskRepository()
  const currentUser = new RequestCurrentUserProvider()

  const commandBus = new InMemoryCommandBus()
  const queryBus = new InMemoryQueryBus()

  const dispatcher = new InMemoryDomainEventDispatcher()
  const unitOfWork = new InMemoryUnitOfWork(dispatcher)

  commandBus.addMiddleware(new LoggingMiddleware())
  commandBus.addMiddleware(new TransactionMiddleware(unitOfWork))

  // Register command handlers
  const createTaskCommandHandler = new CreateTaskCommandHandler(taskRepository, currentUser)

  commandBus.register(
    CreateTaskCommand.name,
    createTaskCommandHandler
  )

  const updateTaskCommandHandler = new UpdateTaskCommandHandler(taskRepository, currentUser)

  commandBus.register(
    UpdateTaskCommand.name,
    updateTaskCommandHandler
  )

  const deleteTaskCommandHandler = new DeleteTaskCommandHandler(taskRepository, currentUser)

  commandBus.register(
    DeleteTaskCommand.name,
    deleteTaskCommandHandler
  )

  // Register query handlers
  queryBus.register(
    GetTaskByIdQuery.name,
    new GetTaskByIdQueryHandler(taskRepository, currentUser)
  )

  queryBus.register(
    GetAllTasksQuery.name,
    new GetAllTasksQueryHandler(taskRepository, currentUser)
  )

  const taskApplicationService = new TaskApplicationService(
    commandBus,
    queryBus
  )

  const taskController = new TaskController(taskApplicationService)

  const router = createTaskRouter(taskController, new TokenVerifier())

  return {
    applicationService: taskApplicationService,
    router: router
  }
}
