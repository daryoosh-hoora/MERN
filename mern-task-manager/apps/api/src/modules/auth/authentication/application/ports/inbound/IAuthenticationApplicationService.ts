import { Result } from '@/shared/domain/Result'
import { ILoginResponseDTO } from '../../use-cases/Login'

export interface IAuthenticationApplicationService {
  login(input: {
    email: string
    password: string
  }): Promise<Result<ILoginResponseDTO>>

  logout(): Promise<Result<void>>
}
