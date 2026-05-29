import { User } from '../../domain/entities/User'
import { IUserRepository } from '../ports/outbound/IUserRepository'
import { IPasswordHasher } from '@/shared/application/security/IPasswordHasher'
import { Result } from '@/shared/domain/Result'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { ICommand } from '@/shared/application/command-bus/ICommand'
import { IUserResponseDTO } from '@/modules/user/application/dto/IUserResponseDTO'

// types
export interface IRegisterUserRequestDTO {
  email: string
  password: string
  role?: string
}

export class RegisterUserCommand
  implements ICommand<Result<IUserResponseDTO>> {

  constructor(
    public readonly data: IRegisterUserRequestDTO
  ) { }
}

export class RegisterUserHandler 
implements ICommandHandler<RegisterUserCommand, Result<IUserResponseDTO>> {

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) { }

  async execute(command: RegisterUserCommand): Promise<Result<IUserResponseDTO>> {
    const existing = await this.userRepository.findByEmail(command.data.email)

    if (existing) {
      throw new UserAlreadyExistsError(command.data.email)
    }

    const passwordHash = await this.passwordHasher.hash(command.data.password)

    const result = User.create(
      command.data.email,
      passwordHash,
      command.data.role ?? 'user'
    )

    if (result.isFailure) {
      return Result.fail(result.error!)
    }

    const user = result.value

    await this.userRepository.save(user)

    return Result.ok({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatesAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined
    })
  }
}

// errors
export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User already exists with email: ${email}`)
  }
}
