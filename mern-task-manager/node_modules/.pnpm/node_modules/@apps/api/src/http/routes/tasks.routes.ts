import { Router } from 'express'
import { TaskController } from '../controllers/TaskController.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

export const tasksRouter = (
  controller: TaskController
) => {
  const router = Router()

  router.post(
    '/',
    authMiddleware,
    controller.create
  )

  return router
}
