import { Router } from 'express'
import { UserController } from './UserController'
import { validate } from '@/presentation/http/middlewares/validate.middleware'
import { registerUserSchema, updateUserSchema } from '@/presentation/http/validators/user.schemas'
import { authorize } from '@/presentation/http/middlewares/authorize.middleware'
import { authorizeSelfOrAdmin } from '@/presentation/http/middlewares/authorizeSelfOrAdmin.middleware'
import { ITokenVerifier } from '@/shared/application/security/ITokenVerifier'
import { authMiddleware } from '@/presentation/http/middlewares/auth.middleware'

export function createUserRouter(
  controller: UserController,
    tokenVerifier: ITokenVerifier
): Router {
  const router = Router()

  router.post('/register',
    validate(registerUserSchema),
    (req, res) => controller.register(req, res)
  )

  router.put('/:id',
    authorizeSelfOrAdmin(),
    authMiddleware(tokenVerifier),
    validate(updateUserSchema),
    (req, res) => controller.update(req, res)
  )

  router.delete('/:id',
    authorize('admin'),
    (req, res) => controller.delete(req, res)
  )

  router.get('/',
    authorize('admin'),
    (req, res) => controller.getAll(req, res)
  )

  router.get('/:id',
    authorize('admin'),
    (req, res) => controller.getById(req, res)
  )

  router.get('/:email',
    authorize('admin'),
    (req, res) => controller.getByEmail(req, res)
  )

  return router
}
