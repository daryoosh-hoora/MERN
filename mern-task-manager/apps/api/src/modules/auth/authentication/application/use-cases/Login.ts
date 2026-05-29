import { Result } from '@/shared/domain/Result'
import { IPasswordHasher } from '@/shared/application/security/IPasswordHasher'
import { ITokenService } from '@/shared/application/security/ITokenService'
import { ICommand } from '@/shared/application/command-bus/ICommand'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { IUserExternalService } from '../ports/inbound/IUserExternalService'

// types
export interface ILoginRequestDTO {
  email: string
  password: string
}

export interface ILoginResponseDTO {
  token: string
}

export class LoginCommand
  implements ICommand<Result<ILoginResponseDTO>> {

  constructor(
    public readonly data: ILoginRequestDTO
  ) { }
}

export class LoginHandler 
implements ICommandHandler<LoginCommand, Result<ILoginResponseDTO>> {

  constructor(
    private readonly userExternalService: IUserExternalService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) { }

  async execute(command: LoginCommand): Promise<Result<ILoginResponseDTO>> {
    const user = await this.userExternalService.getUserCredentials({ 
      email: command.data.email 
    })
    if (!user) {
      throw new InvalidUserError()
    }

    if (!user.isActive) {
      throw new InvalidUserError()
    }

    const isValid = await this.passwordHasher.compare(
      command.data.password,
      user.passwordHash
    )

    if (!isValid) {
      throw new InvalidCredentialsError()
    }
    
    const accessToken = this.tokenService.generate({
      userId: user.id,
      role: user.role
    })

    return Result.ok({
      token: accessToken
    })
  }
}

// errors
class InvalidUserError extends Error {
  constructor() {
    super('Invalid user')
  }
}

class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials')
  }
}
