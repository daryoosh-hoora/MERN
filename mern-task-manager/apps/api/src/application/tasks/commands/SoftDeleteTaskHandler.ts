import { TaskRepository } from '../../../domain/task/TaskRepository.js'
import { SoftDeleteTaskCommand } from './SoftDeleteTaskCommand.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js'

export class SoftDeleteTaskHandler {
  constructor(
    private readonly taskRepository: TaskRepository
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

    task.softDelete()

    await this.taskRepository.update(task)
  }
}
