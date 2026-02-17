import { Task } from '../../domain/entities/Task'
import { ITaskRepository } from '../../domain/repositories/TaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'

export class GetTaskByIdQuery {
  constructor(
    public readonly taskId: string,
    public readonly requesterId: string,
    public readonly requesterRole: string
  ) {}
}

export class GetTaskByIdQueryHandler {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(query: GetTaskByIdQuery): Promise<Task | null> {
    const task = await this.taskRepository.findById(query.taskId)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    const isOwner = task.ownerId === query.requesterId
    const isAdmin = query.requesterRole === 'admin'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError()
    }

    return task
  }
}
