import { Router } from 'express'
import { TaskController } from '../controllers/TaskController.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { TokenVerifier } from '../../application/security/TokenVerifier.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createTaskSchema, updateTaskSchema } from '../validators/task.schemas.js'

export const tasksRouter = (
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
