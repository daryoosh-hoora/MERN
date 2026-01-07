import { Router } from 'express'
import { GetUserByIdController } from '../controllers/GetUserByIdController.js'
import { ListUsersController } from '../controllers/ListUsersController.js'
import { UpdateUserController } from '../controllers/UpdateUserController.js'
import { SoftDeleteUserController } from '../controllers/SoftDeleteUserController.js'

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

  router.delete('/:id', (req, res) =>
    softDeleteUserController.handle(req, res)
  )

  return router
}
