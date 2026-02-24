import { Task } from '../../domain/entities/Task'
import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'
import { ICurrentUserProvider } from '@/shared/application/ICurrentUserProvider'

export class GetAllTasksQuery {
  constructor(
    public readonly limit: number,
    public readonly offset: number,
    public readonly status?: TaskStatusEnum,
    public readonly sortField?: string,
    public readonly sortDirection?: string    
  ) {}
}

export class GetAllTasksQueryHandler {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly currentUser: ICurrentUserProvider
  ) { }

  async execute(query: GetAllTasksQuery) {
    const userId = this.currentUser.getUserId()

    if (!userId) {
      throw new ForbiddenError()
    }

    const [tasks, total] = await Promise.all([
      this.taskRepository.findByOwner(userId, {
        limit: query.limit,
        offset: query.offset,
        status: query.status,
        sortField: query.sortField,
        sortDirection: query.sortDirection
      }),
      this.taskRepository.countByOwner(userId, query.status)
    ])

    return {
      data: tasks,
      meta: {
        total,
        limit: query.limit,
        offset: query.offset
      }
    }
  }

}
