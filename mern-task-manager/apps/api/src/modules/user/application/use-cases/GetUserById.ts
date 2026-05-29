import { IQuery } from '@/shared/application/query-bus/IQuery'
import { IQueryHandler } from '@/shared/application/query-bus/IQueryHandler'
import { IUserResponseDTO } from '@/modules/user/application/dto/IUserResponseDTO'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { IUserRepository } from '../ports/outbound/IUserRepository'

export class GetUserByIdQuery 
implements IQuery<IUserResponseDTO> {
  
  constructor(
    public readonly id: string
  ) { }
}

export class GetUserByIdHandler  
implements IQueryHandler<GetUserByIdQuery, IUserResponseDTO> {

  constructor(
    private readonly repository: IUserRepository
  ) { }

  async execute(query: GetUserByIdQuery): Promise<IUserResponseDTO> {
    const user = await this.repository.findById(query.id)

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
