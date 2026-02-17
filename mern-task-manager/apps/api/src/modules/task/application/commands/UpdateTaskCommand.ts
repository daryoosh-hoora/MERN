import { ITaskRepository } from '../../domain/repositories/TaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'

export class UpdateTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly requesterId: string,
    public readonly requesterRole: string,
    public readonly data: {
      title?: string
      description?: string
      status?: TaskStatusEnum
    }
  ) {}
}

export class UpdateTaskCommandHandler {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(command: UpdateTaskCommand): Promise<void> {
    const task = await this.taskRepository.findById(command.taskId)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    const isOwner = task.ownerId === command.requesterId
    const isAdmin = command.requesterRole === 'admin'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError()
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
  }
}
