import { UserRepository } from '../../../domain/user/UserRepository.js'
import { UserResponse } from '../dto/UserResponse.js'
import { ListUsersQuery } from './ListUsersQuery.js'

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
