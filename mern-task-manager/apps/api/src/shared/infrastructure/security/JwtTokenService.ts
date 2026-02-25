import jwt from 'jsonwebtoken'
import { ITokenService } from '@/shared/application/security/ITokenService'

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: jwt.SignOptions['expiresIn'] = '1h'
  ) {}

  generate(payload: { userId: string; role: 'user' | 'admin' }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    })
  }
}
