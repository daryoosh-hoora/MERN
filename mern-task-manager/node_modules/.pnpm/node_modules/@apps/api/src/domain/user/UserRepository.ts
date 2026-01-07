import { User } from './User.js'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<User[]>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>
  update(user: User): Promise<void>
}
