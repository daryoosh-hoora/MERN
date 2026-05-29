import 'express-async-errors'

import express from 'express'

import { authMiddleware } from './middlewares/auth.middleware'
import { errorMiddleware } from './middlewares/error.middleware'
import { BrokerEventBus } from '../../shared/infrastructure/event-bus/BrokerEventBus'
import { OutboxProcessor } from '../../shared/infrastructure/Outbox/OutboxProcessor'
import { TaskCreationSaga } from '../../saga/application/TaskCreationSaga'
import { SagaRegistry } from '../../saga/infrastructure/SagaRegistry'
import { healthRouter } from './routes/health.routes'
import { MongoUserRepository } from '../../modules/user/infrastructure/persistence/mongodb/repositories/MongoUserRepository'
import { BcryptPasswordHasher } from '../../shared/infrastructure/security/BcryptPasswordHasher'
import { JwtTokenService } from '../../shared/infrastructure/security/JwtTokenService'
import { JwtTokenVerifier } from '../../shared/infrastructure/security/JwtTokenVerifier'
import { MongoJobQueue } from '../../shared/infrastructure/job-queue/MongoJobQueue'
import { JobWorker } from '../../shared/infrastructure/job-queue/JobWorker'
import { RequestContext } from '@/shared/infrastructure/RequestContext'
import { RequestCurrentUserProvider } from '@/shared/infrastructure/RequestCurrentUserProvider'
import { ITaskModule } from '@/modules/task/application/ports/inbound/ITaskModule'
import { IUserModule } from '@/modules/user/application/ports/inbound/IUserModule'
import { IAuthenticationModule } from '@/modules/auth/authentication/application/ports/inbound/IAuthenticationModule'

export function createServer(
  taskModule: ITaskModule, 
  userModule: IUserModule,
  authenticationModule: IAuthenticationModule
) {
  const app = express()
  app.use(express.json())

  // env
  const jwtSecret = process.env.JWT_SECRET!
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not defined')
  }

  // dependencies
  const userRepository = new MongoUserRepository()
  const passwordHasher = new BcryptPasswordHasher()
  const tokenService = new JwtTokenService(jwtSecret)
  const tokenVerifier = new JwtTokenVerifier(jwtSecret)

  app.use((req, res, next) => {
    RequestContext.run(() => next())
  })

  const currentUser = new RequestCurrentUserProvider()

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

  // routes
  app.use('/health', healthRouter)
  // app.use('/users',
  //   auth,
  //   createUsersRouter(
  //     getUserByIdController,
  //     listUsersController,
  //     updateUserController,
  //     softDeleteUserController
  //   )
  // )
  app.use('/auth', authenticationModule.router)
  app.use('/users', userModule.router)
  app.use('/tasks', auth, taskModule.router)

  // app.use('/auth',
  //   createAuthRouter(
  //     loginController
  //   )
  // )

  // 🔥 must be LAST
  app.use(errorMiddleware)

  return app
}
