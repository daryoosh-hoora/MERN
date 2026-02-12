import { Request, Response } from 'express'
import { SoftDeleteUserHandler } from '../../application/users/commands/SoftDeleteUserHandler.js'

export class SoftDeleteUserController {
  constructor(private readonly handler: SoftDeleteUserHandler) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.handler.execute({ id })

      return res.status(204).send()
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message })
      }

      return res.status(400).json({ message: error.message })
    }
  }
}
