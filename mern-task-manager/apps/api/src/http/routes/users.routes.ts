import { Router } from 'express'
import { GetUserByIdController } from '../controllers/GetUserByIdController.js'
import { ListUsersController } from '../controllers/ListUsersController.js'
import { UpdateUserController } from '../controllers/UpdateUserController.js'
import { SoftDeleteUserController } from '../controllers/SoftDeleteUserController.js'
import { authorize } from '../middlewares/authorize.middleware.js'
import { authorizeSelfOrAdmin } from '../middlewares/authorizeSelfOrAdmin.middleware.js'

export function createUsersRouter(
  getUserByIdController: GetUserByIdController,
  listUsersController: ListUsersController,
  updateUserController: UpdateUserController,
  softDeleteUserController: SoftDeleteUserController
) {
  const router = Router()

  router.get('/', (req, res) =>
    listUsersController.handle(req, res)
  )

  router.get('/:id', (req, res) =>
    getUserByIdController.handle(req, res)
  )

  router.put('/:id', (req, res) =>
    updateUserController.handle(req, res)
  )

  // admin only
  router.put(
    '/:id',
    authorize('admin'),
    (req, res) => updateUserController.handle(req, res)
  )

  router.put(
    '/:id',
    authorizeSelfOrAdmin(),
    (req, res) => updateUserController.handle(req, res)
  )

  router.delete(
    '/:id',
    authorize('admin'),
    (req, res) => softDeleteUserController.handle(req, res)
  )

  return router
}
