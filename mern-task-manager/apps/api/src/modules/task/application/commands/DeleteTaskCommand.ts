import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'

export class DeleteTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly requesterId: string,
    public readonly requesterRole: string
  ) {}
}

export class DeleteTaskCommandHandler {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
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
