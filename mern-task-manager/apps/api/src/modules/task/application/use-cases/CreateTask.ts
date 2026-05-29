import { Task } from '../../domain/entities/Task'
import { ITaskRepository } from '../ports/outbound/ITaskRepository'
import { IEventBus } from '@/shared/application/IEventBus'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'
import { Result } from '@/shared/domain/Result'
import { ErrorCodes } from '@/shared/application/ErrorCodes'
import { DomainEventDispatcher } from '@/shared/domain/DomainEventDispatcher'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { ICommand } from '@/shared/application/command-bus/ICommand'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'

export interface ICreateTaskRequestDTO {
  title: string
  description?: string
}

export interface ICreateTaskResponseDTO {
  id: UniqueEntityId
  ownerId: string
  title: string
  description?: string | null
  status: string
  isActive: boolean
  createdAt: Date
  updatesAt: Date
  deletedAt?: Date | null
}

export class CreateTaskCommand
  implements ICommand<Result<ICreateTaskResponseDTO>> {

  constructor(
    public readonly data: ICreateTaskRequestDTO
  ) { }
}

export class CreateTaskCommandHandler
  implements ICommandHandler<CreateTaskCommand, Result<ICreateTaskResponseDTO>> {

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly currentUser: ICurrentUserProvider
    // private readonly eventBus: IEventBus
  ) { }

  async execute(command: CreateTaskCommand): Promise<Result<ICreateTaskResponseDTO>> {
    const userId = this.currentUser.getUserId()

    if (!userId) {
      return Result.fail({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'User not authenticated'
      })
    }

    const result = Task.create(userId, command.data.title, command.data.description!)

    if (result.isFailure) {
      return Result.fail(result.error!)
    }

    const task = result.value

    await this.taskRepository.save(task)

    //await unitOfWork.registerAggregate(task)
    // await DomainEventDispatcher.dispatchAll(task.domainEvents)

    // task.clearDomainEvents()

    //await this.eventBus.publish(task.domainEvents)

    return Result.ok({
      id: task.id,
      ownerId: task.ownerId,
      title: task.title.value,
      description: task.description?.value,
      status: task.status.value,
      isActive: task.isActive,
      createdAt: task.createdAt,
      updatesAt: task.updatedAt,
      deletedAt: task.deletedAt ?? undefined
    })
  }
}
