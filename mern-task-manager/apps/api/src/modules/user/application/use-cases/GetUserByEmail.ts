import { IUserRepository } from '../ports/outbound/IUserRepository'
import { IUserResponseDTO } from '../dto/IUserResponseDTO'
import { IQuery } from '@/shared/application/query-bus/IQuery'
import { IQueryHandler } from '@/shared/application/query-bus/IQueryHandler'
import { NotFoundError } from '@/shared/errors/NotFoundError'

export class GetUserByEmailQuery 
implements IQuery<IUserResponseDTO> {
  
  constructor(
    public readonly email: string
  ) { }
}

export class GetUserByEmailHandler  
implements IQueryHandler<GetUserByEmailQuery, IUserResponseDTO> {

  constructor(
    private readonly repository: IUserRepository
  ) { }

  async execute(query: GetUserByEmailQuery): Promise<IUserResponseDTO> {
    const user = await this.repository.findByEmail(query.email)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined
    }
  }
}
