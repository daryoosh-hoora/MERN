export interface ITokenVerifier {
  verify(token: string): {
    userId: string
    role: 'user' | 'admin'
  }
}
