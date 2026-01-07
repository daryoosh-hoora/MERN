import { Request, Response } from 'express'
import { UpdateUserHandler } from '../../application/users/commands/UpdateUserHandler.js'

export class UpdateUserController {
  constructor(private readonly handler: UpdateUserHandler) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { email, role } = req.body

      const result = await this.handler.execute({
        id,
        email,
        role
      })

      return res.status(200).json(result)
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message })
      }

      return res.status(400).json({ message: error.message })
    }
  }
}
