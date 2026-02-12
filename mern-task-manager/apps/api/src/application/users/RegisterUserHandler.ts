import { UserRepository } from '../../domain/user/UserRepository.js'
import { User } from '../../domain/user/User.js'
import { RegisterUserCommand } from './RegisterUserCommand.js'
import { UserAlreadyExistsError } from './RegisterUserErrors.js'
import { PasswordHasher } from '../security/PasswordHasher.js'

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
