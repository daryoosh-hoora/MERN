import { ICommand } from '@/shared/application/command-bus/ICommand'
import { IUserRepository } from '../ports/outbound/IUserRepository'
import { Result } from '@/shared/domain/Result'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'

export interface IDeleteUserRequestDTO {
  id: string
  permanently?: boolean
}

export class DeleteUserCommand
  implements ICommand<Result<void>> {

  constructor(
    public readonly data: IDeleteUserRequestDTO
  ) { }
}

export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, Result<void>> {
  constructor(
    private readonly userRepository: IUserRepository
  ) { }

  async execute(command: DeleteUserCommand): Promise<Result<void>> {
    const user = await this.userRepository.findById(command.data.id)

    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepository.delete(command.data.id, command.data.permanently)

    return Result.ok(void 0)
  }
}
