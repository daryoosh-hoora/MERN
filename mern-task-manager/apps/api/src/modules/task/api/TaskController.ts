import { Request, Response } from 'express'

import { CreateTaskCommand, CreateTaskCommandHandler } from '../application/commands/CreateTaskCommand'
import { UpdateTaskCommand, UpdateTaskCommandHandler } from '../application/commands/UpdateTaskCommand'
import { SoftDeleteTaskCommand, SoftDeleteTaskCommandHandler } from '../application/commands/SoftDeleteTaskCommand'

import { ListMyTasksQuery, ListMyTasksQueryHandler } from '../application/queries/ListMyTasksQuery'
import { GetTaskByIdQuery, GetTaskByIdQueryHandler } from '../application/queries/GetTaskByIdQuery'

export class TaskController {
  constructor(
    private readonly createTaskCommandHandler: CreateTaskCommandHandler,
    private readonly updateTaskCommandHandler: UpdateTaskCommandHandler,
    private readonly softDeleteTaskCommandHandler: SoftDeleteTaskCommandHandler,
    private readonly listMyTasksQueryHandler: ListMyTasksQueryHandler,
    private readonly getTaskByIdQueryHandler: GetTaskByIdQueryHandler,
  ) {}

  create = async (req: Request, res: Response) => {
    const userId = req.user!.id

    const command = new CreateTaskCommand(userId, {
      title: req.body.title,
      description: req.body.description!
    })

    await this.createTaskCommandHandler.execute(command)

    res.status(201).json({ message: 'Task created' })
  }

  listMyTasks = async (req: Request, res: Response) => {
    const ownerId = req.user!.id

    const limit = Math.min(Number(req.query.limit) || 10, 100)
    const offset = Number(req.query.offset) || 0

    const status = req.query.status as TaskStatusEnum | undefined
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

    const tasks = await this.listMyTasksQueryHandler.execute(query)

    res.json(tasks)
  }

  getById = async (req: Request, res: Response) => {
    const query = new GetTaskByIdQuery(
      req.params.id,
      req.user!.id,
      req.user!.role
    )

    const task = await this.getTaskByIdQueryHandler.execute(query)

    res.json(task)
  }

  update = async (req: Request, res: Response) => {
    const command = new UpdateTaskCommand(
      req.params.id,
      req.user!.id,
      req.user!.role,
      {
        title: req.body.title,
        description: req.body.description!,
        status: req.body.status
      }
    )

    await this.updateTaskCommandHandler.execute(command)

    res.json({ message: 'Task updated' })
  }

  delete = async (req: Request, res: Response) => {
    const command = new SoftDeleteTaskCommand(
      req.params.id,
      req.user!.id,
      req.user!.role
    )

    await this.softDeleteTaskCommandHandler.execute(command)

    res.status(204).send()
  }
}
