export interface ITokenService {
  generate(payload: {
    userId: string
    role: 'user' | 'admin'
  }): string
}
