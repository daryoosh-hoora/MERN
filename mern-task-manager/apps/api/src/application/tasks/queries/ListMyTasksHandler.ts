import { TaskRepository } from '../../../domain/task/TaskRepository.js'
import { ListMyTasksQuery } from './ListMyTasksQuery.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'

export class ListMyTasksHandler {
  constructor(
    private readonly taskRepository: TaskRepository
  ) { }

  async execute(query: ListMyTasksQuery) {

    const [tasks, total] = await Promise.all([
      this.taskRepository.findByOwner(query.ownerId, {
        limit: query.limit,
        offset: query.offset,
        status: query.status,
        sort: query.sort
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
