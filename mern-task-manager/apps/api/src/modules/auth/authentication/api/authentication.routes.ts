import { Router } from 'express'
import { AuthenticationController } from './AuthenticationController'
import { UserController } from '../../../user/api/UserController'

export function createAuthenticationRouter(
  // userController: UserController,
  authenticationController: AuthenticationController
) {
  const router = Router()

  // router.post('/register', (req, res) =>
  //   userController.register(req, res)
  // )

  router.post('/login', (req, res) =>
    authenticationController.login(req, res)
  )

  return router
}
