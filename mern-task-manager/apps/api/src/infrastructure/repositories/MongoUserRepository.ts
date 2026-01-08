import { User } from '../../domain/user/User.js'
import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../../domain/user/UserRepository.js'

export class MongoUserRepository implements UserRepository {

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      _id: id,
      isActive: true
    }).lean()

    if (!doc) return null

    return User.create({
      id: doc._id,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email, isActive: true }).lean()
    if (!doc) return null

    return User.create({
      id: doc._id,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role
    })
  }

  async findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<User[]> {
    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    const docs = await UserModel.find({ isActive: true })
      .skip(offset)
      .limit(limit)
      .lean()

    return docs.map(doc =>
      User.create({
        id: doc._id,
        email: doc.email,
        passwordHash: doc.passwordHash,
        role: doc.role
      })
    )
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      _id: user.id,
      email: user.email,
      passwordHash: (user as any).props.passwordHash,
      role: user.role,
      createdAt: user.createdAt
    })
  }

  async delete(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: id })
  }

  async softDelete(id: string): Promise<void> {
    await UserModel.updateOne(
      { _id: id },
      {
        $set: { isActive: false }
      }
    )
  }

  async update(user: User): Promise<void> {
    await UserModel.updateOne(
      { _id: user.id },
      {
        $set: {
          email: user.email,
          role: user.role
        }
      })
  }
}
