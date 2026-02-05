import { TaskRepository } from '../../domain/task/TaskRepository.js'
import { Task } from '../../domain/task/Task.js'
import { TaskModel } from '../models/TaskModel.js'

export class MongoTaskRepository implements TaskRepository {

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

  async findByOwner(ownerId: string, options?: any): Promise<Task[]> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const docs = await TaskModel.find({
      ownerId,
      isActive: true
    })
      .skip(offset)
      .limit(limit)
      .lean()

    return docs.map(doc =>
      Task.rehydrate(doc._id, {
        title: doc.title,
        description: doc.description,
        status: doc.status,
        ownerId: doc.ownerId,
        isActive: doc.isActive,
        createdAt: doc.createdAt
      })
    )
  }

  async save(task: Task): Promise<void> {
    await TaskModel.create({
      _id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      ownerId: task.ownerId,
      isActive: true,
      createdAt: task.createdAt
    })
  }

  async update(task: Task): Promise<void> {
    await TaskModel.updateOne(
      { _id: task.id },
      {
        $set: {
          title: task.title,
          description: task.description,
          status: task.status
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
