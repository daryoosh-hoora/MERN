import { UserRepository } from '../../../domain/user/UserRepository'
import { UpdateUserCommand } from './UpdateUserCommand'
import { UserResponse } from '../dto/UserResponse'

export class UpdateUserHandler {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserResponse> {
    const user = await this.userRepo.findById(command.id)

    if (!user) {
      throw new Error('User not found')
    }

    if (command.email) {
      user.updateEmail(command.email)
    }

    if (command.role) {
      user.updateRole(command.role)
    }

    await this.userRepo.update(user)

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  }
}
