import { ITaskRepository } from '../ports/outbound/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'
import { IQuery } from '@/shared/application/query-bus/IQuery'
import { IQueryHandler } from '@/shared/application/query-bus/IQueryHandler'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'
import { IGetTaskByIdResponseDTO } from '../dto/IGetTaskResponseDTO'

export class GetTaskByIdQuery implements IQuery<IGetTaskByIdResponseDTO> {
  constructor(
    public readonly taskId: string
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

    if (!task.isOwnedBy(userId)) {
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
