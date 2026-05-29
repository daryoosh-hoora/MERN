import { IUserRepository } from '../ports/outbound/IUserRepository'
import { UserRoleEnum } from '../../infrastructure/adapters/UserApplicationService'
import { IUserResponseDTO } from '@/modules/user/application/dto/IUserResponseDTO'
import { IQuery } from '@/shared/application/query-bus/IQuery'
import { IQueryHandler } from '@/shared/application/query-bus/IQueryHandler'

export class GetAllUsersQuery
  implements IQuery<IUserResponseDTO[]> {

  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly role?: string,
    public readonly sortField?: string,
    public readonly sortDirection?: string
  ) { }
}

export class GetAllUsersHandler
  implements IQueryHandler<GetAllUsersQuery, IUserResponseDTO[]> {

  constructor(
    private readonly userRepository: IUserRepository
  ) { }

  async execute(query: GetAllUsersQuery): Promise<IUserResponseDTO[]> {
    const users = await this.userRepository.findAll({
      limit: query.limit,
      offset: query.offset,
      role: query.role,
      sortField: query.sortField
    })

    return users.map(user => ({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined
    }))
  }
}
