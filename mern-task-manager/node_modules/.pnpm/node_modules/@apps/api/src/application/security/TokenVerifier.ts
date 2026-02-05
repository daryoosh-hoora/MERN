export interface TokenVerifier {
  verify(token: string): {
    userId: string
    role: 'user' | 'admin'
  }
}
