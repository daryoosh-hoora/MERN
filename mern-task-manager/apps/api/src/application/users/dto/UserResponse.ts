export type UserResponse = {
  id: string
  email: string
  role: 'user' | 'admin'
  createdAt: Date
}
