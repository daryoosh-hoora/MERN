import { Request, Response } from 'express'
import { LoginHandler } from '../../application/auth/commands/LoginHandler'

export class LoginController {
  constructor(private readonly handler: LoginHandler) { }

  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' })
      }

      const result = await this.handler.execute({ email, password })

      return res.status(200).json(result)
    } catch {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  }
}
