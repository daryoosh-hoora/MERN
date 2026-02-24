import { Request, Response, NextFunction } from 'express'

export function authorizeSelfOrAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.id === req.params.id) {
      return next()
    }

    return res.status(403).json({ message: 'Forbidden' })
  }
}
