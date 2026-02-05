import { TaskRepository } from '../../../domain/task/TaskRepository.js'
import { Task } from '../../../domain/task/Task.js'
import { CreateTaskCommand } from './CreateTaskCommand.js'

export class CreateTaskHandler {
  constructor(
    private readonly taskRepository: TaskRepository
  ) {}

  async execute(command: CreateTaskCommand): Promise<void> {
    const task = Task.create({
      title: command.data.title,
      description: command.data.description,
      ownerId: command.ownerId
    })

    await this.taskRepository.save(task)
  }
}
