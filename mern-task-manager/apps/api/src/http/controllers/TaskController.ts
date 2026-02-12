import { Request, Response } from 'express'
import { CreateTaskHandler } from '../../application/tasks/commands/CreateTaskHandler.js'
import { CreateTaskCommand } from '../../application/tasks/commands/CreateTaskCommand.js'
import { ListMyTasksHandler } from '../../application/tasks/queries/ListMyTasksHandler.js'
import { ListMyTasksQuery } from '../../application/tasks/queries/ListMyTasksQuery.js'
import { GetTaskByIdHandler } from '../../application/tasks/queries/GetTaskByIdHandler.js'
import { GetTaskByIdQuery } from '../../application/tasks/queries/GetTaskByIdQuery.js'
import { UpdateTaskHandler } from '../../application/tasks/commands/UpdateTaskHandler.js'
import { UpdateTaskCommand } from '../../application/tasks/commands/UpdateTaskCommand.js'
import { SoftDeleteTaskHandler } from '../../application/tasks/commands/SoftDeleteTaskHandler.js'
import { SoftDeleteTaskCommand } from '../../application/tasks/commands/SoftDeleteTaskCommand.js'
export class TaskController {
  constructor(
    private readonly createTaskHandler: CreateTaskHandler,
    private readonly listMyTasksHandler: ListMyTasksHandler,
    private readonly getTaskByIdHandler: GetTaskByIdHandler,
    private readonly updateTaskHandler: UpdateTaskHandler,
    private readonly softDeleteTaskHandler: SoftDeleteTaskHandler
  ) { }

  create = async (req: Request, res: Response) => {
    const userId = req.user!.id

    const command = new CreateTaskCommand(userId, {
      title: req.body.title,
      description: req.body.description
    })

    await this.createTaskHandler.execute(command)

    res.status(201).json({ message: 'Task created' })
  }

  listMyTasks = async (req: Request, res: Response) => {
    const ownerId = req.user!.id

    const limit = Math.min(Number(req.query.limit) || 10, 100)
    const offset = Number(req.query.offset) || 0

    const status = req.query.status as string | undefined
    const sortParam  = req.query.sort as string | undefined

    let sortField: 'createdAt' | 'status' | undefined
    let sortDirection: 'asc' | 'desc' | undefined

    if (sortParam ) {
      const [field, direction] = sortParam .split('_')

      if (['createdAt', 'status'].includes(field)) {
        sortField = field as any
        sortDirection = direction === 'asc' ? 'asc' : 'desc'
      }
    }

    const query = new ListMyTasksQuery(
      ownerId,
      limit,
      offset,
      status,
      sortField,
      sortDirection
    )

    const tasks = await this.listMyTasksHandler.execute(query)

    res.json(tasks)
  }

  // async listMyTasks(req: Request, res: Response) {
  //   const ownerId = req.user!.id

  //   const limit = Number(req.query.limit) || 10
  //   const offset = Number(req.query.offset) || 0

  //   const result = await this.listMyTasksHandler.execute(
  //     new ListMyTasksQuery(ownerId, limit, offset)
  //   )

  //   res.json(result)
  // }


  getById = async (req: Request, res: Response) => {
    const query = new GetTaskByIdQuery(
      req.params.id,
      req.user!.id,
      req.user!.role
    )

    const task = await this.getTaskByIdHandler.execute(query)

    res.json(task)
  }

  update = async (req: Request, res: Response) => {
    const command = new UpdateTaskCommand(
      req.params.id,
      req.user!.id,
      req.user!.role,
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
      }
    )

    await this.updateTaskHandler.execute(command)

    res.json({ message: 'Task updated' })
  }

  delete = async (req: Request, res: Response) => {
    const command = new SoftDeleteTaskCommand(
      req.params.id,
      req.user!.id,
      req.user!.role
    )

    await this.softDeleteTaskHandler.execute(command)

    res.status(204).send()
  }
}
