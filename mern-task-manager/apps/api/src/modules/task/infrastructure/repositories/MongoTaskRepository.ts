import { Task } from "../../domain/entities/Task"
import { ITaskRepository } from '../../domain/repositories/TaskRepository'
import { TaskDescription } from "../../domain/value-objects/TaskDescription"
import { TaskStatus } from "../../domain/value-objects/TaskStatus"
import { TaskTitle } from "../../domain/value-objects/TaskTitle"
import { TaskModel } from '../models/TaskModel'
import { OutboxModel } from '@/shared/infrastructure/mongo/OutboxModel'

type TaskModel<Task> = Task & Document

export class MongoTaskRepository implements ITaskRepository {

  private toDomain(document: TaskModel<Task>): Task {
    return Task.rehydrate(document.id, {
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
      title: TaskTitle.create(doc.title),
      description: TaskDescription.create(doc.description!),
      status: TaskStatus.from(doc.status),
      ownerId: doc.ownerId,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt!
    })
  }

  async findByOwner(ownerId: string, options: {
    limit: number
    offset: number
    status?: string
    sort?: string
  }): Promise<Task[]> {
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
    // return documents.map(doc =>
    //   Task.rehydrate(doc._id, {
    //     title: TaskTitle.create(doc.title),
    //     description: TaskDescription.create(doc.description!),
    //     status: TaskStatus.from(doc.status),
    //     ownerId: doc.ownerId,
    //     isActive: doc.isActive,
    //     createdAt: doc.createdAt,
    //     updatedAt: doc.updatedAt,
    //     deletedAt: doc.deletedAt!
    //   })
    // )
  }

  async countByOwner(ownerId: string, status?: string): Promise<number> {
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
    // No transaction for test
    // if (process.env.NODE_ENV === 'test') {
      await TaskModel.create({
        _id: task.id,
        title: task.title.value,
        description: task.description!.value,
        status: task.status.value,
        ownerId: task.ownerId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        deletedAt: task.deletedAt
      })

    //   return
    // }

    // const session = await TaskModel.startSession()

    // await session.withTransaction(async () => {
    //   await TaskModel.create([{
    //     _id: task.id,
    //     title: task.title.value,
    //     description: task.description!.value,
    //     status: task.status.value,
    //     ownerId: task.ownerId,
    //     createdAt: task.createdAt,
    //     updatedAt: task.updatedAt,
    //     deletedAt: task.deletedAt
    //   }], { session })

    //   const events = task.pullDomainEvents()

    //   if (events.length > 0) {
    //     await OutboxModel.insertMany(
    //       events.map(event => ({
    //         eventName: event.constructor.name,
    //         payload: event,
    //         occurredOn: event.occurredOn,
    //         processed: false
    //       })),
    //       { session }
    //     )
    //   }
    // })

    //session.endSession()
  }

  async update(task: Task): Promise<void> {
    await TaskModel.updateOne(
      { _id: task.id },
      {
        $set: {
          title: task.title,
          description: task.description!,
          status: task.status,
          isActive: task.isActive
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
      {
        $set: {
          isActive: false
        }
      }
    )
  }
}
