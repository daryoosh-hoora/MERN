import { Request, Response } from 'express'
import { UserAlreadyExistsError } from '../application/use-cases/RegisterUser'
import { IUserApplicationService } from '../application/ports/inbound/IUserApplicationService'
import { UserRoleEnum } from '../infrastructure/adapters/UserApplicationService'
import { GetAllUsersQuery } from '../application/use-cases/GetAllUsers'
import { ErrorCodes } from '@/shared/application/ErrorCodes'

export class UserController {
  constructor(
    private readonly userApplicationService: IUserApplicationService
  ) { }

  async register(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body

      const result = await this.userApplicationService.registerUser({
        email: email,
        password: password,
        role: role!
      })

      // if (result.isFailure) {
      //   switch (result.error?.code) {
      //     case ErrorCodes.UNAUTHORIZED:
      //       return res.status(401).json(result.error)

      //     case ErrorCodes.VALIDATION_ERROR:
      //       return res.status(400).json(result.error)

      //     default:
      //       return res.status(400).json(result.error)
      //   }
      // }

      return res.status(201).send()
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return res.status(409).json({ message: error.message })
      }

      // if (
      //   error instanceof InvalidEmailError ||
      //   error instanceof WeakPasswordError
      // ) {
      //   return res.status(400).json({ message: error.message })
      // }

      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update(req: Request, res: Response) {
    const result = await this.userApplicationService.updateUser({
      id: req.params.id,
      email: req.body.email,
      role: req.body.role
    })

    if (result.isFailure) {
      switch (result.error?.code) {
        case ErrorCodes.UNAUTHORIZED:
          return res.status(401).json(result.error)

        case ErrorCodes.VALIDATION_ERROR:
          return res.status(400).json(result.error)

        default:
          return res.status(400).json(result.error)
      }
    }

    res.json({ message: 'User updated' })
  }

  async delete(req: Request, res: Response) {
    const result = await this.userApplicationService.deleteUser({
      id: req.params.id,
      permanently: req.body.permanently ?? false
    })

    if (result.isFailure) {
      switch (result.error?.code) {
        case ErrorCodes.UNAUTHORIZED:
          return res.status(401).json(result.error)

        case ErrorCodes.VALIDATION_ERROR:
          return res.status(400).json(result.error)

        default:
          return res.status(400).json(result.error)
      }
    }

    res.status(204).send()
  }

  async getAll(req: Request, res: Response) {
    const limit = Math.min(Number(req.query.limit) || 10, 100)
    const offset = Number(req.query.offset) || 0

    const status = req.query.role as UserRoleEnum | undefined
    const sortParam = req.query.sort as string | undefined

    let sortField: 'createdAt' | 'role' | undefined
    let sortDirection: 'asc' | 'desc' | undefined

    if (sortParam) {
      const [field, direction] = sortParam.split('_')

      if (['createdAt', 'status'].includes(field)) {
        sortField = field as any
        sortDirection = direction === 'asc' ? 'asc' : 'desc'
      }
    }

    const query = new GetAllUsersQuery(
      limit,
      offset,
      status,
      sortField,
      sortDirection
    )

    const users = await this.userApplicationService.getAllUsers(query)

    return res.status(200).json(users)
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params

    const user = await this.userApplicationService.getUserById({
      id: id
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  }

  async getByEmail(req: Request, res: Response) {
    const { email } = req.params

    const user = await this.userApplicationService.getUserByEmail({
      email: email
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  }
}
