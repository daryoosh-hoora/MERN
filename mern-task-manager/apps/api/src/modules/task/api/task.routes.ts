import { Router } from 'express'
import { TaskController } from './TaskController'
import { authMiddleware } from '@/presentation/http/middlewares/auth.middleware'
import { ITokenVerifier } from '@/shared/application/security/ITokenVerifier'
import { validate } from '@/presentation/http/middlewares/validate.middleware'
import { createTaskSchema, updateTaskSchema } from '@/presentation/http/validators/task.schemas'

export function createTaskRouter(
  controller: TaskController,
  tokenVerifier: ITokenVerifier
): Router {
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
    controller.getAll
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
