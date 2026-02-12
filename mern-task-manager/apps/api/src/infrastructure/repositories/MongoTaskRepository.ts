import { TaskRepository } from '../../domain/task/TaskRepository.js'
import { Task } from '../../domain/task/Task.js'
import { TaskModel } from '../models/TaskModel.js'
import { OutboxModel } from '../../shared/infrastructure/mongo/OutboxModel.js'
export class MongoTaskRepository implements TaskRepository {
  constructor(private readonly model: TaskModel<Task>) { }

  private toDomain(document: TaskModel): Task {
    return Task.rehydrate(document._id, {
      title: document.title,
      description: document.description,
      status: document.status,
      ownerId: document.ownerId,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      deletedAt: document.deletedAt
    })
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await TaskModel.findOne({
      _id: id,
      isActive: true
    }).lean()

    if (!doc) return null

    return Task.rehydrate(doc._id, {
      title: doc.title,
      description: doc.description,
      status: doc.status,
      ownerId: doc.ownerId,
      isActive: doc.isActive,
      createdAt: doc.createdAt
    })
  }

  async findByOwner(
    ownerId: string,
    options: {
      limit: number
      offset: number
      status?: string
      sort?: string
    }
  ): Promise<Task[]> {

    const filter: any = {
      ownerId,
      deletedAt: null
    }

    if (options.status) {
      filter.status = options.status
    }

    const allowedSortFields = ['createdAt', 'status'] as const

    let sort: Record<string, 1 | -1> = { createdAt: -1 }

    if (options.sort) {
      const [field, direction] = options.sort.split('_')

      if (allowedSortFields.includes(field as any)) {
        sort = {
          [field]: direction === 'asc' ? 1 : -1
        }
      }
    }

    const documents = await TaskModel
      .find(filter)
      .sort(sort)
      .skip(options.offset)
      .limit(options.limit)

    return documents.map(this.toDomain)
  }

  // async findByOwner(ownerId: string, options?: any): Promise<Task[]> {
  //   const limit = options?.limit ?? 20
  //   const offset = options?.offset ?? 0

  //   const documents = await TaskModel.find({
  //     ownerId,
  //     isActive: true
  //   })
  //     .skip(offset)
  //     .limit(limit)
  //     .lean()

  //   return documents.map(doc =>
  //     Task.rehydrate(doc._id, {
  //       title: doc.title,
  //       description: doc.description,
  //       status: doc.status,
  //       ownerId: doc.ownerId,
  //       isActive: doc.isActive,
  //       createdAt: doc.createdAt
  //     })
  //   )
  // }

  async countByOwner(
    ownerId: string,
    status?: string
  ): Promise<number> {

    const filter: any = {
      ownerId,
      deletedAt: null
    }

    if (status) {
      filter.status = status
    }

    return TaskModel.countDocuments(filter)
  }

  async save(task: Task): Promise<void> {

    const session = await this.model.startSession()

    await session.withTransaction(async () => {

      await this.model.create([{
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        ownerId: task.ownerId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        deletedAt: task.deletedAt
      }], { session })

      const events = task.pullDomainEvents()

      if (events.length > 0) {
        await OutboxModel.insertMany(
          events.map(event => ({
            eventName: event.constructor.name,
            payload: event,
            occurredOn: event.occurredOn,
            processed: false
          })),
          { session }
        )
      }
    })

    session.endSession()
  }

  // async save(task: Task): Promise<void> {
  //   await TaskModel.create({
  //     _id: task.id,
  //     title: task.title,
  //     description: task.description,
  //     status: task.status,
  //     ownerId: task.ownerId,
  //     isActive: true,
  //     createdAt: task.createdAt
  //   })
  // }

  async update(task: Task): Promise<void> {
    await TaskModel.updateOne(
      { _id: task.id },
      {
        $set: {
          title: task.title,
          description: task.description,
          status: task.status,
          isActive: !task.isDeleted()
        }
      }
    )
  }

  async delete(id: string): Promise<void> {
    await TaskModel.deleteOne({ _id: id })
  }

  async softDelete(id: string): Promise<void> {
    await TaskModel.updateOne(
      { _id: id },
      { $set: { isActive: false } }
    )
  }
}
