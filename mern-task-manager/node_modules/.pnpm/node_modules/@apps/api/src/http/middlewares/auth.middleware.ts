import { Request, Response, NextFunction } from 'express'
import { TokenVerifier } from '../../application/security/TokenVerifier.js'

export function authMiddleware(tokenVerifier: TokenVerifier) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' })
    }

    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid authorization format' })
    }

    try {
      const payload = tokenVerifier.verify(token)

      req.user = {
        id: payload.userId,
        role: payload.role
      }

      next()
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}
