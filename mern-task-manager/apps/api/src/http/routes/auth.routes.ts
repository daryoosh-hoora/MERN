import { Router } from 'express'
import { LoginController } from '../controllers/LoginController.js'
import { RegisterUserController } from '../controllers/RegisterUserController.js'

export function createAuthRouter(
  registerUserController: RegisterUserController,
  loginController: LoginController
) {
  const router = Router()

  router.post('/register', (req, res) =>
    registerUserController.handle(req, res)
  )

  router.post('/login', (req, res) =>
    loginController.handle(req, res)
  )

  return router
}
