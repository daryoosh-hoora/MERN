import { Task } from '../../domain/entities/Task'
import { ITaskRepository } from '../../domain/repositories/TaskRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ForbiddenError } from '@/shared/errors/ForbiddenError'

export class ListMyTasksQuery {
  constructor(
    public readonly ownerId: string,
    public readonly limit: number,
    public readonly offset: number,
    public readonly status?: TaskStatusEnum,
    public readonly sortField?: string,
    public readonly sortDirection?: string    
  ) {}
}

export class ListMyTasksQueryHandler {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) { }

  async execute(query: ListMyTasksQuery) {
    const [tasks, total] = await Promise.all([
      this.taskRepository.findByOwner(query.ownerId, {
        limit: query.limit,
        offset: query.offset,
        status: query.status,
        sortField: query.sortField,
        sortDirection: query.sortDirection
      }),
      this.taskRepository.countByOwner(query.ownerId, query.status)
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
