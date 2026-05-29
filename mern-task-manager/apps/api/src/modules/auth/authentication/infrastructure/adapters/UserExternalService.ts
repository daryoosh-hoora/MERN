import { createUserModule } from '@/modules/user'
import { IUserExternalService } from '../../application/ports/inbound/IUserExternalService'
import { IGetUserCredentialsDTO } from '@/shared/application/dto/IGetUserCredentialsDTO'

export class UserExternalService implements IUserExternalService {
  getUserCredentials(input: { 
    email: string 
  }): Promise<IGetUserCredentialsDTO> {
    const userModule = createUserModule()

    return userModule.applicationService.getUserCredentials({ 
      email: input.email 
    })
  }
}
