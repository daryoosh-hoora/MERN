import { Router } from 'express'
import { RegisterUserController } from '../controllers/RegisterUserController.js'

export function createAuthRouter(
  registerUserController: RegisterUserController
) {
  const router = Router()

  router.post('/register', (req, res) =>
    registerUserController.handle(req, res)
  )

  return router
}
