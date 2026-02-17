import { Router } from 'express'
import { TaskController } from './TaskController'
import { authMiddleware } from '@/http/middlewares/auth.middleware'
import { TokenVerifier } from '@/shared/application/security/TokenVerifier'
import { validate } from '@/http/middlewares/validate.middleware'
import { createTaskSchema, updateTaskSchema } from '@/http/validators/task.schemas'

export const taskRouters = (
  controller: TaskController,
  tokenVerifier: TokenVerifier
) => {
  const router = Router()

  router.post(
    '/',
    authMiddleware(tokenVerifier),
    validate(createTaskSchema),
    controller.create
  )

  router.get(
    '/',
    authMiddleware(tokenVerifier),
    controller.listMyTasks
  )

  router.get(
    '/:id',
    authMiddleware(tokenVerifier),
    controller.getById
  )

  router.put(
    '/:id',
    authMiddleware(tokenVerifier),
    validate(updateTaskSchema),
    controller.update
  )

  router.delete(
    '/:id',
    authMiddleware(tokenVerifier),
    controller.delete
  )

  return router
}
