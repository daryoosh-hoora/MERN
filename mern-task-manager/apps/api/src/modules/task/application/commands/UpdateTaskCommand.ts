import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'
import { Result } from '@/shared/domain/Result'
import { IUpdateTaskRequestDTO } from '../dto/IUpdateTaskRequestDTO'
import { IUpdateTaskResponseDTO } from '../dto/IUpdateTaskResponseDTO'
import { ErrorCodes } from '@/shared/application/ErrorCodes'
import { IEventBus } from '@/shared/application/IEventBus'
import { DomainEventDispatcher } from '@/shared/domain/DomainEventDispatcher'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { ICommand } from '@/shared/application/command-bus/ICommand'

export class UpdateTaskCommand
  implements ICommand<Result<IUpdateTaskResponseDTO>> {

  constructor(
    public readonly data: IUpdateTaskRequestDTO
  ) { }
}
export class UpdateTaskCommandHandler 
implements ICommandHandler<UpdateTaskCommand, Result<IUpdateTaskResponseDTO>> {

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly currentUser: ICurrentUserProvider
    // private readonly eventBus: IEventBus
  ) { }

  async execute(command: UpdateTaskCommand): Promise<Result<IUpdateTaskResponseDTO>> {
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
        message: 'Forbidden to update task'
      })
    }

    // Apply partial updates
    if (command.data.title !== undefined) {
      task.updateTitle(command.data.title)
    }

    if (command.data.status !== undefined) {
      task.updateStatus(command.data.status)
    }

    if (command.data.description !== undefined) {
      task.updateDescription(command.data.description!)
    }

    await this.taskRepository.update(task)

    await unitOfWork.registerAggregate(task)

    // await DomainEventDispatcher.dispatchAll(task.domainEvents)

    // task.clearDomainEvents()

    // await this.eventBus.publish(task.pullDomainEvents())

    return Result.ok({
      id: task.id,
      ownerId: task.ownerId,
      title: task.title.value,
      description: task.description?.value,
      status: task.status.value,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt!
    })
  }
}
