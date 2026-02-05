import jwt from 'jsonwebtoken'
import { TokenVerifier } from '../../application/security/TokenVerifier.js'

export class JwtTokenVerifier implements TokenVerifier {
  constructor(private readonly secret: string) {}

  verify(token: string): {
    userId: string
    role: 'user' | 'admin'
  } {
    const decoded = jwt.verify(token, this.secret)

    if (typeof decoded !== 'object' || !decoded) {
      throw new Error('Invalid token')
    }

    return {
      userId: decoded.userId as string,
      role: decoded.role as 'user' | 'admin'
    }
  }
}
