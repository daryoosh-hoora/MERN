import { Task } from '../../domain/entities/Task'
import { IQuery } from '@/shared/application/query-bus/IQuery'
import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'
import { IQueryHandler } from '@/shared/application/query-bus/IQueryHandler'
import { IGetTaskByIdResponseDTO } from '../dto/IGetTaskByIdResponseDTO'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'
export class GetTaskByIdQuery implements IQuery<IGetTaskByIdResponseDTO> {
  constructor(
    public readonly taskId: string,
    public readonly requesterRole: string
  ) { }
}

export class GetTaskByIdQueryHandler
  implements IQueryHandler<GetTaskByIdQuery, IGetTaskByIdResponseDTO> {

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly currentUser: ICurrentUserProvider
  ) { }

  async execute(query: GetTaskByIdQuery): Promise<IGetTaskByIdResponseDTO> {
    const userId = this.currentUser.getUserId()

    if (!userId) {
      throw new ForbiddenError()
    }

    const task = await this.taskRepository.findById(query.taskId)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    const isAdmin = query.requesterRole === 'admin'

    if (!task.isOwnedBy(userId) && !isAdmin) {
      throw new ForbiddenError()
    }

    return {
      id: task.id.toString(),
      title: task.title.value,
      description: task.description?.value ?? undefined,
      status: task.status.value,
      ownerId: task.ownerId,
      isActive: task.isActive,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deletedAt: task.deletedAt ?? undefined
    }
  }
}
