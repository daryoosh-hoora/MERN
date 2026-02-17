import jwt from 'jsonwebtoken'
import { TokenService } from '../../application/security/TokenService'

export class JwtTokenService implements TokenService {
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
