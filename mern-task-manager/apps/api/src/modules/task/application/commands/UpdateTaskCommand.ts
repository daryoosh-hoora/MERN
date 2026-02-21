import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'
import { Result } from '@/shared/domain/Result'
import { IUpdateTaskResponseDTO } from '../dto/IUpdateTaskResponseDTO'
import { ErrorCodes } from '@/shared/application/ErrorCodes'
import { IEventBus } from '@/shared/application/IEventBus'
import { DomainEventDispatcher } from '@/shared/domain/DomainEventDispatcher'

export class UpdateTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly requesterRole: string,
    public readonly data: {
      title?: string
      description?: string
      status?: TaskStatusEnum
    }
  ) { }
}

export class UpdateTaskCommandHandler {
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

    const task = await this.taskRepository.findById(command.taskId)

    if (!task) {
      return Result.fail({
        code: ErrorCodes.NOT_FOUND,
        message: 'Task not found'
      })
    }

    const isAdmin = command.requesterRole === 'admin'

    if (!task.isOwnedBy(userId) && !isAdmin) {
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

    await DomainEventDispatcher.dispatchAll(task.domainEvents)

    task.clearDomainEvents()

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
