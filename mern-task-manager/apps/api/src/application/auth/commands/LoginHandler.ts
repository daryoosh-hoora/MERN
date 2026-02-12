import { UserRepository } from '../../../domain/user/UserRepository.js'
import { PasswordHasher } from '../../security/PasswordHasher.js'
import { TokenService } from '../../security/TokenService.js'
import { LoginCommand } from './LoginCommand.js'
import { InvalidCredentialsError } from './LoginErrors.js'

export class LoginHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(command: LoginCommand): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(command.email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isValid = await this.passwordHasher.compare(
      command.password,
      user.passwordHash
    )

    if (!isValid) {
      throw new InvalidCredentialsError()
    }
    
    const accessToken = this.tokenService.generate({
      userId: user.id,
      role: user.role
    })

    return { accessToken }
  }
}
