import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { ICommand } from '@/shared/application/command-bus/ICommand'
import { Result } from '@/shared/domain/Result'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'
import { ErrorCodes } from '@/shared/application/ErrorCodes'
import { IDeleteTaskRequestDTO } from '../dto/IDeleteTaskRequestDTO'

export class DeleteTaskCommand
  implements ICommand<Result<void>> {

  constructor(
    public readonly data: IDeleteTaskRequestDTO
  ) { }
}

export class DeleteTaskCommandHandler
  implements ICommandHandler<DeleteTaskCommand, Result<void>> {

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly currentUser: ICurrentUserProvider
  ) { }

  async execute(command: DeleteTaskCommand): Promise<Result<void>> {
    const userId = this.currentUser.getUserId()

    if (!userId) {
      return Result.fail({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'User not authenticated'
      })
    }

    const task = await this.taskRepository.findById(command.data.taskId)

    if (!task) {
      return Result.fail({
        code: ErrorCodes.NOT_FOUND,
        message: 'Task not found'
      })
    }

    if (!task.isOwnedBy(userId)) {
      return Result.fail({
        code: ErrorCodes.FORBIDDEN,
        message: 'User does not own this task'
      })
    }

    task.delete()

    await this.taskRepository.update(task)

    return Result.ok(void 0)
  }
}
