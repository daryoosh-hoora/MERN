export interface IGetUserCredentialsDTO {
  id: string,
  email: string,
  passwordHash: string,
  role: string,
  isActive: boolean
}