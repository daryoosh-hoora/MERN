export type UpdateUserCommand = {
  id: string
  email?: string
  role?: 'user' | 'admin'
}
