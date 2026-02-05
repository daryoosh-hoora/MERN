import { Request, Response } from 'express'
import { CreateTaskHandler } from '../../application/tasks/commands/CreateTaskHandler.js'
import { CreateTaskCommand } from '../../application/tasks/commands/CreateTaskCommand.js'

export class TaskController {
  constructor(
    private readonly createTaskHandler: CreateTaskHandler
  ) {}

  create = async (req: Request, res: Response) => {
    const userId = req.user!.id

    const command = new CreateTaskCommand(userId, {
      title: req.body.title,
      description: req.body.description
    })

    await this.createTaskHandler.execute(command)

    res.status(201).json({ message: 'Task created' })
  }
}
