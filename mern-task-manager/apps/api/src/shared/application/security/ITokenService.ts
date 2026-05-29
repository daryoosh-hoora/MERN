export interface ITokenService {
  generate(payload: {
    userId: string
    role: string // 'user' | 'admin' | 'guest'
  }): string
}
