import { TaskRepository } from '../../../domain/task/TaskRepository.js'
import { Task } from '../../../domain/task/Task.js'
import { CreateTaskCommand } from './CreateTaskCommand.js'
import { EventBus } from '../../../shared/application/EventBus.js'
import { randomUUID } from 'crypto'
export class CreateTaskHandler {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventBus: EventBus
  ) { }

  async execute(command: CreateTaskCommand): Promise<Task> {
    const task = Task.create({
      id: randomUUID(),
      title: command.data.title,
      description: command.data.description,
      ownerId: command.ownerId,
      status: 'do',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    })

    await this.taskRepository.save(task)

    await this.eventBus.publish(task.pullDomainEvents())

    return task
  }
}
