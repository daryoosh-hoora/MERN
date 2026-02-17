import { Request, Response, NextFunction } from 'express'
import { TokenVerifier } from '../../application/security/TokenVerifier'
import { RequestContext } from '@/shared/infrastructure/RequestContext'

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

      // 🧪 test mode
      if (process.env.NODE_ENV === 'test') {
        const testUser = { id: 'test-user', role: 'user' }
        req.user = testUser

        RequestContext.setUserId(testUser.id)

        return next()
      }

      const token = authHeader.split(' ')[1]

      const payload = await tokenVerifier.verify(token)

      const user = {
        id: payload.userId,
        role: payload.role
      }

      req.user = user

      // 🔥 THIS IS THE IMPORTANT LINE
      RequestContext.setUserId(user.id)

      next()
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}
