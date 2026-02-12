import { Request, Response } from 'express'
import { ListUsersHandler } from '../../application/users/queries/ListUsersHandler.js'

export class ListUsersController {
  constructor(private readonly handler: ListUsersHandler) {}

  async handle(req: Request, res: Response) {
    const limit = req.query.limit
      ? Number(req.query.limit)
      : undefined

    const offset = req.query.offset
      ? Number(req.query.offset)
      : undefined

    const users = await this.handler.execute({
      limit,
      offset
    })

    return res.status(200).json(users)
  }
}
