import { TaskRepository } from '../../../domain/task/TaskRepository.js'
import { UpdateTaskCommand } from './UpdateTaskCommand.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js'

export class UpdateTaskHandler {
  constructor(
    private readonly taskRepository: TaskRepository
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
      // direct property update (domain currently has no method)
      // if you want strict DDD, add updateDescription() to entity
      ;(task as any).props.description = command.data.description
    }

    await this.taskRepository.update(task)
  }
}
