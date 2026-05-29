import { IGetUserCredentialsDTO } from '@/shared/application/dto/IGetUserCredentialsDTO'

export interface IUserExternalService {
  getUserCredentials(input: { 
    email: string 
  }): Promise<IGetUserCredentialsDTO>
}
