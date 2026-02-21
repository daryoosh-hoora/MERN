import 'express-async-errors'

import express from 'express'

import { authMiddleware } from './middlewares/auth.middleware'
import { errorMiddleware } from './middlewares/error.middleware'
import { BrokerEventBus } from '../shared/infrastructure/event-bus/BrokerEventBus'
import { OutboxProcessor } from '../shared/infrastructure/Outbox/OutboxProcessor'
import { TaskCreationSaga } from '../saga/application/TaskCreationSaga'
import { SagaRegistry } from '../saga/infrastructure/SagaRegistry'

import { healthRouter } from './routes/health.routes'
import { createAuthRouter } from './routes/auth.routes'
import { createUsersRouter } from './routes/users.routes'
import { taskRouters } from '@/modules/task/api/task.routes'

import { RegisterUserController } from './controllers/RegisterUserController'
import { RegisterUserHandler } from '../application/users/RegisterUserHandler'
import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository'
import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher'
import { GetUserByIdHandler } from '../application/users/queries/GetUserByIdHandler'
import { GetUserByIdController } from './controllers/GetUserByIdController'
import { ListUsersHandler } from '../application/users/queries/ListUsersHandler'
import { ListUsersController } from './controllers/ListUsersController'
import { UpdateUserHandler } from '../application/users/commands/UpdateUserHandler'
import { UpdateUserController } from './controllers/UpdateUserController'
import { SoftDeleteUserHandler } from '../application/users/commands/SoftDeleteUserHandler'
import { SoftDeleteUserController } from './controllers/SoftDeleteUserController'
import { JwtTokenService } from '../infrastructure/security/JwtTokenService'
import { LoginHandler } from '../application/auth/commands/LoginHandler'
import { LoginController } from './controllers/LoginController'
import { JwtTokenVerifier } from '../infrastructure/security/JwtTokenVerifier'
import { MongoTaskRepository } from '../modules/task/infrastructure/repositories/MongoTaskRepository'
import { TaskController } from '@/modules/task/api/TaskController'
import { CreateTaskCommandHandler } from '../modules/task/application/commands/CreateTaskCommand'
import { UpdateTaskCommandHandler } from '../modules/task/application/commands/UpdateTaskCommand'
import { DeleteTaskCommandHandler } from '../modules/task/application/commands/DeleteTaskCommand'
import { ListMyTasksQueryHandler } from '../modules/task/application/queries/ListMyTasksQuery'
import { GetTaskByIdQueryHandler } from '../modules/task/application/queries/GetTaskByIdQuery'
import { MongoJobQueue } from '../infrastructure/job-queue/MongoJobQueue'
import { JobWorker } from '../infrastructure/job-queue/JobWorker'
import { RequestContext } from '@/shared/infrastructure/RequestContext'
import { RequestCurrentUserProvider } from '@/shared/infrastructure/RequestCurrentUserProvider'
import { registerTaskModuleEvents } from '@/modules/task'

export function createServer() {
  const app = express()
  app.use(express.json())

  // env
  const jwtSecret = process.env.JWT_SECRET!
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not defined')
  }

  // dependencies
  const userRepository = new MongoUserRepository()
  const taskRepository = new MongoTaskRepository()
  const passwordHasher = new BcryptPasswordHasher()
  const tokenService = new JwtTokenService(jwtSecret)
  const tokenVerifier = new JwtTokenVerifier(jwtSecret)

  app.use((req, res, next) => {
    RequestContext.run(() => next())
  })

  const currentUser = new RequestCurrentUserProvider()

  const auth = authMiddleware(tokenVerifier)

  registerTaskModuleEvents()

  const eventBus = new BrokerEventBus()

  eventBus.subscribe('task.created', async (payload) => {
    console.log('[Broker] Task created:', payload)
  })

  const processor = new OutboxProcessor(eventBus)

  setInterval(() => {
    processor.process()
  }, 5000)

  const jobQueue = new MongoJobQueue()

  const worker = new JobWorker()

  worker.register('send-notification', async (payload) => {
    console.log('[Worker] Sending notification', payload)
  })

  worker.register('create-audit-log', async (payload) => {
    console.log('[Worker] Creating audit log', payload)
  })

  worker.start(3000)

  const taskCreationSaga = new TaskCreationSaga(jobQueue)

  const sagaRegistry = new SagaRegistry(
    eventBus,
    [taskCreationSaga]
  )

  sagaRegistry.register()

  // handlers
  const registerUserHandler = new RegisterUserHandler(
    userRepository,
    passwordHasher
  )
  const getUserByIdHandler = new GetUserByIdHandler(userRepository)
  const listUsersHandler = new ListUsersHandler(userRepository)
  const updateUserHandler = new UpdateUserHandler(userRepository)
  const softDeleteUserHandler = new SoftDeleteUserHandler(userRepository)
  const loginHandler = new LoginHandler(
    userRepository,
    passwordHasher,
    tokenService
  )
  const createTaskCommandHandler = new CreateTaskCommandHandler(
    taskRepository,
    currentUser,
    // eventBus
  )
  const listMyTasksQueryHandler = new ListMyTasksQueryHandler(taskRepository)
  const getTaskByIdQueryHandler = new GetTaskByIdQueryHandler(taskRepository)
  const updateTaskCommandHandler = new UpdateTaskCommandHandler(
    taskRepository,
    currentUser,
    // eventBus
  )
  const deleteTaskCommandHandler = new DeleteTaskCommandHandler(taskRepository)

  // controllers
  const registerUserController = new RegisterUserController(
    registerUserHandler
  )
  const getUserByIdController = new GetUserByIdController(
    getUserByIdHandler
  )
  const listUsersController = new ListUsersController(listUsersHandler)
  const updateUserController = new UpdateUserController(updateUserHandler)
  const softDeleteUserController = new SoftDeleteUserController(
    softDeleteUserHandler
  )

  const loginController = new LoginController(loginHandler)
  const taskController = new TaskController(
    createTaskCommandHandler,
    updateTaskCommandHandler,
    DeleteTaskCommandHandler,
    listMyTasksQueryHandler,
    getTaskByIdQueryHandler
  )

  // routes
  app.use('/health', healthRouter)
  app.use('/users',
    auth,
    createUsersRouter(
      getUserByIdController,
      listUsersController,
      updateUserController,
      softDeleteUserController
    )
  )

  app.use('/tasks',
    taskRouters(
      taskController,
      tokenVerifier
    )
  )

  app.use('/auth',
    createAuthRouter(
      registerUserController,
      loginController
    )
  )

  // 🔥 must be LAST
  app.use(errorMiddleware)

  return app
}
