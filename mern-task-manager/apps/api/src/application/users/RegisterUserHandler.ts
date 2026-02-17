import { UserRepository } from '../../domain/user/UserRepository'
import { User } from '../../domain/user/User'
import { RegisterUserCommand } from './RegisterUserCommand'
import { UserAlreadyExistsError } from './RegisterUserErrors'
import { PasswordHasher } from '../security/PasswordHasher'

export class RegisterUserHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const existing = await this.userRepository.findByEmail(command.email)

    if (existing) {
      throw new UserAlreadyExistsError(command.email)
    }

    const passwordHash = await this.passwordHasher.hash(command.passwordHash)

    const user = User.create({
      id: crypto.randomUUID(),
      email: command.email,
      passwordHash
    })

    await this.userRepository.save(user)
  }
}
