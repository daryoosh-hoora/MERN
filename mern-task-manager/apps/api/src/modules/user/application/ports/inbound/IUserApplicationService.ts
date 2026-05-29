import { Result } from '@/shared/domain/Result'
import { IApplicationService } from '@/shared/application/IApplicationService'
import { IUserResponseDTO } from '@/modules/user/application/dto/IUserResponseDTO'
import { IGetUserCredentialsDTO } from '@/shared/application/dto/IGetUserCredentialsDTO'

export interface IUserApplicationService extends IApplicationService {
  registerUser(input: {
    email: string
    password: string
    role?: string
  }): Promise<Result<IUserResponseDTO>>

  updateUser(input: {
    id: string
    email?: string
    role?: string
  }): Promise<Result<IUserResponseDTO>>

  deleteUser(input: {
    id: string
    permanently?: boolean
  }): Promise<Result<void>>
 
  getUserById(input: {
    id: string
  }): Promise<IUserResponseDTO>
  
  getUserByEmail(input: {
    email: string
  }): Promise<IUserResponseDTO>
  
  getAllUsers(input: {
    limit?: number
    offset?: number
    role?: string
    sortField?: string
    sortDirection?: string
  }): Promise<IUserResponseDTO[]>

  getUserCredentials(input: {
    email: string
  }): Promise<IGetUserCredentialsDTO>
}
