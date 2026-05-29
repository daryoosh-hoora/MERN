import { UserRoleEnum } from '@/modules/user/infrastructure/adapters/UserApplicationService'
import { User } from '../../../domain/entities/User'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(options?: {
    limit?: number
    offset?: number
    role?: UserRoleEnum
    sortField?: string
    sortDirection?: string    
  }): Promise<User[]>
  count(role?: string): Promise<number>
  save(user: User): Promise<void>
  delete(id: string, permanently?: boolean): Promise<void>
  update(user: User): Promise<void>
}
