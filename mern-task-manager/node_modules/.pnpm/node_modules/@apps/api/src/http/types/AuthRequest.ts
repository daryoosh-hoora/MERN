export type AuthUser = {
  id: string
  role: 'user' | 'admin'
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
