import { MongoTaskRepository } from '../persistence/mongodb/repositories/MongoTaskRepository'
import { CreateTaskCommand, CreateTaskCommandHandler } from '../../application/use-cases/CreateTask'
import { UpdateTaskCommand, UpdateTaskCommandHandler } from '../../application/use-cases/UpdateTask'
import { DeleteTaskCommand, DeleteTaskCommandHandler } from '../../application/use-cases/DeleteTask'
import { GetTaskByIdQuery, GetTaskByIdQueryHandler } from '../../application/use-cases/GetTaskById'
import { GetAllTasksQuery, GetAllTasksQueryHandler } from '../../application/use-cases/GetAllTasks'
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
import { JwtTokenService } from '@/shared/infrastructure/security/JwtTokenService'
import { JwtTokenVerifier } from '@/shared/infrastructure/security/JwtTokenVerifier'

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
  const jwtSecret = process.env.JWT_SECRET!
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not defined')
  }

  const tokenService = new JwtTokenService(jwtSecret)
  const tokenVerifier = new JwtTokenVerifier(jwtSecret)
  
  const taskRepository = new MongoTaskRepository()
  const currentUser = new RequestCurrentUserProvider()

  const commandBus = new InMemoryCommandBus()
  const queryBus = new InMemoryQueryBus()

  const dispatcher = new InMemoryDomainEventDispatcher()
  const unitOfWork = new InMemoryUnitOfWork(dispatcher)

  commandBus.addMiddleware(new LoggingMiddleware())
  commandBus.addMiddleware(new TransactionMiddleware(unitOfWork))

  // register handlers
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

  const router = createTaskRouter(taskController, tokenVerifier)

  return {
    applicationService: taskApplicationService,
    router: router
  }
}
