export interface TokenService {
  generate(payload: {
    userId: string
    role: 'user' | 'admin'
  }): string
}
