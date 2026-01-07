import { UserRepository } from '../../../domain/user/UserRepository.js'
import { UserResponse } from '../dto/UserResponse.js'

export class GetUserByIdHandler {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<UserResponse | null> {
    const user = await this.userRepo.findById(id)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  }
}
