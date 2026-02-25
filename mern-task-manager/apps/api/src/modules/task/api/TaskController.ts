import { Request, Response } from 'express'

import { ErrorCodes } from '@/shared/application/ErrorCodes'

import { GetAllTasksQuery } from '../application/queries/GetAllTasksQuery'
import { GetTaskByIdQuery } from '../application/queries/GetTaskByIdQuery'
import { ITaskApplicationService } from '../application/ports/inbound/ITaskApplicationService'

export class TaskController {
  constructor(
    private readonly taskApplicationService: ITaskApplicationService
  ) { }

  create = async (req: Request, res: Response) => {
    const userId = req.user!.id

    const result = await this.taskApplicationService.createTask({
      title: req.body.title,
      description: req.body.description!
    })

    if (result.isFailure) {
      switch (result.error?.code) {
        case ErrorCodes.UNAUTHORIZED:
          return res.status(401).json(result.error)

        case ErrorCodes.VALIDATION_ERROR:
          return res.status(400).json(result.error)

        default:
          return res.status(400).json(result.error)
      }
    }

    return res.status(201).json({
      id: result.value
    })
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const ownerId = req.user!.id

    const limit = Math.min(Number(req.query.limit) || 10, 100)
    const offset = Number(req.query.offset) || 0

    const status = req.query.status as TaskStatusEnum | undefined
    const sortParam = req.query.sort as string | undefined

    let sortField: 'createdAt' | 'status' | undefined
    let sortDirection: 'asc' | 'desc' | undefined

    if (sortParam) {
      const [field, direction] = sortParam.split('_')

      if (['createdAt', 'status'].includes(field)) {
        sortField = field as any
        sortDirection = direction === 'asc' ? 'asc' : 'desc'
      }
    }

    const query = new GetAllTasksQuery(
      limit,
      offset,
      status,
      sortField,
      sortDirection
    )

    const tasks = await this.taskApplicationService.getAllTasks(query)

    res.json(tasks)
  }

  getById = async (req: Request, res: Response) => {
    const query = new GetTaskByIdQuery(
      req.params.id
    )

    const task = await this.taskApplicationService.getTaskById(query)

    res.json(task)
  }

  update = async (req: Request, res: Response) => {
    const result = await this.taskApplicationService.updateTask({
      taskId: req.params.id,
      title: req.body.title,
      description: req.body.description!,
      status: req.body.status
    })

    if (result.isFailure) {
      switch (result.error?.code) {
        case ErrorCodes.UNAUTHORIZED:
          return res.status(401).json(result.error)

        case ErrorCodes.VALIDATION_ERROR:
          return res.status(400).json(result.error)

        default:
          return res.status(400).json(result.error)
      }
    }

    res.json({ message: 'Task updated' })
  }

  delete = async (req: Request, res: Response) => {
    const result = await this.taskApplicationService.deleteTask({
      taskId: req.params.id
    })

    if (result.isFailure) {
      switch (result.error?.code) {
        case ErrorCodes.UNAUTHORIZED:
          return res.status(401).json(result.error)

        case ErrorCodes.VALIDATION_ERROR:
          return res.status(400).json(result.error)

        default:
          return res.status(400).json(result.error)
      }
    }

    res.status(204).send()
  }
}
