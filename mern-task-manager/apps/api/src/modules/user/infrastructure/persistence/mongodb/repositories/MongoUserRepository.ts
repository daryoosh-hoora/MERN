import { User } from '@/modules/user/domain/entities/User'
import { UserModel } from '../models/UserModel'
import { IUserRepository } from '../../../../application/ports/outbound/IUserRepository'

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      _id: id,
      isActive: true
    }).lean()

    if (!doc) return null

    return User.rehydrate(
      doc._id,
      doc.email,
      doc.passwordHash,
      doc.role!
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      email,
      isActive: true
    }).lean()

    if (!doc) return null

    return User.rehydrate(
      doc._id,
      doc.email,
      doc.passwordHash,
      doc.role!
    )
  }

  async findAll(options?: {
    limit?: number
    offset?: number
    role?: string
    sortField?: string
    sortDirection?: string
  }): Promise<User[]> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const filter: any = {
      isActive: true,
      deletedAt: null
    }

    if (options?.role) {
      filter.role = options?.role
    }

    const docs = await UserModel.find(filter)
      .skip(offset)
      .limit(limit)
      .lean()

    return docs.map(doc => User.rehydrate(
      doc._id,
      doc.email,
      doc.passwordHash,
      doc.role!
    ))
  }

  async count(role?: string): Promise<number> {
    const filter: any = {
      isActive: true,
      deletedAt: null
    }

    if (role) {
      filter.role = role
    }

    return UserModel.countDocuments(filter)
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      _id: user.id.toString(),
      email: user.email,
      passwordHash: (user as any).props.passwordHash,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt!
    })
  }

  async delete(id: string, permanently?: boolean): Promise<void> {
    if (permanently) {
      await UserModel.deleteOne({ _id: id })
    } else {
      await UserModel.updateOne(
        { _id: id },
        {
          $set: {
            isActive: false,
            deletedAt: new Date()
          }
        }
      )
    }
  }

  async update(user: User): Promise<void> {
    await UserModel.updateOne(
      { _id: user.id },
      {
        $set: {
          email: user.email,
          role: user.role
        }
      }
    )
  }
}
