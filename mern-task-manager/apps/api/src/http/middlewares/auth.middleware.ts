import { Request, Response, NextFunction } from 'express'
import { TokenVerifier } from '../../application/security/TokenVerifier.js'

export const authMiddleware = (
  tokenVerifier: TokenVerifier
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const token = authHeader.split(' ')[1]

      const payload = await tokenVerifier.verify(token)
      req.user = {
        id: payload.userId,
        role: payload.role
      }
      
      next()
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

