import { ITaskRepository } from '../../domain/repositories/TaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'

export class SoftDeleteTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly requesterId: string,
    public readonly requesterRole: string
  ) {}
}

export class SoftDeleteTaskCommandHandler {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(command: SoftDeleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.findById(command.taskId)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    const isOwner = task.ownerId === command.requesterId
    const isAdmin = command.requesterRole === 'admin'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError()
    }

    task.delete()

    await this.taskRepository.update(task)
  }
}
