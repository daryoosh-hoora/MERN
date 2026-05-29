import { Request, Response } from 'express'
import { IAuthenticationApplicationService } from '../application/ports/inbound/IAuthenticationApplicationService'

export class AuthenticationController {
  constructor(
    private readonly authenticationApplicationService: IAuthenticationApplicationService
  ) { }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' })
      }

      const result = await this.authenticationApplicationService.login({
        email: email,
        password: password
      })

      if (result.isFailure) {
        throw new Error(result.error?.message)
      }

      return res.status(200).json(result)
    } catch {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  }
}
