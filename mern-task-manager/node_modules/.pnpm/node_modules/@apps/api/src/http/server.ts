import express from 'express'
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
import { authMiddleware } from './middlewares/auth.middleware.js'
import { MongoTaskRepository } from '../infrastructure/repositories/MongoTaskRepository.js'
import { CreateTaskHandler } from '../application/tasks/commands/CreateTaskHandler.js'
import { TaskController } from './controllers/TaskController.js'
import { tasksRouter } from './routes/tasks.routes.js'

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
  
  const auth = authMiddleware(tokenVerifier)

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
  const createTaskHandler = new CreateTaskHandler(taskRepository)

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
  const taskController = new TaskController(createTaskHandler)
  
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
  app.use('/tasks', tasksRouter(taskController))
  app.use('/auth',
    createAuthRouter(
      registerUserController,
      loginController
    )
  )
  
  return app
}
