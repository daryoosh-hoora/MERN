import { Request, Response } from 'express'
import { RegisterUserHandler } from '../../application/users/RegisterUserHandler'
import { UserAlreadyExistsError } from '../../application/users/RegisterUserErrors'
import { InvalidEmailError, WeakPasswordError } from '../../domain/user/UserErrors'

export class RegisterUserController {
  constructor(private readonly handler: RegisterUserHandler) {}

  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      await this.handler.execute({
        email,
        passwordHash: password
      })

      return res.status(201).send()
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return res.status(409).json({ message: error.message })
      }

      if (
        error instanceof InvalidEmailError ||
        error instanceof WeakPasswordError
      ) {
        return res.status(400).json({ message: error.message })
      }

      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
