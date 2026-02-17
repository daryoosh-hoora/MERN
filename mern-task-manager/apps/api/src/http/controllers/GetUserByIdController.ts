import { Request, Response } from 'express'
import { GetUserByIdHandler } from '../../application/users/queries/GetUserByIdHandler'

export class GetUserByIdController {
  constructor(private readonly handler: GetUserByIdHandler) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params

    const user = await this.handler.execute(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  }
}
