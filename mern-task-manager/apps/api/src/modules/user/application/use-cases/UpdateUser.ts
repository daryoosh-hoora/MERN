import { IUserRepository } from '../ports/outbound/IUserRepository'
import { IUserResponseDTO } from '@/modules/user/application/dto/IUserResponseDTO'
import { Result } from '@/shared/domain/Result'
import { ICommand } from '@/shared/application/command-bus/ICommand'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { ErrorCodes } from '@/shared/application/ErrorCodes'

// types
export interface IUpdateUserRequestDTO {
  id: string
  email?: string
  role?: 'user' | 'admin' | 'guest'  //UserRoleEnum
}

export class UpdateUserCommand
  implements ICommand<Result<IUserResponseDTO>> {

  constructor(
    public readonly data: IUpdateUserRequestDTO
  ) { }
}

export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, Result<IUserResponseDTO>> {

  constructor(
    private readonly userRepository: IUserRepository
  ) { }

  async execute(command: UpdateUserCommand): Promise<Result<IUserResponseDTO>> {
    const user = await this.userRepository.findById(command.data.id)

    if (!user) {
      return Result.fail({
        code: ErrorCodes.NOT_FOUND,
        message: 'User not found'
      })
    }

    if (command.data.email) {
      user.updateEmail(command.data.email)
    }

    if (command.data.role) {
      user.updateRole(command.data.role)
    }

    await this.userRepository.update(user)

    return Result.ok({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined
    })
  }
}
