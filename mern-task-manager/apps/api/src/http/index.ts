import 'express-async-errors'

import express from 'express'

import { authMiddleware } from './middlewares/auth.middleware.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { BrokerEventBus } from '../shared/infrastructure/event-bus/BrokerEventBus.js'";
import { OutboxProcessor } from '../shared/infrastructure/Outbox/OutboxProcessor.js'
import { TaskCreationSaga } from '../saga/application/TaskCreationSaga.js'
import { SagaRegistry } from '../saga/infrastructure/SagaRegistry.js'

import { healthRouter } from './routes/health.routes.js'
import { createAuthRouter } from './routes/auth.routes.js'
import { createUsersRouter } from './routes/users.routes.js'
import { RegisterUserController } from './controllers/RegisterUserController.js'
import { RegisterUserHandler } from '../application/users/RegisterUserHandler.js'
import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository.js'
import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher.js'
import { GetUserByIdHandler } from '../application/users/queries/GetUserByIdHandler.js'
import { GetUserByIdController } from './controllers/GetUserByIdController.js'
import { ListUsersHandler } from '../application/users/queries/ListUsersHandler.js'
import { ListUsersController } from './controllers/ListUsersController.js'
import { UpdateUserHandler } from '../application/users/commands/UpdateUserHandler.js'
import { UpdateUserController } from './controllers/UpdateUserController.js'
import { SoftDeleteUserHandler } from '../application/users/commands/SoftDeleteUserHandler.js'
import { SoftDeleteUserController } from './controllers/SoftDeleteUserController.js'
import { JwtTokenService } from '../infrastructure/security/JwtTokenService.js'
import { LoginHandler } from '../application/auth/commands/LoginHandler.js'
import { LoginController } from './controllers/LoginController.js'
import { JwtTokenVerifier } from '../infrastructure/security/JwtTokenVerifier.js'
import { MongoTaskRepository } from '../infrastructure/repositories/MongoTaskRepository.js'
import { CreateTaskHandler } from '../application/tasks/commands/CreateTaskHandler.js'
import { TaskController } from './controllers/TaskController.js'
import { tasksRouter } from './routes/tasks.routes.js'
import { ListMyTasksHandler } from '../application/tasks/queries/ListMyTasksHandler.js'
import { GetTaskByIdHandler } from '../application/tasks/queries/GetTaskByIdHandler.js'
import { UpdateTaskHandler } from '../application/tasks/commands/UpdateTaskHandler.js'
import { SoftDeleteTaskHandler } from '../application/tasks/commands/SoftDeleteTaskHandler.js'
import { MongoJobQueue } from '../infrastructure/job-queue/MongoJobQueue.js'
import { JobWorker } from '../infrastructure/job-queue/JobWorker.js'

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
  const taskRepository = new MongoTaskRepository(null)
  const passwordHasher = new BcryptPasswordHasher()
  const tokenService = new JwtTokenService(jwtSecret)
  const tokenVerifier = new JwtTokenVerifier(jwtSecret)

  const auth = authMiddleware(tokenVerifier)

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
  const createTaskHandler = new CreateTaskHandler(
    taskRepository,
    eventBus
  )
  const listMyTasksHandler = new ListMyTasksHandler(taskRepository)
  const getTaskByIdHandler = new GetTaskByIdHandler(taskRepository)
  const updateTaskHandler = new UpdateTaskHandler(taskRepository)
  const softDeleteTaskHandler = new SoftDeleteTaskHandler(taskRepository)

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
    createTaskHandler,
    listMyTasksHandler,
    getTaskByIdHandler,
    updateTaskHandler,
    softDeleteTaskHandler
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
    tasksRouter(
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
