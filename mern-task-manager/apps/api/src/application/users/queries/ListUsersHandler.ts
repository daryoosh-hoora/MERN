import { UserRepository } from '../../../domain/user/UserRepository'
import { UserResponse } from '../dto/UserResponse'
import { ListUsersQuery } from './ListUsersQuery'

export class ListUsersHandler {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: ListUsersQuery): Promise<UserResponse[]> {
    const users = await this.userRepo.findAll({
      limit: query.limit,
      offset: query.offset
    })

    return users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }))
  }
}
