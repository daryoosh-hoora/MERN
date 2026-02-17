import { UserRepository } from '../../../domain/user/UserRepository'
import { SoftDeleteUserCommand } from './SoftDeleteUserCommand'

export class SoftDeleteUserHandler {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: SoftDeleteUserCommand): Promise<void> {
    const user = await this.userRepo.findById(command.id)

    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepo.softDelete(command.id)
  }
}
