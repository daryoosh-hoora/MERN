import { TaskRepository } from '../../../domain/task/TaskRepository.js'
import { GetTaskByIdQuery } from './GetTaskByIdQuery.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js'

export class GetTaskByIdHandler {
  constructor(
    private readonly taskRepository: TaskRepository
  ) {}

  async execute(query: GetTaskByIdQuery) {
    const task = await this.taskRepository.findById(query.taskId)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    const isOwner = task.ownerId === query.requesterId
    const isAdmin = query.requesterRole === 'admin'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError()
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt
    }
  }
}
