import { Task } from '../../domain/entities/Task'
import { CreateTaskDTO } from '../dto/CreateTaskDTO'
import { ITaskRepository } from '../../domain/repositories/TaskRepository'
import { IEventBus } from '@/shared/application/EventBus'
import { ICurrentUserProvider } from '@/shared/application/CurrentUserProvider'

export class CreateTaskCommand {
  constructor(
    public readonly userId: string,
    public readonly data: CreateTaskDTO
  ) {}
}

export class CreateTaskCommandHandler {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly currentUser: ICurrentUserProvider,
    private readonly eventBus: IEventBus
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const userId = this.currentUser.getUserId()
    if (!userId) throw new Error('Unauthorized')

    const task = Task.create(userId, command.data.title, command.data.description!)

    await this.taskRepository.save(task)

    await this.eventBus.publish(task.pullDomainEvents())

    return task
  }
}
